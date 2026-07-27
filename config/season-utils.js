function buildWeeklyWindows({
  firstWeekStart,
  totalWeeks,
  weekOneRequiredGames = 1,
  standardRequiredGames = 2
}) {
  const [year, month, day] = firstWeekStart.split('-').map(Number);
  const firstStart = new Date(Date.UTC(year, month - 1, day));

  const toDateString = date => date.toISOString().slice(0, 10);

  return Array.from({ length: totalWeeks }, (_, index) => {
    const start = new Date(firstStart);
    start.setUTCDate(firstStart.getUTCDate() + index * 7);

    const end = new Date(start);
    end.setUTCDate(start.getUTCDate() + 6);

    return {
      week: index + 1,
      startsOn: toDateString(start),
      endsOn: toDateString(end),
      requiredConferenceGames:
        index === 0
          ? weekOneRequiredGames
          : standardRequiredGames
    };
  });
}
