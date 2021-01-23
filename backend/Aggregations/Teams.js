const queries = require("./Queries");

module.exports = (arg) => {
  return [
    { $match: queries[arg] },
    { $sort: { fecha: -1 } },

    {
      $project: {
        teams: 1,
      },
    },

    {
      $unwind: {
        path: "$teams",
        includeArrayIndex: "index",
        preserveNullAndEmptyArrays: false,
      },
    },

    {
      $group: {
        _id: "$teams.teamname",
        name: {
          $first: "$teams.teamname",
        },
        matches: {
          $sum: 1,
        },
        goals: {
          $sum: "$teams.score",
        },
        assists: {
          $sum: "$teams.statistics.assists",
        },
        shots: {
          $sum: "$teams.statistics.shots",
        },
        shotsontarget: {
          $sum: "$teams.statistics.shotsontarget",
        },
        passes: {
          $sum: "$teams.statistics.passes",
        },
        passescompleted: {
          $sum: "$teams.statistics.passescompleted",
        },
        interceptions: {
          $sum: "$teams.statistics.interceptions",
        },
        saves: {
          $sum: "$teams.statistics.saves",
        },
        fouls: {
          $sum: "$teams.statistics.fouls",
        },
        yellowcards: {
          $sum: "$teams.statistics.yellowcards",
        },
        redcards: {
          $sum: "$teams.statistics.redcards",
        },
        owngoals: {
          $sum: "$teams.statistics.owngoals",
        },
        offsides: {
          $sum: "$teams.statistics.offsides",
        },
        distancecovered: {
          $avg: "$teams.statistics.distancecovered",
        },
        possession: {
          $avg: "$teams.statistics.possession",
        },
        corners: {
          $sum: "$teams.statistics.corners",
        },
        throwins: {
          $sum: "$teams.statistics.throwins",
        },
        penalties: {
          $sum: "$teams.statistics.penalties",
        },
        freekicks: {
          $sum: "$teams.statistics.freekicks",
        },
        tackles: {
          $sum: "$teams.statistics.tackles",
        },
        tacklescompleted: {
          $sum: "$teams.statistics.tacklescompleted",
        },
        foulssuffered: {
          $sum: "$teams.statistics.foulssuffered",
        },
        savescaught: {
          $sum: "$teams.statistics.savescaught",
        },
        goalkicks: {
          $sum: "$teams.statistics.goalkicks",
        },
        goalsconceded: {
          $sum: "$teams.statistics.goalsconceded",
        },
      },
    },

    {
      $sort: {
        name: 1,
      },
    },
  ];
};
