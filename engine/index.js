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

  teamWeekContext(games, week, team, deadline){
    const teamGames = this.gamesForTeam(games, week, team);

    if(teamGames.length === 0){
      return null;
    }

    const gameContexts = teamGames.map(game => {
      const isHome = game.home === team;

      return {
        game,
        opponent: this.opponentForGame(game, team),
        location: isHome ? 'home' : 'away',
        result: window.SurvivorEngine.Results.resultForGame(game, team),
        editableUntil: this.pickEditableUntilGame(deadline, game)
      };
    });

    return {
      week,
      team,
      games: gameContexts,
      gameCount: gameContexts.length
    };
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