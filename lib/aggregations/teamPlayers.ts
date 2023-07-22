import queries from "./queries";

export default function teamPlayers(teamname: string, arg: any) {
  return [
    { $match: queries(arg) },
    { $sort: { fecha: -1 } },
    {
      $project: {
        teams: 1,
        players: 1
      }
    },
    {
      $unwind: {
        path: "$players"
      }
    },
    {
      $addFields: {
        result: {
          $cond: [
            {
              $eq: [
                {
                  $arrayElemAt: ["$teams.teamname", 0]
                },
                "$players.info.team"
              ]
            },
            {
              $arrayElemAt: ["$teams.result", 0]
            },
            {
              $arrayElemAt: ["$teams.result", 1]
            }
          ]
        }
      }
    },
    {
      $group: {
        _id: "$players.info.steam_id",
        name: {
          $first: "$players.info.name"
        },
        steamID: {
          $last: "$players.info.steam_id"
        },
        team: {
          $first: "$players.info.team"
        },
        matches: {
          $sum: 1
        },
        wins: {
          $sum: {
            $cond: [
              {
                $eq: ["$result", 1]
              },
              1,
              0
            ]
          }
        },
        losses: {
          $sum: {
            $cond: [
              {
                $eq: ["$result", -1]
              },
              1,
              0
            ]
          }
        },
        draws: {
          $sum: {
            $cond: [
              {
                $eq: ["$result", 0]
              },
              1,
              0
            ]
          }
        },
        goals: {
          $sum: "$players.statistics.goals"
        },
        assists: {
          $sum: "$players.statistics.assists"
        },
        shots: {
          $sum: "$players.statistics.shots"
        },
        shotsontarget: {
          $sum: "$players.statistics.shotsontarget"
        },
        passes: {
          $sum: "$players.statistics.passes"
        },
        passescompleted: {
          $sum: "$players.statistics.passescompleted"
        },
        interceptions: {
          $sum: "$players.statistics.interceptions"
        },
        saves: {
          $sum: "$players.statistics.saves"
        },
        fouls: {
          $sum: "$players.statistics.fouls"
        },
        yellowcards: {
          $sum: "$players.statistics.yellowcards"
        },
        redcards: {
          $sum: "$players.statistics.redcards"
        },
        owngoals: {
          $sum: "$players.statistics.owngoals"
        },
        offsides: {
          $sum: "$players.statistics.offsides"
        },
        distancecovered: {
          $avg: "$players.statistics.distancecovered"
        },
        possession: {
          $avg: "$players.statistics.possession"
        },
        corners: {
          $sum: "$players.statistics.corners"
        },
        throwins: {
          $sum: "$players.statistics.throwins"
        },
        penalties: {
          $sum: "$players.statistics.penalties"
        },
        freekicks: {
          $sum: "$players.statistics.freekicks"
        },
        tackles: {
          $sum: "$players.statistics.tackles"
        },
        tacklescompleted: {
          $sum: "$players.statistics.tacklescompleted"
        },
        foulssuffered: {
          $sum: "$players.statistics.foulssuffered"
        },
        savescaught: {
          $sum: "$players.statistics.savescaught"
        },
        goalkicks: {
          $sum: "$players.statistics.goalkicks"
        },
        goalsconceded: {
          $sum: "$players.statistics.goalsconceded"
        },
        secondsplayed: {
          $sum: "$players.statistics.secondsplayed"
        },
        keypasses: {
          $sum: "$players.statistics.keypasses"
        },
        chancescreated: {
          $sum: "$players.statistics.chancescreated"
        },
        secondassists: {
          $sum: "$players.statistics.secondassists"
        }
      }
    },
    {
      $match: {
        team: teamname
      }
    },
    {
      $sort: {
        name: 1
      }
    }
  ];
}
