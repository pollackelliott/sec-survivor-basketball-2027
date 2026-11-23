import importlib.util
from datetime import date
from pathlib import Path
import unittest


SPEC = importlib.util.spec_from_file_location(
    "score_sync", Path(__file__).resolve().parents[1] / "scripts" / "update_scores.py"
)
score_sync = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(score_sync)


class ScoreSyncTests(unittest.TestCase):
    def test_midweek_searches_tuesday_and_wednesday(self):
        game = {
            "slot": "midweek",
            "scheduled_date": "2027-01-05",
        }
        self.assertEqual(
            score_sync.candidate_days(game),
            [date(2027, 1, 5), date(2027, 1, 6)],
        )

    def test_saturday_searches_only_saturday(self):
        game = {
            "slot": "saturday",
            "scheduled_date": "2027-01-09",
        }
        self.assertEqual(
            score_sync.candidate_days(game),
            [date(2027, 1, 9)],
        )

    def test_normalizes_espn_ole_miss_name(self):
        self.assertEqual(score_sync.normalize_name("Mississippi"), "Ole Miss")

    def test_match_requires_same_home_and_away(self):
        game = {
            "week": 2,
            "slot": "midweek",
            "scheduled_date": "2027-01-05",
            "away": "LSU",
            "home": "Alabama",
        }
        events = {
            date(2027, 1, 5): [
                {
                    "event_id": "1",
                    "away": "LSU",
                    "home": "Alabama",
                    "tipoff_at": "2027-01-06T01:00:00Z",
                    "away_score": None,
                    "home_score": None,
                    "is_final": False,
                    "winner": None,
                }
            ],
            date(2027, 1, 6): [],
        }
        matched = score_sync.match_game(game, events)
        self.assertEqual(matched["event_id"], "1")

    def test_home_away_disagreement_is_rejected(self):
        game = {
            "week": 2,
            "slot": "midweek",
            "scheduled_date": "2027-01-05",
            "away": "LSU",
            "home": "Alabama",
        }
        events = {
            date(2027, 1, 5): [
                {
                    "event_id": "1",
                    "away": "Alabama",
                    "home": "LSU",
                    "tipoff_at": "2027-01-06T01:00:00Z",
                    "away_score": None,
                    "home_score": None,
                    "is_final": False,
                    "winner": None,
                }
            ],
            date(2027, 1, 6): [],
        }
        with self.assertRaises(RuntimeError):
            score_sync.match_game(game, events)


if __name__ == "__main__":
    unittest.main()
