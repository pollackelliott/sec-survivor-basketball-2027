window.SurvivorEngine = window.SurvivorEngine || {};

window.SurvivorEngine.Results = {
  resultForGame(game, team){
    if(!game || !game.winner){
      return null;
    }

    return game.winner === team ? 1 : 0;
  }
};

window.SurvivorEngine.Schedule = {
  gamesForTeam(games, week, team){
    return games.filter(
      game =>
        game.week === week &&
        (game.home === team || game.away === team)
    );
  },

  firstGameForTeam(games, week, team){
    return this.gamesForTeam(games, week, team)[0] || null;
  },

  opponentForGame(game, team){
    if(!game){
      return null;
    }

    if(game.home === team){
      return game.away;
    }

    if(game.away === team){
      return game.home;
    }

    return null;
  }
};