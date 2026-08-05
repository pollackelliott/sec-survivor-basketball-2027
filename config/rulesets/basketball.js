window.RULESET_REGISTRY = window.RULESET_REGISTRY || {};

window.RULESET_REGISTRY.basketball = Object.freeze({
  key: 'basketball',
  sportKey: 'basketball',

  outcomes: Object.freeze({
    tracksStrikes: true,
    records: Object.freeze({
      '1-0': Object.freeze({
        state: 'safe',
        strikesAdded: 0
      }),

      '0-1': Object.freeze({
        state: 'strike',
        strikesAdded: 1
      }),

      '2-0': Object.freeze({
        state: 'safe',
        strikesAdded: 0
      }),

      '1-1': Object.freeze({
        state: 'strike',
        strikesAdded: 1
      }),

      '0-2': Object.freeze({
        state: 'eliminated',
        strikesAdded: 0
      })
    })
  })
});
