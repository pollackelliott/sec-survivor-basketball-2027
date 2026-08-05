window.SurvivorAdapters = window.SurvivorAdapters || {};

window.SurvivorAdapters.Schedule = {
  weekForDate(dateString, seasonWeeks){
    if(!dateString || !Array.isArray(seasonWeeks)){
      return null;
    }

    const matchingWeek = seasonWeeks.find(week =>
      dateString >= week.startsOn &&
      dateString <= week.endsOn
    );

    return matchingWeek
      ? matchingWeek.week
      : null;
  },

  normalizeGame(game, seasonWeeks){
    if(!game){
      return null;
    }

    return {
      id: game.id,
      week: this.weekForDate(game.date, seasonWeeks),
      date: game.date,
      startsAt: game.startsAt,
      awayTeam: game.awayTeam,
      homeTeam: game.homeTeam,
      awayScore: game.awayScore,
      homeScore: game.homeScore,
      winnerTeam: game.winnerTeam,
      status: game.status,
      external: game.external || null
    };
  },

  normalizeSchedule(schedule, seasonWeeks){
    if(!schedule || !Array.isArray(schedule.games)){
      return [];
    }

    return schedule.games.map(game =>
      this.normalizeGame(game, seasonWeeks)
    );
  },

  gameIdsForTeamWeek(survivorGrid, team, week){
    const entry =
      survivorGrid?.teams?.[team]?.[week];

    if(!entry || !Array.isArray(entry.gameIds)){
      return [];
    }

    return entry.gameIds;
  },

  countingGamesForTeam(games, survivorGrid, team, week){
    const gameIds =
      this.gameIdsForTeamWeek(
        survivorGrid,
        team,
        week
      );

    const gamesById = new Map(
      games.map(game => [game.id, game])
    );

    return gameIds.map(gameId => {
      const game = gamesById.get(gameId);

      if(!game){
        throw new Error(
          `Survivor grid references unknown game "${gameId}" for ${team}, Week ${week}.`
        );
      }

      const teamIsParticipant =
        game.awayTeam === team ||
        game.homeTeam === team;

      if(!teamIsParticipant){
        throw new Error(
          `Survivor grid assigns game "${gameId}" to ${team}, but that team is not participating.`
        );
      }

      return {
        ...game,

        /*
          Survivor week is team-specific.

          A game may belong to one survivor week for one team and a
          different survivor week for its opponent, especially when
          basketball sessions contain carryovers or manual replacements.
        */
        scheduleWeek: game.week,
        week: Number(week)
      };
    });
  }
};