#!/usr/bin/env python3
"""
Initialize SEC Survivor Basketball 2027 from the commissioner's Excel grid.

Workbook authority:
  - sheet: SEC
  - rows 3:18: the 16 SEC teams
  - Week 1: column B (Saturday only)
  - Weeks 2-10: paired columns C:T (midweek label, Saturday)
  - a blank midweek cell is that team's one survivor bye
  - "at Opponent" means the row team is away; otherwise the row team is home

The midweek date printed in row 2 is a survivor-slot label, not a promise that
every game is Tuesday. ESPN matching therefore checks both that Tuesday and the
following Wednesday.

ESPN is used to resolve exact tipoff timestamps and confirm home/away. The Excel
grid remains authoritative for survivor-week membership.

Environment variables required for a live initialization:
  SUPABASE_URL
  SUPABASE_PUBLISHABLE_KEY
  SUPABASE_SECRET_KEY

The secret key is backend-only and is never written to the repository.
"""

from __future__ import annotations

import argparse
from collections import defaultdict
from datetime import date, datetime, time, timedelta
import json
import os
from pathlib import Path
import sys
from zoneinfo import ZoneInfo

from openpyxl import load_workbook
import requests

ROOT = Path(__file__).resolve().parents[1]
SHEET_NAME = "SEC"
CHICAGO = ZoneInfo("America/Chicago")
WEEKS = 10

SEC_TEAMS = {
    "Alabama", "Arkansas", "Auburn", "Florida", "Georgia", "Kentucky", "LSU",
    "Mississippi State", "Missouri", "Oklahoma", "Ole Miss", "South Carolina",
    "Tennessee", "Texas", "Texas A&M", "Vanderbilt",
}

NAME_FIXES = {
    "Mississippi": "Ole Miss",
    "Mississippi St": "Mississippi State",
    "Mississippi St.": "Mississippi State",
    "Texas A&M-Corpus Christi": "Texas A&M-Corpus Christi",
}


def fail(message: str) -> None:
    raise RuntimeError(message)


def normalize_name(value: str) -> str:
    clean = " ".join(str(value).strip().split())
    canonical = {team.lower(): team for team in SEC_TEAMS}
    aliases = {alias.lower(): target for alias, target in NAME_FIXES.items()}
    return aliases.get(clean.lower(), canonical.get(clean.lower(), clean))


def parse_opponent(raw) -> tuple[str, bool]:
    value = " ".join(str(raw).strip().split())
    if value.lower().startswith("at "):
        return normalize_name(value[3:]), True
    return normalize_name(value), False


def locate_workbook(requested: str | None) -> Path:
    if requested:
        path = Path(requested)
        if not path.is_absolute():
            path = ROOT / path
        if not path.exists():
            fail(f"Workbook not found: {path}")
        return path

    candidates = sorted(
        p for p in (ROOT / "data").glob("*.xlsx")
        if not p.name.startswith("~$")
    )
    if len(candidates) != 1:
        fail(
            "Expected exactly one .xlsx workbook in data/. "
            f"Found {len(candidates)}: {[p.name for p in candidates]}"
        )
    return candidates[0]


def expected_columns() -> dict[int, list[int]]:
    mapping = {1: [2]}  # B
    for week in range(2, 11):
        start = 3 + (week - 2) * 2  # C/D, E/F, ... S/T
        mapping[week] = [start, start + 1]
    return mapping


def cell_date(cell) -> date:
    value = cell.value
    if isinstance(value, datetime):
        return value.date()
    if isinstance(value, date):
        return value
    fail(f"{cell.coordinate}: expected a real Excel date, found {value!r}")


