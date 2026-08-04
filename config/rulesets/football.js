window.RULESET_REGISTRY = window.RULESET_REGISTRY || {};

window.RULESET_REGISTRY.football = Object.freeze({
  key: 'football',
  sportKey: 'football',

  eligibility: Object.freeze({
    allowanceLimits: Object.freeze({
      nonConference: 3,
      g5: 1
    })
  })
});