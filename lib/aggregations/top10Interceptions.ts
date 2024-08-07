import queries from "./queries";

export default function top10Interceptions(arg) {
  return [
    { $match: queries(arg) },
    { $sort: { fecha: 1 } },
    {
      $project: {
        "players.info": 1,
        "players.statistics": 1
      }
    },
    {
      $unwind: {
        path: "$players",
        includeArrayIndex: "index",
        preserveNullAndEmptyArrays: false
      }
    },
    {
      $group: {
        _id: "$players.info.steam_id",
        name: {
          $last: "$players.info.name"
        },
        steamID: {
          $last: "$players.info.steam_id"
        },
        team: {
          $last: "$players.info.team"
        },
        matches: {
          $sum: 1
        },
        interceptions: {
          $sum: "$players.statistics.interceptions"
        },
        secondsplayed: {
          $sum: "$players.statistics.secondsplayed"
        }
      }
    },
    {
      $sort: {
        team: 1,
        name: 1
      }
    },
    {
      $lookup: {
        from: "teams",
        localField: "team",
        foreignField: "_id",
        as: "teaminfo"
      }
    }
  ];
}