def parse_workbook(path: Path) -> dict:
    wb = load_workbook(path, data_only=False, read_only=False)
    if SHEET_NAME not in wb.sheetnames:
        fail(f"Workbook must contain sheet {SHEET_NAME!r}; found {wb.sheetnames}")
    ws = wb[SHEET_NAME]

    team_rows: dict[str, int] = {}
    for row in range(3, 19):
        raw = ws.cell(row=row, column=1).value
        if raw is None:
            fail(f"A{row}: missing SEC team")
        team = normalize_name(raw)
        if team not in SEC_TEAMS:
            fail(f"A{row}: unknown SEC team {raw!r}")
        if team in team_rows:
            fail(f"A{row}: duplicate SEC team {team}")
        team_rows[team] = row

    if set(team_rows) != SEC_TEAMS:
        fail(
            f"SEC team rows do not match expected membership. "
            f"Missing={sorted(SEC_TEAMS-set(team_rows))}"
        )

    columns = expected_columns()
    weeks: list[dict] = []
    entries: dict[tuple[int, str, str], dict] = {}
    midweek_byes: dict[str, list[int]] = {team: [] for team in SEC_TEAMS}

    for week, cols in columns.items():
        header = ws.cell(row=1, column=cols[0]).value
        if str(header).strip() != f"Week {week}":
            fail(
                f"{ws.cell(row=1, column=cols[0]).coordinate}: "
                f"expected 'Week {week}', found {header!r}"
            )

        if week == 1:
            sat_date = cell_date(ws.cell(row=2, column=cols[0]))
            mid_date = None
        else:
            mid_date = cell_date(ws.cell(row=2, column=cols[0]))
            sat_date = cell_date(ws.cell(row=2, column=cols[1]))
            if sat_date.weekday() != 5:
                fail(f"Week {week} Saturday label is not a Saturday: {sat_date}")

        weeks.append(
            {
                "week": week,
                "midweek_date": mid_date.isoformat() if mid_date else None,
                "saturday_date": sat_date.isoformat(),
            }
        )

        for col_index, col in enumerate(cols):
            slot = "saturday" if week == 1 or col_index == 1 else "midweek"

            for team, row in team_rows.items():
                cell = ws.cell(row=row, column=col)
                raw = cell.value

                if raw is None or str(raw).strip() == "":
                    if slot == "saturday":
                        fail(f"{cell.coordinate}: Saturday games cannot be blank")
                    midweek_byes[team].append(week)
                    continue

                opponent, row_team_is_away = parse_opponent(raw)
                if opponent not in SEC_TEAMS:
                    fail(
                        f"{cell.coordinate}: {opponent!r} is not an SEC conference opponent"
                    )
                if opponent == team:
                    fail(f"{cell.coordinate}: {team} cannot play itself")

                opponent_row = team_rows[opponent]
                reciprocal_raw = ws.cell(row=opponent_row, column=col).value
                if reciprocal_raw is None or str(reciprocal_raw).strip() == "":
                    fail(
                        f"{cell.coordinate}: {team} lists {opponent}, but the reciprocal "
                        f"{opponent} cell is blank"
                    )

                reciprocal_opponent, reciprocal_is_away = parse_opponent(reciprocal_raw)
                if reciprocal_opponent != team:
                    fail(
                        f"{cell.coordinate}: {team} lists {opponent}, but reciprocal cell "
                        f"lists {reciprocal_raw!r}"
                    )
                if reciprocal_is_away == row_team_is_away:
                    fail(
                        f"{cell.coordinate}: home/away notation conflicts with reciprocal cell"
                    )

                pair = tuple(sorted((team, opponent)))
                key = (week, slot, "|".join(pair))
                if key in entries:
                    continue

                if row_team_is_away:
                    away, home = team, opponent
                else:
                    away, home = opponent, team

                slot_date = (
                    sat_date if slot == "saturday"
                    else mid_date
                )
                entries[key] = {
                    "week": week,
                    "slot": slot,
                    "date": slot_date.isoformat(),
                    "away": away,
                    "home": home,
                    "source_cell": cell.coordinate,
                }

    bad_byes = {
        team: weeks
        for team, weeks in midweek_byes.items()
        if len(weeks) != 1
    }
    if bad_byes:
        fail(
            "Each SEC team must have exactly one midweek bye in Weeks 2-10. "
            f"Invalid={bad_byes}"
        )

    return {
        "season": 2027,
        "conference": "SEC",
        "sport": "basketball",
        "sheet": SHEET_NAME,
        "weeks": weeks,
        "games": sorted(
            entries.values(),
            key=lambda x: (x["week"], x["slot"] != "midweek", x["away"], x["home"]),
        ),
        "midweek_bye_week": {
            team: weeks[0] for team, weeks in sorted(midweek_byes.items())
        },
    }


def fetch_scoreboard(day: date) -> list[dict]:
    url = (
        "https://site.api.espn.com/apis/site/v2/sports/basketball/"
        "mens-college-basketball/scoreboard"
    )
    response = requests.get(
        url,
        params={
            "dates": day.strftime("%Y%m%d"),
            "groups": 50,  # all Division I; workbook remains the conference authority
            "limit": 500,
        },
        timeout=30,
    )
    response.raise_for_status()
    return response.json().get("events", [])


