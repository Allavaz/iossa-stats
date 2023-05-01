export default function teamTournaments(teamname: string) {
  return [
    {
      $match: {
        "teams.teamname": teamname
      }
    },
    {
      $group: {
        _id: "$torneo",
        matches: {
          $sum: 1
        },
        firstmatch: {
          $first: "$fecha"
        },
        lastmatch: {
          $last: "$fecha"
        }
      }
    },
    {
      $sort: {
        firstmatch: -1
      }
    }
  ];
}
