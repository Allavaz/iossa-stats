module.exports = steam_id => {
  return [
    {
      $unwind: {
        path: "$players"
      }
    },
    {
      $match: {
        "players.info.steam_id": steam_id
      }
    },
    {
      $project: {
        name: "$players.info.name",
        match_date: "$fecha",
        steam_id: "$players.info.steam_id",
        teams: "$teams",
        team: "$players.info.team",
        statistics: "$players.statistics"
      }
    },
    {
      $addFields: {
        result: {
          $cond: [
            {
              $eq: [{ $arrayElemAt: ["$teams.teamname", 0] }, "$team"]
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
        _id: "$steam_id",
        steamid: {
          $last: "$steam_id"
        },
        name: {
          $last: "$name"
        },
        team: {
          $last: "$team"
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
          $sum: "$statistics.goals"
        },
        assists: {
          $sum: "$statistics.assists"
        },
        shots: {
          $sum: "$statistics.shots"
        },
        shotsontarget: {
          $sum: "$statistics.shotsontarget"
        },
        passes: {
          $sum: "$statistics.passes"
        },
        passescompleted: {
          $sum: "$statistics.passescompleted"
        },
        interceptions: {
          $sum: "$statistics.interceptions"
        },
        saves: {
          $sum: "$statistics.saves"
        },
        fouls: {
          $sum: "$statistics.fouls"
        },
        yellowcards: {
          $sum: "$statistics.yellowcards"
        },
        redcards: {
          $sum: "$statistics.redcards"
        },
        owngoals: {
          $sum: "$statistics.owngoals"
        },
        offsides: {
          $sum: "$statistics.offsides"
        },
        distancecovered: {
          $avg: "$statistics.distancecovered"
        },
        possession: {
          $avg: "$statistics.possession"
        },
        corners: {
          $sum: "$statistics.corners"
        },
        throwins: {
          $sum: "$statistics.throwins"
        },
        penalties: {
          $sum: "$statistics.penalties"
        },
        freekicks: {
          $sum: "$statistics.freekicks"
        },
        tackles: {
          $sum: "$statistics.tackles"
        },
        tacklescompleted: {
          $sum: "$statistics.tacklescompleted"
        },
        foulssuffered: {
          $sum: "$statistics.foulssuffered"
        },
        savescaught: {
          $sum: "$statistics.savescaught"
        },
        goalkicks: {
          $sum: "$statistics.goalkicks"
        },
        goalsconceded: {
          $sum: "$statistics.goalsconceded"
        },
        secondsplayed: {
          $sum: "$statistics.secondsplayed"
        },
        keypasses: {
          $sum: "$statistics.keypasses"
        },
        chancescreated: {
          $sum: "$statistics.chancescreated"
        },
        secondassists: {
          $sum: "$statistics.secondassists"
        }
      }
    }
  ];
};
