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

  pickEditableUntilGame(deadline, game){
    if(!game){
      return null;
    }

    const gameTime = new Date(game.kickoff_at);

    if(!deadline){
      return gameTime;
    }

    return deadline < gameTime
      ? deadline
      : gameTime;
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