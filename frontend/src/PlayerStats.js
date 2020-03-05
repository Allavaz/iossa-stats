export default function PlayerStats(data, id) {
    let name;
    let team;
    let matches = 0;
    let wins = 0;
    let losses = 0;
    let draws = 0;
    let goals = 0;
    let assists = 0;
    let shots = 0;
    let shotsontarget = 0;
    let passes = 0;
    let passescompleted = 0;
    let interceptions = 0;
    let saves = 0;
    let fouls = 0;
    let yellowcards = 0;
    let redcards = 0;
    let owngoals = 0;
    let offsides = 0;
    let distancecovered = 0;
    let possession = 0;
    let corners = 0;
    let throwins = 0;
    let penalties = 0;
    let freekicks = 0;
    let tackles = 0;
    let tacklescompleted = 0;
    let foulssuffered = 0;
    let savescaught = 0;
    let goalkicks = 0;
    let goalsconceded = 0;
    let secondsplayed = 0;
    let positions = [];
    let lastpos;

    for (let i=0; i<data.length; i++) {
        for (let j=0; j<data[i].players.length; j++) {
            if (data[i].players[j].info.steam_id === id) {
                if (name === undefined && team === undefined && lastpos === undefined) {
                    name = data[i].players[j].info.name;
                    team = data[i].players[j].info.team;
                    lastpos = data[i].players[j].statistics.positions[0].position;
                }
            }
        }

        for (let j=0; j<data[i].players.length; j++) {
            if (data[i].players[j].info.steam_id === id) {
                matches++;
                goals = goals + data[i].players[j].statistics.goals;
                assists = assists + data[i].players[j].statistics.assists;
                shots = shots + data[i].players[j].statistics.shots;
                shotsontarget = shotsontarget + data[i].players[j].statistics.shotsontarget;
                passes = passes + data[i].players[j].statistics.passes;
                passescompleted = passescompleted + data[i].players[j].statistics.passescompleted;
                interceptions = interceptions + data[i].players[j].statistics.interceptions;
                saves = saves + data[i].players[j].statistics.saves;
                fouls = fouls + data[i].players[j].statistics.fouls;
                yellowcards = yellowcards + data[i].players[j].statistics.yellowcards;
                redcards = redcards + data[i].players[j].statistics.redcards;
                owngoals = owngoals + data[i].players[j].statistics.owngoals;
                offsides = offsides + data[i].players[j].statistics.offsides;
                distancecovered = (distancecovered + data[i].players[j].statistics.shots)/2;
                possession = (possession + data[i].players[j].statistics.possession)/2;
                corners = corners + data[i].players[j].statistics.corners;
                throwins = throwins + data[i].players[j].statistics.throwins;
                penalties = penalties + data[i].players[j].statistics.penalties;
                freekicks = freekicks + data[i].players[j].statistics.freekicks;
                tackles = tackles + data[i].players[j].statistics.tackles;
                tacklescompleted = tacklescompleted + data[i].players[j].statistics.tacklescompleted;
                foulssuffered = foulssuffered + data[i].players[j].statistics.foulssuffered;
                savescaught = savescaught + data[i].players[j].statistics.savescaught;
                goalkicks = goalkicks + data[i].players[j].statistics.goalkicks;
                goalsconceded = goalsconceded + data[i].players[j].statistics.goalsconceded;
                secondsplayed = secondsplayed + data[i].players[j].statistics.secondsplayed;
                for (let k=0; k<data[i].players[j].statistics.positions.length; k++) {
                    if (!positions.some((e) => e.position === data[i].players[j].statistics.positions[k].position)) {
                        positions.push({
                           position: data[i].players[j].statistics.positions[k].position,
                           seconds: data[i].players[j].statistics.positions[k].seconds
                        });
                    } else {
                        let index = positions.findIndex((e) => e.position === data[i].players[j].statistics.positions[k].position);
                        positions[index].seconds = positions[index].seconds + data[i].players[j].statistics.positions[k].seconds
                    }
                }
                positions.sort((a, b) => b.seconds - a.seconds);
            }
        }

        for (let j=0; j<data[i].teams.length; j++) {
            for (let k=0; k<data[i].teams[j].playerStatistics.length; k++) {
                if (data[i].teams[j].playerStatistics[k].info.steam_id === id) {
                    switch (data[i].teams[j].result) {
                        case 1:
                            wins++;
                            break;
                        case 0:
                            draws++;
                            break;
                        case -1:
                            losses++;
                            break;
                        default:
                            break;
                    }
                }
            }
        }
    }

    return {
        name: name,
        steamid: id,
        team: team,
        matches: matches,
        wins: wins,
        losses: losses,
        draws: draws,
        goals: goals,
        assists: assists,
        shots: shots,
        shotsontarget: shotsontarget,
        passes: passes,
        passescompleted: passescompleted,
        interceptions: interceptions,
        saves: saves,
        fouls: fouls,
        yellowcards: yellowcards,
        redcards: redcards,
        owngoals: owngoals,
        offsides: offsides,
        distancecovered: distancecovered,
        possession: possession,
        corners: corners,
        throwins: throwins,
        penalties: penalties,
        freekicks: freekicks,
        tackles: tackles,
        tacklescompleted: tacklescompleted,
        foulssuffered: foulssuffered,
        savescaught: savescaught,
        goalkicks: goalkicks,
        goalsconceded: goalsconceded,
        secondsplayed: secondsplayed,
        lastpos: lastpos,
        positions: positions
    };
}