export default function playerPositions(steamid: string) {
  return [
    {
      $match: {
        "players.info.steam_id": steamid
      }
    },
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
        path: "$players.statistics.positions"
      }
    },
    {
      $group: {
        _id: "$players.statistics.positions.position",
        seconds: {
          $sum: "$players.statistics.positions.seconds"
        }
      }
    },
    {
      $sort: {
        seconds: -1
      }
    },
    {
      $limit: 3
    }
  ];
}
