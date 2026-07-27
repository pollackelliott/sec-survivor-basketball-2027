window.SEASON_PROFILES = window.SEASON_PROFILES || {};

const SEC_BASKETBALL_2027_START = '2026-12-28';
const SEC_BASKETBALL_2027_TOTAL_WEEKS = 10;

const SEC_BASKETBALL_2027_WEEKS = buildWeeklyWindows({
  firstWeekStart: SEC_BASKETBALL_2027_START,
  totalWeeks: SEC_BASKETBALL_2027_TOTAL_WEEKS,
  weekOneRequiredGames: 1,
  standardRequiredGames: 2
});

window.SEASON_PROFILES.secBasketball2027 = {
  identity: {
    key: 'secBasketball2027',
    name: 'SEC Survivor',
    sport: 'Basketball',
    sportKey: 'basketball',
    seasonYear: 2027,
    conference: 'SEC',
    conferenceKey: 'sec'
  },

  environment: {
    developmentMode: true
  },

  season: {
    totalWeeks: SEC_BASKETBALL_2027_TOTAL_WEEKS,
    strikeLimit: 3,
    timezone: 'America/Chicago',
    firstWeekStartsOn: SEC_BASKETBALL_2027_WEEKS[0].startsOn,
    finalWeekEndsOn:
      SEC_BASKETBALL_2027_WEEKS[
        SEC_BASKETBALL_2027_WEEKS.length - 1
      ].endsOn
  },

  rulesetKey: 'basketball',

  rules: {
    weekOne: {
      requiredConferenceGames: 1,
      lockAt: '2027-01-02T11:00:00-06:00',
      scoringType: 'single_game',
      lossResult: 'strike',
      resultCanEliminatePlayer: false
    },

    standardWeeks: {
      requiredConferenceGames: 2,
      defaultLockDay: 'Tuesday',
      defaultLockTime: '18:00',
      scoringType: 'two_game',
      undefeatedResult: 'safe',
      splitResult: 'strike',
      winlessResult: 'eliminated'
    }
  },

  weeks: SEC_BASKETBALL_2027_WEEKS,

  teamWeekOverrides: {},

  backend: {
    enabled: false,
    supabaseUrl: 'https://placeholder.supabase.co',
    supabaseAnonKey: 'not-configured'
  }
};
