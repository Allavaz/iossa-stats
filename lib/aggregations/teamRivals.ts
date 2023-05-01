export default function teamRivals(teamname: string) {
  return [
    {
      $match: {
        "teams.teamname": teamname
      }
    },
    {
      $unwind: {
        path: "$teams"
      }
    },
    {
      $match: {
        "teams.teamname": {
          $ne: teamname
        }
      }
    },
    {
      $group: {
        _id: "$teams.teamname",
        matches: {
          $sum: 1
        },
        wins: {
          $sum: {
            $cond: [
              {
                $eq: ["$teams.result", -1]
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
                $eq: ["$teams.result", 1]
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
                $eq: ["$teams.result", 0]
              },
              1,
              0
            ]
          }
        }
      }
    },
    {
      $sort: {
        wins: -1,
        losses: 1,
        matches: -1
      }
    }
  ];
}
