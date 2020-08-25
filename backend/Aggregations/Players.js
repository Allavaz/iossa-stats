const queries = require('./Queries');

module.exports = (arg) => {
	return (
		[{$match: queries[arg]}, 
		{$sort: {fecha: -1}},
		{$project: {
				players: 1
			}}, {$unwind: {
				path: '$players',
				includeArrayIndex: 'index',
				preserveNullAndEmptyArrays: false
			}}, {$group: {
				_id: '$players.info.steam_id',
				name: {
					$first: '$players.info.name'
				},
				steamID: {
					$last: '$players.info.steam_id'
				},
				team: {
					$first: '$players.info.team'
				},
				matches: {
					$sum: 1
				},
				goals: {
					$sum: '$players.statistics.goals'
				},
				assists: {
					$sum: '$players.statistics.assists'
				},
				shots: {
					$sum: '$players.statistics.shots'
				},
				shotsontarget: {
					$sum: '$players.statistics.shotsontarget'
				},
				passes: {
					$sum: '$players.statistics.passes'
				},
				passescompleted: {
					$sum: '$players.statistics.passescompleted'
				},
				interceptions: {
					$sum: '$players.statistics.interceptions'
				},
				saves: {
					$sum: '$players.statistics.saves'
				},
				fouls: {
					$sum: '$players.statistics.fouls'
				},
				yellowcards: {
					$sum: '$players.statistics.yellowcards'
				},
				redcards: {
					$sum: '$players.statistics.redcards'
				},
				owngoals: {
					$sum: '$players.statistics.owngoals'
				},
				offsides: {
					$sum: '$players.statistics.offsides'
				},
				distancecovered: {
					$avg: '$players.statistics.distancecovered'
				},
				possession: {
					$avg: '$players.statistics.possession'
				},
				corners: {
					$sum: '$players.statistics.corners'
				},
				throwins: {
					$sum: '$players.statistics.throwins'
				},
				penalties: {
					$sum: '$players.statistics.penalties'
				},
				freekicks: {
					$sum: '$players.statistics.freekicks'
				},
				tackles: {
					$sum: '$players.statistics.tackles'
				},
				tacklescompleted: {
					$sum: '$players.statistics.tacklescompleted'
				},
				foulssuffered: {
					$sum: '$players.statistics.foulssuffered'
				},
				savescaught: {
					$sum: '$players.statistics.savescaught'
				},
				goalkicks: {
					$sum: '$players.statistics.goalkicks'
				},
				goalsconceded: {
					$sum: '$players.statistics.goalsconceded'
				},
				secondsplayed: {
					$sum: '$players.statistics.secondsplayed'
				}
			}}, {$sort: {
				team: 1,
				name: 1
			}}]
	);
}