def parse_espn_event(event: dict) -> dict:
    competition = event["competitions"][0]
    competitors = competition["competitors"]
    home = next(row for row in competitors if row["homeAway"] == "home")
    away = next(row for row in competitors if row["homeAway"] == "away")

    def team_name(row: dict) -> str:
        team = row["team"]
        return normalize_name(team.get("location") or team.get("displayName"))

    return {
        "event_id": event.get("id"),
        "away": team_name(away),
        "home": team_name(home),
        "tipoff_at": event["date"],
    }


def resolve_espn(parsed: dict) -> list[dict]:
    cache: dict[date, list[dict]] = {}
    resolved: list[dict] = []
    problems: list[str] = []

    def events_for(day: date) -> list[dict]:
        if day not in cache:
            rows = []
            for raw in fetch_scoreboard(day):
                try:
                    rows.append(parse_espn_event(raw))
                except (KeyError, StopIteration, TypeError, ValueError) as exc:
                    print(
                        f"::warning::Could not parse ESPN event "
                        f"{raw.get('id','unknown')} on {day}: {exc}"
                    )
            cache[day] = rows
        return cache[day]

    for expected in parsed["games"]:
        label_day = date.fromisoformat(expected["date"])
        candidate_days = (
            [label_day, label_day + timedelta(days=1)]
            if expected["slot"] == "midweek"
            else [label_day]
        )

        pair = {expected["away"], expected["home"]}
        matches = []
        for day in candidate_days:
            matches.extend(
                event
                for event in events_for(day)
                if {event["away"], event["home"]} == pair
            )

        unique = {
            event["event_id"]: event
            for event in matches
            if event.get("event_id") is not None
        }
        matches = list(unique.values())

        if len(matches) != 1:
            problems.append(
                f"Week {expected['week']} {expected['slot']}: "
                f"{expected['away']} @ {expected['home']} matched "
                f"{len(matches)} ESPN events across {[d.isoformat() for d in candidate_days]}"
            )
            continue

        event = matches[0]
        if event["away"] != expected["away"] or event["home"] != expected["home"]:
            problems.append(
                f"Week {expected['week']} {expected['slot']}: workbook says "
                f"{expected['away']} @ {expected['home']}, ESPN says "
                f"{event['away']} @ {event['home']}"
            )
            continue

        resolved.append(
            {
                "week": expected["week"],
                "slot": expected["slot"],
                "away": event["away"],
                "home": event["home"],
                "tipoff_at": event["tipoff_at"],
                "away_score": None,
                "home_score": None,
                "winner": None,
                "is_final": False,
            }
        )

    if problems:
        for problem in problems:
            print(f"::error::{problem}", file=sys.stderr)
        fail(
            f"ESPN validation failed with {len(problems)} problem(s). "
            "No database changes were made."
        )

    return sorted(
        resolved,
        key=lambda row: (row["week"], row["tipoff_at"], row["away"], row["home"]),
    )


def chicago_ts(day: date, clock: time) -> str:
    local = datetime.combine(day, clock, tzinfo=CHICAGO)
    return local.isoformat()


def build_week_rows(parsed: dict) -> list[dict]:
    rows = []
    for item in parsed["weeks"]:
        week = item["week"]
        saturday = date.fromisoformat(item["saturday_date"])

        if week == 1:
            opens_at = None  # commissioner opens Week 1 when the site is ready
            locks_at = chicago_ts(saturday, time(10, 59))
        else:
            midweek = date.fromisoformat(item["midweek_date"])
            monday = midweek - timedelta(days=1)
            opens_at = chicago_ts(monday, time(5, 0))
            locks_at = chicago_ts(midweek, time(17, 59))

        rows.append(
            {
                "week": week,
                "label": f"Week {week}",
                "opens_at": opens_at,
                "locks_at": locks_at,
                "midweek_date": item["midweek_date"],
                "saturday_date": item["saturday_date"],
                "lock_note": None,
            }
        )
    return rows


def headers(secret_key: str) -> dict[str, str]:
    # New Supabase secret keys are sent on apikey, not Bearer Authorization.
    return {"apikey": secret_key}


def get_rows(base_url: str, secret_key: str, table: str, params: dict) -> list[dict]:
    response = requests.get(
        f"{base_url}/rest/v1/{table}",
        headers=headers(secret_key),
        params=params,
        timeout=30,
    )
    response.raise_for_status()
    return response.json()


def assert_safe_to_initialize(base_url: str, secret_key: str) -> None:
    picks = get_rows(base_url, secret_key, "picks", {"select": "id", "limit": 1})
    if picks:
        fail(
            "Initialization blocked because picks already exist. "
            "This workflow never rewrites a live pool."
        )


