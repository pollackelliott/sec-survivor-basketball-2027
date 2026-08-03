window.buildConferenceConfig = function buildConferenceConfig(membership, teamRegistry){
  const theme =
  window.CONFERENCE_THEMES?.[membership.conferenceId];

  if(!theme){
    throw new Error(
      `No theme is defined for conference: ${membership.conferenceId}`
    );
  }

  const teams = membership.teamIds.map(teamId => teamRegistry[teamId]);

  const config = {
    id: membership.conferenceId,
    membershipId: membership.id,
    name: membership.conferenceName,
    theme,
    teamIds: [...membership.teamIds],
    teams: [],
    colors: {},
    secondaryColors: {},
    abbreviations: {},
    displayNames: {}
  };

  teams.forEach(team => {
    config.teams.push(team.schoolName);
    config.colors[team.schoolName] = team.primaryColor;
    config.secondaryColors[team.schoolName] = team.secondaryColor;
    config.abbreviations[team.schoolName] = team.abbreviation;

    if(team.displayName !== team.schoolName){
      config.displayNames[team.schoolName] = team.displayName;
    }
  });

  return config;
};
