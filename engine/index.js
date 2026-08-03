window.SurvivorEngine = window.SurvivorEngine || {};

window.SurvivorEngine.Results = {
  resultForGame(game, team){
    if(!game || !game.winner){
      return null;
    }

    return game.winner === team ? 1 : 0;
  }
};
