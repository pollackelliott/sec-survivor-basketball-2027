#!/usr/bin/env python3
"""
Sync SEC Survivor Basketball 2027 game metadata/results from ESPN.

The Excel-derived Supabase schedule remains authoritative for:
  - survivor week
  - midweek vs Saturday slot
  - matchup
  - nominal scheduled date

ESPN is used only to:
  - fill exact tipoff_at once published
  - update scores
  - mark games final and set winner

A workbook "Tuesday" midweek slot may actually be played Wednesday. For
midweek rows the matcher searches both scheduled_date and scheduled_date + 1.
"""

from __future__ import annotations

import argparse
from datetime import date, datetime, timedelta
import os
import sys
from zoneinfo import ZoneInfo

import requests

CHICAGO = ZoneInfo("America/Chicago")
SUPABASE_URL = os.environ.get("SUPABASE_URL", "").rstrip("/")
SUPABASE_SECRET_KEY = os.environ.get("SUPABASE_SECRET_KEY", "")

SEC_TEAMS = {
    "Alabama", "Arkansas", "Auburn", "Florida", "Georgia", "Kentucky", "LSU",
    "Mississippi State", "Missouri", "Oklahoma", "Ole Miss", "South Carolina",
    "Tennessee", "Texas", "Texas A&M", "Vanderbilt",
}

NAME_FIXES = {
    "Mississippi": "Ole Miss",
    "Mississippi St": "Mississippi State",
    "Mississippi St.": "Mississippi State",
    "Texas A&M Aggies": "Texas A&M",
    "South Carolina Gamecocks": "South Carolina",
}


def normalize_name(value: str) -> str:
    clean = " ".join(str(value).strip().split())
    canonical = {team.lower(): team for team in SEC_TEAMS}
    aliases = {alias.lower(): target for alias, target in NAME_FIXES.items()}
    return aliases.get(clean.lower(), canonical.get(clean.lower(), clean))


def headers() -> dict[str, str]:
    if not SUPABASE_SECRET_KEY:
        raise RuntimeError("SUPABASE_SECRET_KEY is not configured")
    return {
        "apikey": SUPABASE_SECRET_KEY,
        "Content-Type": "application/json",
    }


def supabase_get(table: str, params: dict) -> list[dict]:
    response = requests.get(
        f"{SUPABASE_URL}/rest/v1/{table}",
        headers=headers(),
        params=params,
        timeout=30,
    )
    response.raise_for_status()
    return response.json()


def supabase_patch_game(game_id: int, payload: dict) -> None:
    response = requests.patch(
        f"{SUPABASE_URL}/rest/v1/games",
        headers={**headers(), "Prefer": "return=minimal"},
        params={"id": f"eq.{game_id}"},
        json=payload,
        timeout=30,
    )
    response.raise_for_status()


def fetch_scoreboard(day: date) -> list[dict]:
    url = (
        "https://site.api.espn.com/apis/site/v2/sports/basketball/"
        "mens-college-basketball/scoreboard"
    )
    response = requests.get(
        url,
        params={
            "dates": day.strftime("%Y%m%d"),
            "groups": 50,
            "limit": 500,
        },
        timeout=30,
    )
    response.raise_for_status()
    return response.json().get("events", [])


def parse_event(event: dict) -> dict:
    competition = event["competitions"][0]
    competitors = competition["competitors"]
    home = next(row for row in competitors if row["homeAway"] == "home")
    away = next(row for row in competitors if row["homeAway"] == "away")
    status = competition.get("status") or event.get("status") or {}
    status_type = status.get("type") or {}

    def team_name(row: dict) -> str:
        team = row["team"]
        return normalize_name(team.get("location") or team.get("displayName"))

    def score(row: dict) -> int | None:
        raw = row.get("score")
        if raw in (None, ""):
            return None
        try:
            return int(raw)
        except (TypeError, ValueError):
            return None

    away_name = team_name(away)
    home_name = team_name(home)
    away_score = score(away)
    home_score = score(home)
    completed = bool(status_type.get("completed"))

    winner = None
    if completed and away_score is not None and home_score is not None:
        if away_score > home_score:
            winner = away_name
        elif home_score > away_score:
            winner = home_name

    return {
        "event_id": event.get("id"),
        "away": away_name,
        "home": home_name,
        "tipoff_at": event.get("date"),
        "away_score": away_score,
        "home_score": home_score,
        "is_final": completed,
        "winner": winner,
    }


