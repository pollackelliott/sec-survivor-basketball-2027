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
    sportKey: 'basketball',
    seasonYear: 2027,
    conference: 'SEC',
    conferenceKey: 'sec',
    conferenceMembershipKey: 'sec-2025'
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
  sportKey: 'basketball',
  rulesetKey: 'basketball',
  scheduleKey: 'secBasketball2027',

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

window.SEASON_SCHEDULES = window.SEASON_SCHEDULES || {};

window.SEASON_SCHEDULES.secBasketball2027 = {
  id: 'secBasketball2027',
  sportKey: 'basketball',
  conferenceKey: 'sec',
  seasonYear: 2027,

  games: [
    {
      id: '2027-01-02-alabama-mississippi-state',
      date: '2027-01-02',
      startsAt: null,
      awayTeam: 'Alabama',
      homeTeam: 'Mississippi State',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-01-02-auburn-texas-a-m',
      date: '2027-01-02',
      startsAt: null,
      awayTeam: 'Auburn',
      homeTeam: 'Texas A&M',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-01-02-florida-texas',
      date: '2027-01-02',
      startsAt: null,
      awayTeam: 'Florida',
      homeTeam: 'Texas',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-01-02-georgia-ole-miss',
      date: '2027-01-02',
      startsAt: null,
      awayTeam: 'Georgia',
      homeTeam: 'Ole Miss',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-01-02-kentucky-oklahoma',
      date: '2027-01-02',
      startsAt: null,
      awayTeam: 'Kentucky',
      homeTeam: 'Oklahoma',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-01-02-missouri-arkansas',
      date: '2027-01-02',
      startsAt: null,
      awayTeam: 'Missouri',
      homeTeam: 'Arkansas',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-01-02-south-carolina-lsu',
      date: '2027-01-02',
      startsAt: null,
      awayTeam: 'South Carolina',
      homeTeam: 'LSU',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-01-02-vanderbilt-tennessee',
      date: '2027-01-02',
      startsAt: null,
      awayTeam: 'Vanderbilt',
      homeTeam: 'Tennessee',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-01-05-arkansas-south-carolina',
      date: '2027-01-05',
      startsAt: null,
      awayTeam: 'Arkansas',
      homeTeam: 'South Carolina',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-01-05-lsu-alabama',
      date: '2027-01-05',
      startsAt: null,
      awayTeam: 'LSU',
      homeTeam: 'Alabama',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-01-05-mississippi-state-vanderbilt',
      date: '2027-01-05',
      startsAt: null,
      awayTeam: 'Mississippi State',
      homeTeam: 'Vanderbilt',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-01-05-oklahoma-florida',
      date: '2027-01-05',
      startsAt: null,
      awayTeam: 'Oklahoma',
      homeTeam: 'Florida',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-01-05-ole-miss-kentucky',
      date: '2027-01-05',
      startsAt: null,
      awayTeam: 'Ole Miss',
      homeTeam: 'Kentucky',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-01-05-tennessee-auburn',
      date: '2027-01-05',
      startsAt: null,
      awayTeam: 'Tennessee',
      homeTeam: 'Auburn',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-01-05-texas-georgia',
      date: '2027-01-05',
      startsAt: null,
      awayTeam: 'Texas',
      homeTeam: 'Georgia',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-01-05-texas-a-m-missouri',
      date: '2027-01-05',
      startsAt: null,
      awayTeam: 'Texas A&M',
      homeTeam: 'Missouri',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-01-09-alabama-arkansas',
      date: '2027-01-09',
      startsAt: null,
      awayTeam: 'Alabama',
      homeTeam: 'Arkansas',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-01-09-georgia-auburn',
      date: '2027-01-09',
      startsAt: null,
      awayTeam: 'Georgia',
      homeTeam: 'Auburn',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-01-09-kentucky-missouri',
      date: '2027-01-09',
      startsAt: null,
      awayTeam: 'Kentucky',
      homeTeam: 'Missouri',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-01-09-mississippi-state-oklahoma',
      date: '2027-01-09',
      startsAt: null,
      awayTeam: 'Mississippi State',
      homeTeam: 'Oklahoma',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-01-09-tennessee-lsu',
      date: '2027-01-09',
      startsAt: null,
      awayTeam: 'Tennessee',
      homeTeam: 'LSU',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-01-09-texas-ole-miss',
      date: '2027-01-09',
      startsAt: null,
      awayTeam: 'Texas',
      homeTeam: 'Ole Miss',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-01-09-texas-a-m-south-carolina',
      date: '2027-01-09',
      startsAt: null,
      awayTeam: 'Texas A&M',
      homeTeam: 'South Carolina',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-01-09-vanderbilt-florida',
      date: '2027-01-09',
      startsAt: null,
      awayTeam: 'Vanderbilt',
      homeTeam: 'Florida',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-01-12-arkansas-texas-a-m',
      date: '2027-01-12',
      startsAt: null,
      awayTeam: 'Arkansas',
      homeTeam: 'Texas A&M',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-01-12-auburn-texas',
      date: '2027-01-12',
      startsAt: null,
      awayTeam: 'Auburn',
      homeTeam: 'Texas',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-01-12-florida-mississippi-state',
      date: '2027-01-12',
      startsAt: null,
      awayTeam: 'Florida',
      homeTeam: 'Mississippi State',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-01-12-lsu-kentucky',
      date: '2027-01-12',
      startsAt: null,
      awayTeam: 'LSU',
      homeTeam: 'Kentucky',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-01-12-missouri-tennessee',
      date: '2027-01-12',
      startsAt: null,
      awayTeam: 'Missouri',
      homeTeam: 'Tennessee',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-01-12-oklahoma-georgia',
      date: '2027-01-12',
      startsAt: null,
      awayTeam: 'Oklahoma',
      homeTeam: 'Georgia',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-01-12-ole-miss-alabama',
      date: '2027-01-12',
      startsAt: null,
      awayTeam: 'Ole Miss',
      homeTeam: 'Alabama',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-01-12-south-carolina-vanderbilt',
      date: '2027-01-12',
      startsAt: null,
      awayTeam: 'South Carolina',
      homeTeam: 'Vanderbilt',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-01-16-arkansas-tennessee',
      date: '2027-01-16',
      startsAt: null,
      awayTeam: 'Arkansas',
      homeTeam: 'Tennessee',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-01-16-florida-alabama',
      date: '2027-01-16',
      startsAt: null,
      awayTeam: 'Florida',
      homeTeam: 'Alabama',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-01-16-lsu-texas-a-m',
      date: '2027-01-16',
      startsAt: null,
      awayTeam: 'LSU',
      homeTeam: 'Texas A&M',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-01-16-mississippi-state-georgia',
      date: '2027-01-16',
      startsAt: null,
      awayTeam: 'Mississippi State',
      homeTeam: 'Georgia',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-01-16-oklahoma-texas',
      date: '2027-01-16',
      startsAt: null,
      awayTeam: 'Oklahoma',
      homeTeam: 'Texas',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-01-16-ole-miss-auburn',
      date: '2027-01-16',
      startsAt: null,
      awayTeam: 'Ole Miss',
      homeTeam: 'Auburn',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-01-16-south-carolina-missouri',
      date: '2027-01-16',
      startsAt: null,
      awayTeam: 'South Carolina',
      homeTeam: 'Missouri',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-01-16-vanderbilt-kentucky',
      date: '2027-01-16',
      startsAt: null,
      awayTeam: 'Vanderbilt',
      homeTeam: 'Kentucky',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-01-19-alabama-south-carolina',
      date: '2027-01-19',
      startsAt: null,
      awayTeam: 'Alabama',
      homeTeam: 'South Carolina',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-01-19-auburn-vanderbilt',
      date: '2027-01-19',
      startsAt: null,
      awayTeam: 'Auburn',
      homeTeam: 'Vanderbilt',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-01-19-georgia-arkansas',
      date: '2027-01-19',
      startsAt: null,
      awayTeam: 'Georgia',
      homeTeam: 'Arkansas',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-01-19-kentucky-mississippi-state',
      date: '2027-01-19',
      startsAt: null,
      awayTeam: 'Kentucky',
      homeTeam: 'Mississippi State',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-01-19-missouri-oklahoma',
      date: '2027-01-19',
      startsAt: null,
      awayTeam: 'Missouri',
      homeTeam: 'Oklahoma',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-01-19-texas-lsu',
      date: '2027-01-19',
      startsAt: null,
      awayTeam: 'Texas',
      homeTeam: 'LSU',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-01-19-texas-a-m-florida',
      date: '2027-01-19',
      startsAt: null,
      awayTeam: 'Texas A&M',
      homeTeam: 'Florida',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-01-23-arkansas-texas',
      date: '2027-01-23',
      startsAt: null,
      awayTeam: 'Arkansas',
      homeTeam: 'Texas',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-01-23-auburn-lsu',
      date: '2027-01-23',
      startsAt: null,
      awayTeam: 'Auburn',
      homeTeam: 'LSU',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-01-23-florida-georgia',
      date: '2027-01-23',
      startsAt: null,
      awayTeam: 'Florida',
      homeTeam: 'Georgia',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-01-23-missouri-vanderbilt',
      date: '2027-01-23',
      startsAt: null,
      awayTeam: 'Missouri',
      homeTeam: 'Vanderbilt',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-01-23-oklahoma-alabama',
      date: '2027-01-23',
      startsAt: null,
      awayTeam: 'Oklahoma',
      homeTeam: 'Alabama',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-01-23-south-carolina-mississippi-state',
      date: '2027-01-23',
      startsAt: null,
      awayTeam: 'South Carolina',
      homeTeam: 'Mississippi State',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-01-23-tennessee-kentucky',
      date: '2027-01-23',
      startsAt: null,
      awayTeam: 'Tennessee',
      homeTeam: 'Kentucky',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-01-23-texas-a-m-ole-miss',
      date: '2027-01-23',
      startsAt: null,
      awayTeam: 'Texas A&M',
      homeTeam: 'Ole Miss',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-01-26-alabama-missouri',
      date: '2027-01-26',
      startsAt: null,
      awayTeam: 'Alabama',
      homeTeam: 'Missouri',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-01-26-lsu-arkansas',
      date: '2027-01-26',
      startsAt: null,
      awayTeam: 'LSU',
      homeTeam: 'Arkansas',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-01-26-mississippi-state-auburn',
      date: '2027-01-26',
      startsAt: null,
      awayTeam: 'Mississippi State',
      homeTeam: 'Auburn',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-01-26-tennessee-texas-a-m',
      date: '2027-01-26',
      startsAt: null,
      awayTeam: 'Tennessee',
      homeTeam: 'Texas A&M',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-01-26-texas-south-carolina',
      date: '2027-01-26',
      startsAt: null,
      awayTeam: 'Texas',
      homeTeam: 'South Carolina',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-01-26-vanderbilt-ole-miss',
      date: '2027-01-26',
      startsAt: null,
      awayTeam: 'Vanderbilt',
      homeTeam: 'Ole Miss',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-01-30-auburn-alabama',
      date: '2027-01-30',
      startsAt: null,
      awayTeam: 'Auburn',
      homeTeam: 'Alabama',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-01-30-florida-tennessee',
      date: '2027-01-30',
      startsAt: null,
      awayTeam: 'Florida',
      homeTeam: 'Tennessee',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-01-30-kentucky-texas',
      date: '2027-01-30',
      startsAt: null,
      awayTeam: 'Kentucky',
      homeTeam: 'Texas',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-01-30-lsu-georgia',
      date: '2027-01-30',
      startsAt: null,
      awayTeam: 'LSU',
      homeTeam: 'Georgia',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-01-30-mississippi-state-arkansas',
      date: '2027-01-30',
      startsAt: null,
      awayTeam: 'Mississippi State',
      homeTeam: 'Arkansas',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-01-30-ole-miss-missouri',
      date: '2027-01-30',
      startsAt: null,
      awayTeam: 'Ole Miss',
      homeTeam: 'Missouri',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-01-30-south-carolina-oklahoma',
      date: '2027-01-30',
      startsAt: null,
      awayTeam: 'South Carolina',
      homeTeam: 'Oklahoma',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-01-30-texas-a-m-vanderbilt',
      date: '2027-01-30',
      startsAt: null,
      awayTeam: 'Texas A&M',
      homeTeam: 'Vanderbilt',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-02-02-georgia-tennessee',
      date: '2027-02-02',
      startsAt: null,
      awayTeam: 'Georgia',
      homeTeam: 'Tennessee',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-02-02-kentucky-ole-miss',
      date: '2027-02-02',
      startsAt: null,
      awayTeam: 'Kentucky',
      homeTeam: 'Ole Miss',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-02-02-missouri-mississippi-state',
      date: '2027-02-02',
      startsAt: null,
      awayTeam: 'Missouri',
      homeTeam: 'Mississippi State',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-02-02-oklahoma-texas-a-m',
      date: '2027-02-02',
      startsAt: null,
      awayTeam: 'Oklahoma',
      homeTeam: 'Texas A&M',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-02-02-south-carolina-florida',
      date: '2027-02-02',
      startsAt: null,
      awayTeam: 'South Carolina',
      homeTeam: 'Florida',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-02-02-vanderbilt-lsu',
      date: '2027-02-02',
      startsAt: null,
      awayTeam: 'Vanderbilt',
      homeTeam: 'LSU',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-02-06-alabama-kentucky',
      date: '2027-02-06',
      startsAt: null,
      awayTeam: 'Alabama',
      homeTeam: 'Kentucky',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-02-06-arkansas-vanderbilt',
      date: '2027-02-06',
      startsAt: null,
      awayTeam: 'Arkansas',
      homeTeam: 'Vanderbilt',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-02-06-georgia-south-carolina',
      date: '2027-02-06',
      startsAt: null,
      awayTeam: 'Georgia',
      homeTeam: 'South Carolina',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-02-06-oklahoma-auburn',
      date: '2027-02-06',
      startsAt: null,
      awayTeam: 'Oklahoma',
      homeTeam: 'Auburn',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-02-06-ole-miss-lsu',
      date: '2027-02-06',
      startsAt: null,
      awayTeam: 'Ole Miss',
      homeTeam: 'LSU',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-02-06-tennessee-missouri',
      date: '2027-02-06',
      startsAt: null,
      awayTeam: 'Tennessee',
      homeTeam: 'Missouri',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-02-06-texas-florida',
      date: '2027-02-06',
      startsAt: null,
      awayTeam: 'Texas',
      homeTeam: 'Florida',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-02-06-texas-a-m-mississippi-state',
      date: '2027-02-06',
      startsAt: null,
      awayTeam: 'Texas A&M',
      homeTeam: 'Mississippi State',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-02-09-alabama-texas',
      date: '2027-02-09',
      startsAt: null,
      awayTeam: 'Alabama',
      homeTeam: 'Texas',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-02-09-florida-auburn',
      date: '2027-02-09',
      startsAt: null,
      awayTeam: 'Florida',
      homeTeam: 'Auburn',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-02-09-ole-miss-arkansas',
      date: '2027-02-09',
      startsAt: null,
      awayTeam: 'Ole Miss',
      homeTeam: 'Arkansas',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-02-09-south-carolina-kentucky',
      date: '2027-02-09',
      startsAt: null,
      awayTeam: 'South Carolina',
      homeTeam: 'Kentucky',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-02-09-tennessee-oklahoma',
      date: '2027-02-09',
      startsAt: null,
      awayTeam: 'Tennessee',
      homeTeam: 'Oklahoma',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-02-09-vanderbilt-georgia',
      date: '2027-02-09',
      startsAt: null,
      awayTeam: 'Vanderbilt',
      homeTeam: 'Georgia',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-02-13-arkansas-alabama',
      date: '2027-02-13',
      startsAt: null,
      awayTeam: 'Arkansas',
      homeTeam: 'Alabama',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-02-13-auburn-south-carolina',
      date: '2027-02-13',
      startsAt: null,
      awayTeam: 'Auburn',
      homeTeam: 'South Carolina',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-02-13-georgia-texas-a-m',
      date: '2027-02-13',
      startsAt: null,
      awayTeam: 'Georgia',
      homeTeam: 'Texas A&M',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-02-13-kentucky-tennessee',
      date: '2027-02-13',
      startsAt: null,
      awayTeam: 'Kentucky',
      homeTeam: 'Tennessee',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-02-13-lsu-oklahoma',
      date: '2027-02-13',
      startsAt: null,
      awayTeam: 'LSU',
      homeTeam: 'Oklahoma',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-02-13-mississippi-state-ole-miss',
      date: '2027-02-13',
      startsAt: null,
      awayTeam: 'Mississippi State',
      homeTeam: 'Ole Miss',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-02-13-missouri-florida',
      date: '2027-02-13',
      startsAt: null,
      awayTeam: 'Missouri',
      homeTeam: 'Florida',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-02-13-texas-vanderbilt',
      date: '2027-02-13',
      startsAt: null,
      awayTeam: 'Texas',
      homeTeam: 'Vanderbilt',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-02-16-auburn-arkansas',
      date: '2027-02-16',
      startsAt: null,
      awayTeam: 'Auburn',
      homeTeam: 'Arkansas',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-02-16-florida-lsu',
      date: '2027-02-16',
      startsAt: null,
      awayTeam: 'Florida',
      homeTeam: 'LSU',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-02-16-kentucky-georgia',
      date: '2027-02-16',
      startsAt: null,
      awayTeam: 'Kentucky',
      homeTeam: 'Georgia',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-02-16-mississippi-state-alabama',
      date: '2027-02-16',
      startsAt: null,
      awayTeam: 'Mississippi State',
      homeTeam: 'Alabama',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-02-16-oklahoma-missouri',
      date: '2027-02-16',
      startsAt: null,
      awayTeam: 'Oklahoma',
      homeTeam: 'Missouri',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-02-16-tennessee-ole-miss',
      date: '2027-02-16',
      startsAt: null,
      awayTeam: 'Tennessee',
      homeTeam: 'Ole Miss',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-02-16-texas-a-m-texas',
      date: '2027-02-16',
      startsAt: null,
      awayTeam: 'Texas A&M',
      homeTeam: 'Texas',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-02-20-alabama-tennessee',
      date: '2027-02-20',
      startsAt: null,
      awayTeam: 'Alabama',
      homeTeam: 'Tennessee',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-02-20-arkansas-kentucky',
      date: '2027-02-20',
      startsAt: null,
      awayTeam: 'Arkansas',
      homeTeam: 'Kentucky',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-02-20-georgia-florida',
      date: '2027-02-20',
      startsAt: null,
      awayTeam: 'Georgia',
      homeTeam: 'Florida',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-02-20-lsu-mississippi-state',
      date: '2027-02-20',
      startsAt: null,
      awayTeam: 'LSU',
      homeTeam: 'Mississippi State',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-02-20-missouri-auburn',
      date: '2027-02-20',
      startsAt: null,
      awayTeam: 'Missouri',
      homeTeam: 'Auburn',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-02-20-ole-miss-south-carolina',
      date: '2027-02-20',
      startsAt: null,
      awayTeam: 'Ole Miss',
      homeTeam: 'South Carolina',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-02-20-texas-oklahoma',
      date: '2027-02-20',
      startsAt: null,
      awayTeam: 'Texas',
      homeTeam: 'Oklahoma',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-02-20-vanderbilt-texas-a-m',
      date: '2027-02-20',
      startsAt: null,
      awayTeam: 'Vanderbilt',
      homeTeam: 'Texas A&M',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-02-23-alabama-texas-a-m',
      date: '2027-02-23',
      startsAt: null,
      awayTeam: 'Alabama',
      homeTeam: 'Texas A&M',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-02-23-arkansas-missouri',
      date: '2027-02-23',
      startsAt: null,
      awayTeam: 'Arkansas',
      homeTeam: 'Missouri',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-02-23-georgia-oklahoma',
      date: '2027-02-23',
      startsAt: null,
      awayTeam: 'Georgia',
      homeTeam: 'Oklahoma',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-02-23-kentucky-vanderbilt',
      date: '2027-02-23',
      startsAt: null,
      awayTeam: 'Kentucky',
      homeTeam: 'Vanderbilt',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-02-23-lsu-auburn',
      date: '2027-02-23',
      startsAt: null,
      awayTeam: 'LSU',
      homeTeam: 'Auburn',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-02-23-ole-miss-florida',
      date: '2027-02-23',
      startsAt: null,
      awayTeam: 'Ole Miss',
      homeTeam: 'Florida',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-02-23-south-carolina-tennessee',
      date: '2027-02-23',
      startsAt: null,
      awayTeam: 'South Carolina',
      homeTeam: 'Tennessee',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-02-23-texas-mississippi-state',
      date: '2027-02-23',
      startsAt: null,
      awayTeam: 'Texas',
      homeTeam: 'Mississippi State',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-02-27-auburn-kentucky',
      date: '2027-02-27',
      startsAt: null,
      awayTeam: 'Auburn',
      homeTeam: 'Kentucky',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-02-27-florida-arkansas',
      date: '2027-02-27',
      startsAt: null,
      awayTeam: 'Florida',
      homeTeam: 'Arkansas',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-02-27-mississippi-state-south-carolina',
      date: '2027-02-27',
      startsAt: null,
      awayTeam: 'Mississippi State',
      homeTeam: 'South Carolina',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-02-27-missouri-georgia',
      date: '2027-02-27',
      startsAt: null,
      awayTeam: 'Missouri',
      homeTeam: 'Georgia',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-02-27-oklahoma-ole-miss',
      date: '2027-02-27',
      startsAt: null,
      awayTeam: 'Oklahoma',
      homeTeam: 'Ole Miss',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-02-27-tennessee-texas',
      date: '2027-02-27',
      startsAt: null,
      awayTeam: 'Tennessee',
      homeTeam: 'Texas',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-02-27-texas-a-m-lsu',
      date: '2027-02-27',
      startsAt: null,
      awayTeam: 'Texas A&M',
      homeTeam: 'LSU',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-02-27-vanderbilt-alabama',
      date: '2027-02-27',
      startsAt: null,
      awayTeam: 'Vanderbilt',
      homeTeam: 'Alabama',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-03-02-arkansas-lsu',
      date: '2027-03-02',
      startsAt: null,
      awayTeam: 'Arkansas',
      homeTeam: 'LSU',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-03-02-auburn-ole-miss',
      date: '2027-03-02',
      startsAt: null,
      awayTeam: 'Auburn',
      homeTeam: 'Ole Miss',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-03-02-florida-south-carolina',
      date: '2027-03-02',
      startsAt: null,
      awayTeam: 'Florida',
      homeTeam: 'South Carolina',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-03-02-georgia-alabama',
      date: '2027-03-02',
      startsAt: null,
      awayTeam: 'Georgia',
      homeTeam: 'Alabama',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-03-02-mississippi-state-tennessee',
      date: '2027-03-02',
      startsAt: null,
      awayTeam: 'Mississippi State',
      homeTeam: 'Tennessee',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-03-02-missouri-texas',
      date: '2027-03-02',
      startsAt: null,
      awayTeam: 'Missouri',
      homeTeam: 'Texas',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-03-02-texas-a-m-kentucky',
      date: '2027-03-02',
      startsAt: null,
      awayTeam: 'Texas A&M',
      homeTeam: 'Kentucky',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-03-02-vanderbilt-oklahoma',
      date: '2027-03-02',
      startsAt: null,
      awayTeam: 'Vanderbilt',
      homeTeam: 'Oklahoma',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-03-06-alabama-auburn',
      date: '2027-03-06',
      startsAt: null,
      awayTeam: 'Alabama',
      homeTeam: 'Auburn',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-03-06-kentucky-florida',
      date: '2027-03-06',
      startsAt: null,
      awayTeam: 'Kentucky',
      homeTeam: 'Florida',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-03-06-lsu-missouri',
      date: '2027-03-06',
      startsAt: null,
      awayTeam: 'LSU',
      homeTeam: 'Missouri',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-03-06-oklahoma-arkansas',
      date: '2027-03-06',
      startsAt: null,
      awayTeam: 'Oklahoma',
      homeTeam: 'Arkansas',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-03-06-ole-miss-mississippi-state',
      date: '2027-03-06',
      startsAt: null,
      awayTeam: 'Ole Miss',
      homeTeam: 'Mississippi State',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-03-06-south-carolina-georgia',
      date: '2027-03-06',
      startsAt: null,
      awayTeam: 'South Carolina',
      homeTeam: 'Georgia',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-03-06-tennessee-vanderbilt',
      date: '2027-03-06',
      startsAt: null,
      awayTeam: 'Tennessee',
      homeTeam: 'Vanderbilt',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    },
    {
      id: '2027-03-06-texas-texas-a-m',
      date: '2027-03-06',
      startsAt: null,
      awayTeam: 'Texas',
      homeTeam: 'Texas A&M',
      external: {
        provider: 'espn',
        gameId: null
      },
      status: 'scheduled',
      awayScore: null,
      homeScore: null,
      winnerTeam: null
    }
  ],

  teamSessionOverrides: []
};

window.SURVIVOR_GRIDS = window.SURVIVOR_GRIDS || {};

window.SURVIVOR_GRIDS.secBasketball2027 = {
  id: 'secBasketball2027',
  sportKey: 'basketball',
  conferenceKey: 'sec',
  seasonYear: 2027,
  totalWeeks: SEC_BASKETBALL_2027_TOTAL_WEEKS,

  teams: {}
};
window.ACTIVE_SEASON = {
  profile: window.SEASON_PROFILES.secBasketball2027,
  schedule: window.SEASON_SCHEDULES.secBasketball2027,
  survivorGrid: window.SURVIVOR_GRIDS.secBasketball2027
};
