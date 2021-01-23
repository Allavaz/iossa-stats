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

    { $unwind: "$teams.playerStatistics" },

    {
      $group: {
        _id: "$teams.teamname",
        name: {
          $first: "$teams.teamname",
        },
        playersID: {
          $addToSet: "$teams.playerStatistics.info.steam_id",
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