def candidate_days(game: dict) -> list[date]:
    nominal = date.fromisoformat(game["scheduled_date"])
    if game["slot"] == "midweek":
        return [nominal, nominal + timedelta(days=1)]
    return [nominal]


def load_events(days: set[date]) -> dict[date, list[dict]]:
    cache: dict[date, list[dict]] = {}
    for day in sorted(days):
        parsed = []
        for raw in fetch_scoreboard(day):
            try:
                parsed.append(parse_event(raw))
            except (KeyError, StopIteration, TypeError, ValueError) as exc:
                print(
                    f"WARNING: could not parse ESPN event "
                    f"{raw.get('id', 'unknown')} on {day}: {exc}",
                    file=sys.stderr,
                )
        cache[day] = parsed
    return cache


def match_game(game: dict, events: dict[date, list[dict]]) -> dict | None:
    pair = {game["away"], game["home"]}
    matches: dict[str, dict] = {}

    for day in candidate_days(game):
        for event in events.get(day, []):
            if {event["away"], event["home"]} != pair:
                continue
            event_id = str(event.get("event_id") or f"{day}:{event['away']}:{event['home']}")
            matches[event_id] = event

    if not matches:
        return None

    if len(matches) > 1:
        raise RuntimeError(
            f"Ambiguous ESPN match for Week {game['week']} {game['slot']}: "
            f"{game['away']} @ {game['home']} ({len(matches)} events)"
        )

    event = next(iter(matches.values()))
    if event["away"] != game["away"] or event["home"] != game["home"]:
        raise RuntimeError(
            f"Home/away mismatch for Week {game['week']} {game['slot']}: "
            f"workbook={game['away']} @ {game['home']}; "
            f"ESPN={event['away']} @ {event['home']}"
        )
    return event


def relevant_games(week: int | None, all_games: bool) -> list[dict]:
    params = {
        "select": "id,week,slot,away,home,scheduled_date,tipoff_at,away_score,home_score,winner,is_final",
        "order": "week.asc,scheduled_date.asc",
    }
    if week is not None:
        params["week"] = f"eq.{week}"
    rows = supabase_get("games", params)
    if all_games or week is not None:
        return rows

    today = datetime.now(CHICAGO).date()
    low = today - timedelta(days=1)
    high = today + timedelta(days=2)

    return [
        row for row in rows
        if low <= date.fromisoformat(row["scheduled_date"]) <= high
        and not (
            row["is_final"]
            and row.get("tipoff_at")
            and row.get("away_score") is not None
            and row.get("home_score") is not None
        )
    ]


def sync_game(game: dict, event: dict) -> bool:
    payload = {
        "tipoff_at": event["tipoff_at"],
        "away_score": event["away_score"],
        "home_score": event["home_score"],
        "winner": event["winner"],
        "is_final": event["is_final"],
        "updated_at": datetime.now(CHICAGO).isoformat(),
    }

    changed = any(game.get(key) != value for key, value in payload.items() if key != "updated_at")
    if not changed:
        return False

    if event["is_final"] and event["winner"] is None:
        raise RuntimeError(
            f"ESPN marked {game['away']} @ {game['home']} final without a non-tied winner"
        )

    supabase_patch_game(game["id"], payload)
    return True


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--week", type=int, default=None)
    parser.add_argument(
        "--all",
        action="store_true",
        help="Inspect every scheduled game instead of the current date window.",
    )
    args = parser.parse_args()

    if not SUPABASE_URL:
        raise RuntimeError("SUPABASE_URL is not configured")

    games = relevant_games(args.week, args.all)
    if not games:
        print("No relevant games to sync.")
        return

    days: set[date] = set()
    for game in games:
        days.update(candidate_days(game))

    events = load_events(days)
    matched = 0
    changed = 0
    missing = []

    for game in games:
        event = match_game(game, events)
        if event is None:
            missing.append(
                f"W{game['week']} {game['slot']}: {game['away']} @ {game['home']}"
            )
            continue

        matched += 1
        if sync_game(game, event):
            changed += 1
            print(
                f"Updated W{game['week']} {game['slot']}: "
                f"{game['away']} @ {game['home']} "
                f"(final={event['is_final']})"
            )

    print(
        f"Checked {len(games)} game(s); matched {matched}; "
        f"updated {changed}; unmatched {len(missing)}."
    )

    if missing:
        print("Unmatched games (often normal before ESPN publishes exact listings):")
        for row in missing:
            print(f"  - {row}")


if __name__ == "__main__":
    main()
