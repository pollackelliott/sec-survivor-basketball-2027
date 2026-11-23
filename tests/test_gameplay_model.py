import unittest


def week_result(week, wins, losses, final_games, midweek_final=False, midweek_won=False):
    if week == 1:
        if final_games == 0:
            return "pending"
        return "safe" if wins == 1 else "strike"

    if final_games == 2:
        if wins == 2:
            return "safe"
        if wins == 1:
            return "strike"
        return "eliminated"

    if midweek_final and not midweek_won:
        return "warning"

    return "pending"


def player_eliminated(prior_strikes, week, status, missed_pick=False):
    if missed_pick:
        return True
    if week == 1:
        return False
    if status == "eliminated":
        return True
    if status == "strike" and prior_strikes >= 2:
        return True
    if status == "warning" and prior_strikes >= 2:
        return True
    return False


def pool_may_end(week_complete, survivors):
    return week_complete and survivors <= 1


class BasketballGameplayTests(unittest.TestCase):
    def test_week_one_win_is_safe(self):
        self.assertEqual(week_result(1, 1, 0, 1), "safe")
        self.assertFalse(player_eliminated(0, 1, "safe"))

    def test_week_one_loss_is_strike_but_never_elimination(self):
        self.assertEqual(week_result(1, 0, 1, 1), "strike")
        self.assertFalse(player_eliminated(2, 1, "strike"))

    def test_midweek_win_stays_unresolved_not_green(self):
        self.assertEqual(
            week_result(4, 1, 0, 1, midweek_final=True, midweek_won=True),
            "pending",
        )

    def test_midweek_loss_turns_yellow(self):
        self.assertEqual(
            week_result(4, 0, 1, 1, midweek_final=True, midweek_won=False),
            "warning",
        )

    def test_midweek_loss_with_two_prior_strikes_eliminates_immediately(self):
        status = week_result(
            4, 0, 1, 1, midweek_final=True, midweek_won=False
        )
        self.assertEqual(status, "warning")
        self.assertTrue(player_eliminated(2, 4, status))

    def test_midweek_loss_with_one_prior_strike_does_not_eliminate(self):
        status = week_result(
            4, 0, 1, 1, midweek_final=True, midweek_won=False
        )
        self.assertFalse(player_eliminated(1, 4, status))

    def test_two_and_zero_is_clean_survival(self):
        status = week_result(5, 2, 0, 2)
        self.assertEqual(status, "safe")
        self.assertFalse(player_eliminated(2, 5, status))

    def test_one_and_one_is_strike(self):
        self.assertEqual(week_result(5, 1, 1, 2), "strike")

    def test_third_strike_eliminates_but_result_remains_strike(self):
        status = week_result(5, 1, 1, 2)
        self.assertEqual(status, "strike")
        self.assertTrue(player_eliminated(2, 5, status))

    def test_zero_and_two_is_direct_elimination(self):
        status = week_result(5, 0, 2, 2)
        self.assertEqual(status, "eliminated")
        self.assertTrue(player_eliminated(0, 5, status))

    def test_missed_pick_eliminates(self):
        self.assertTrue(player_eliminated(0, 6, "pending", missed_pick=True))

    def test_temporary_lone_survivor_does_not_end_pool_midweek(self):
        # Bill is out Tuesday, Tim is the only player not yet eliminated,
        # but Tim still has a Saturday game. Week is not complete.
        self.assertFalse(pool_may_end(False, 1))

    def test_completed_week_with_one_survivor_ends_pool(self):
        self.assertTrue(pool_may_end(True, 1))

    def test_completed_week_with_zero_survivors_ends_pool_without_winner(self):
        self.assertTrue(pool_may_end(True, 0))


if __name__ == "__main__":
    unittest.main()
