import queries from "./queries";

export default function team(teamname: string, arg: string) {
  return [
    { $match: queries(arg) },
    {
      $unwind: {
        path: "$teams"
      }
    },
    { $match: { "teams.teamname": teamname } },
    {
      $group: {
        _id: "$teams.teamname",
        name: {
          $first: "$teams.teamname"
        },
        matches: {
          $sum: 1
        },
        goals: {
          $sum: "$teams.score"
        },
        assists: {
          $sum: "$teams.statistics.assists"
        },
        wins: {
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
        },
        losses: {
          $sum: {
            $cond: [
              {
                $eq: ["$teams.result", -1]
              },
              1,
              0
            ]
          }
        }
      }
    }
  ];
}