def clear_table(base_url: str, secret_key: str, table: str) -> None:
    # Every row has a non-null primary key.
    pk = "week" if table == "weeks" else "id"
    response = requests.delete(
        f"{base_url}/rest/v1/{table}",
        headers={**headers(secret_key), "Prefer": "return=minimal"},
        params={pk: "not.is.null"},
        timeout=30,
    )
    response.raise_for_status()


def insert_rows(base_url: str, secret_key: str, table: str, rows: list[dict]) -> None:
    response = requests.post(
        f"{base_url}/rest/v1/{table}",
        headers={
            **headers(secret_key),
            "Content-Type": "application/json",
            "Prefer": "return=minimal",
        },
        json=rows,
        timeout=30,
    )
    response.raise_for_status()


def verify_database(
    base_url: str,
    secret_key: str,
    weeks: list[dict],
    games: list[dict],
) -> None:
    db_weeks = get_rows(
        base_url, secret_key, "weeks",
        {"select": "week,midweek_date,saturday_date", "order": "week.asc"},
    )
    db_games = get_rows(
        base_url, secret_key, "games",
        {"select": "week,slot,away,home,tipoff_at", "order": "week.asc,tipoff_at.asc"},
    )

    if {
        (row["week"], row["midweek_date"], row["saturday_date"])
        for row in db_weeks
    } != {
        (row["week"], row["midweek_date"], row["saturday_date"])
        for row in weeks
    }:
        fail("Post-write verification failed for weeks table")

    if {
        (row["week"], row["slot"], row["away"], row["home"])
        for row in db_games
    } != {
        (row["week"], row["slot"], row["away"], row["home"])
        for row in games
    }:
        fail("Post-write verification failed for games table")


def write_generated_files(
    workbook: Path,
    parsed: dict,
    weeks: list[dict],
    games: list[dict],
    base_url: str,
    publishable_key: str,
) -> None:
    normalized = {
        **parsed,
        "source_workbook": workbook.name,
        "weeks_table": weeks,
        "resolved_games": games,
    }

    data_dir = ROOT / "data"
    data_dir.mkdir(parents=True, exist_ok=True)
    (data_dir / "normalized-schedule.json").write_text(
        json.dumps(normalized, indent=2) + "\n",
        encoding="utf-8",
    )

    config = {
        "year": 2027,
        "weeks": 10,
        "supabaseUrl": base_url,
        "supabasePublishableKey": publishable_key,
    }
    (ROOT / "app-config.js").write_text(
        "// Generated by scripts/initialize_season.py.\n"
        "// Contains public browser configuration only; never add the secret key.\n"
        f"window.SURVIVOR_APP_CONFIG = {json.dumps(config, indent=2)};\n",
        encoding="utf-8",
    )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--schedule-file", default=None)
    parser.add_argument(
        "--parse-only",
        action="store_true",
        help="Validate and normalize the Excel workbook without calling ESPN/Supabase.",
    )
    parser.add_argument(
        "--validate-only",
        action="store_true",
        help="Validate workbook + ESPN matching without writing Supabase.",
    )
    args = parser.parse_args()

    workbook = locate_workbook(args.schedule_file)
    parsed = parse_workbook(workbook)
    print(
        f"Workbook valid: {len(parsed['games'])} unique SEC games across "
        f"{len(parsed['weeks'])} survivor weeks."
    )
    print(
        "Midweek bye validation passed: every SEC team has exactly one "
        "Weeks 2-10 midweek bye."
    )

    if args.parse_only:
        print("Parse-only mode complete; no ESPN or Supabase calls made.")
        return

    games = resolve_espn(parsed)
    weeks = build_week_rows(parsed)
    print(f"ESPN resolved all {len(games)} survivor games.")

    if args.validate_only:
        print("Validation-only mode complete; no Supabase changes made.")
        return

    base_url = os.environ["SUPABASE_URL"].rstrip("/")
    publishable_key = os.environ["SUPABASE_PUBLISHABLE_KEY"]
    secret_key = os.environ["SUPABASE_SECRET_KEY"]

    assert_safe_to_initialize(base_url, secret_key)

    clear_table(base_url, secret_key, "games")
    clear_table(base_url, secret_key, "weeks")
    insert_rows(base_url, secret_key, "weeks", weeks)
    insert_rows(base_url, secret_key, "games", games)

    verify_database(base_url, secret_key, weeks, games)
    write_generated_files(
        workbook, parsed, weeks, games, base_url, publishable_key
    )

    print("SEC Survivor Basketball 2027 initialization complete.")
    print("Database verification passed.")
    print("Generated app-config.js and data/normalized-schedule.json.")


if __name__ == "__main__":
    main()
