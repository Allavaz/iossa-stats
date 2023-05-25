export default function teamTournaments(steamid: string) {
  return [
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
        "teams.playerStatistics.info.steam_id": steamid
      }
    },
    {
      $group: {
        _id: "$torneo",
        matches: {
          $sum: 1
        },
        team: {
          $last: "$teams.teamname"
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
