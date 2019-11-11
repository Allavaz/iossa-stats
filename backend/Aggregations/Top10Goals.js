const queries = require('./Queries');

module.exports = (arg) => {
    return (
      [{$match: queries[arg]}, 
        {$sort: {fecha: 1}},
       {$project: {
          "players.info": 1,
          "players.statistics.goals": 1
        }}, {$unwind: {
          path: '$players',
          includeArrayIndex: 'index',
          preserveNullAndEmptyArrays: false
        }}, {$group: {
          _id: '$players.info.steam_id',
          name: {
            $last: '$players.info.name'
          },
          steamID: {
            $last: '$players.info.steam_id'
          },
          team: {
            $last: '$players.info.team'
          },
          matches: {
            $sum: 1
          },
          goals: {
            $sum: '$players.statistics.goals'
          },
        }}, {$sort: {
          team: 1,
          name: 1
        }}, {$lookup: {
          from: 'teams',
          localField: 'team',
          foreignField: '_id',
          as: 'teaminfo'
        }}]
    )
}