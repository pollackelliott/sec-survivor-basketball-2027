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
  }
};