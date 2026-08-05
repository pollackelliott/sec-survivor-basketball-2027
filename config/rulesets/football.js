window.RULESET_REGISTRY = window.RULESET_REGISTRY || {};

window.RULESET_REGISTRY.football = Object.freeze({
  key: 'football',
  sportKey: 'football',

  eligibility: Object.freeze({
    allowanceLimits: Object.freeze({
      nonConference: 3,
      g5: 1
    })
  }),

  outcomes: Object.freeze({
    trackStrikes: false,
    records: Object.freeze({
      '1-0': Object.freeze({
        state: 'safe',
        strikesAdded: 0
      }),

      '0-1': Object.freeze({
        state: 'eliminated',
        strikesAdded: 0
      })
    })
  })
});
