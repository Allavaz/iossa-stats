export default function playerScoredTeams(steamid: string) {
  return [
    {
      $unwind: {
        path: "$players"
      }
    },
    {
      $match: {
        "players.info.steam_id": steamid
      }
    },
    {
      $unwind: {
        path: "$teams"
      }
    },
    {
      $match: {
        $expr: {
          $ne: ["$teams.teamname", "$players.info.team"]
        }
      }
    },
    {
      $group: {
        _id: "$teams.teamname",
        goalsscored: {
          $sum: "$players.statistics.goals"
        }
      }
    },
    {
      $match: {
        goalsscored: {
          $gt: 0
        }
      }
    },
    {
      $sort: {
        goalsscored: -1
      }
    },
    { $limit: 10 }
  ];
}
