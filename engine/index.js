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

window.SurvivorEngine.Eligibility = {
  nonConferenceSideOf(game, conferenceTeams){
    if(!game){
      return null;
    }

    const awayIsConference = conferenceTeams.includes(game.away);
    const homeIsConference = conferenceTeams.includes(game.home);

    if(awayIsConference === homeIsConference){
      return null;
    }

    return awayIsConference
      ? game.home
      : game.away;
  },

  gameIsIneligible(game, conferenceTeams, classification){
    const opponent = this.nonConferenceSideOf(
      game,
      conferenceTeams
    );

    return opponent
      ? (!classification[opponent] || !classification[opponent].eligible)
      : false;
  },

  classifyOpponent(opponent, conferenceTeams, classification){
    if(!opponent){
      return 'invalid';
    }

    if(conferenceTeams.includes(opponent)){
      return 'conference';
    }

    const row = classification[opponent];

    if(!row || !row.eligible){
      return 'ineligible';
    }

    return row.category;
  },
  remainingAllowances(picks, limits, classifyPick, excludedWeek = null){
  let nonConferenceLeft = limits.nonConference;
  let g5Left = limits.g5;

  picks.forEach((pick, index) => {
    const week = index + 1;

    if(!pick || week === excludedWeek){
      return;
    }

    const category = classifyPick(week, pick);

    if(category === 'g5' || category === 'not_g5'){
      nonConferenceLeft--;
    }

    if(category === 'g5'){
      g5Left--;
    }
  });

  return {
    nonConferenceLeft,
    g5Left
  };
}
};