const rt = require('./RemoveTag');
const MongoClient = require('mongodb').MongoClient;
const { host, user, pw, dbname } = require('./db.json');
const encuser = encodeURIComponent(user);
const encpw = encodeURIComponent(pw);
const authMechanism = 'DEFAULT';
const url = `mongodb://${encuser}:${encpw}@${host}:27017/?authMechanism=${authMechanism}`;
const client = new MongoClient(url, {useNewUrlParser: true});
const { calcPercentages, calcIndivPossession } = require('./Utils');

exports.pushToDB = function (json, filename, torneo, vod, res) {
    if (vod == "") {
        vod = null;
    }

    if (json.matchData == undefined) {
        res.end('Invalid JSON. Try again');
    } else {
        let players = [];
        let year = filename.slice(0, 4);
        let month = filename.slice(5, 7);
        let day = filename.slice(8, 10);
        let hour = filename.slice(11, 13);
        let minute = filename.slice(15, 17);
        let second = filename.slice(19, 21);
        let date = new Date(year + "-" + month + "-" + day + "T" + hour + ":" + minute + ":" + second);
        for (let i = 0; i < json.matchData.players.length; i++) {
            if (json.matchData.players[i].matchPeriodData.length !== 0) {
                let steamid = json.matchData.players[i].info.steamId;
                let name = rt.removeTag(json.matchData.players[i].info.name);
                let team = "None";

                switch (json.matchData.players[i].matchPeriodData[0].info.team) {
                    case "home":
                        team = json.matchData.teams[0].matchTotal.name;
                        break;
                    case "away":
                        team = json.matchData.teams[1].matchTotal.name;
                        break;
                    default:
                        break;
                }

                let goals = 0;
                let assists = 0;
                let saves = 0;
                let passes = 0;
                let passescompleted = 0;
                let shots = 0;
                let shotsontarget = 0;
                let interceptions = 0;
                let fouls = 0;
                let yellowcards = 0;
                let redcards = 0;
                let owngoals = 0;
                let offsides = 0;
                let distancecovered = 0;
                let possessiontime = 0;
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

                for (j = 0; j < json.matchData.players[i].matchPeriodData.length; j++) {
                    goals = goals + json.matchData.players[i].matchPeriodData[j].statistics[12];
                    assists = assists + json.matchData.players[i].matchPeriodData[j].statistics[14];
                    saves = saves + json.matchData.players[i].matchPeriodData[j].statistics[20];
                    passes = passes + json.matchData.players[i].matchPeriodData[j].statistics[15];
                    passescompleted = passescompleted + json.matchData.players[i].matchPeriodData[j].statistics[9];
                    shots = shots + json.matchData.players[i].matchPeriodData[j].statistics[7];
                    shotsontarget = shotsontarget + json.matchData.players[i].matchPeriodData[j].statistics[8];
                    interceptions = interceptions + json.matchData.players[i].matchPeriodData[j].statistics[10];
                    fouls = fouls + json.matchData.players[i].matchPeriodData[j].statistics[2];
                    yellowcards = yellowcards + json.matchData.players[i].matchPeriodData[j].statistics[1];
                    redcards = redcards + json.matchData.players[i].matchPeriodData[j].statistics[0];
                    owngoals = owngoals + json.matchData.players[i].matchPeriodData[j].statistics[13];
                    offsides = offsides + json.matchData.players[i].matchPeriodData[j].statistics[11];
                    distancecovered = distancecovered + json.matchData.players[i].matchPeriodData[j].statistics[23];
                    possessiontime = possessiontime + json.matchData.players[i].matchPeriodData[j].statistics[22];
                    corners = corners + json.matchData.players[i].matchPeriodData[j].statistics[18];
                    throwins = throwins + json.matchData.players[i].matchPeriodData[j].statistics[19];
                    penalties = penalties + json.matchData.players[i].matchPeriodData[j].statistics[17];
                    freekicks = freekicks + json.matchData.players[i].matchPeriodData[j].statistics[16];
                    tackles = tackles + json.matchData.players[i].matchPeriodData[j].statistics[4];
                    tacklescompleted = tacklescompleted + json.matchData.players[i].matchPeriodData[j].statistics[5];
                    foulssuffered = foulssuffered + json.matchData.players[i].matchPeriodData[j].statistics[3];
                    savescaught = savescaught + json.matchData.players[i].matchPeriodData[j].statistics[24];
                    goalkicks = goalkicks + json.matchData.players[i].matchPeriodData[j].statistics[21];
                    goalsconceded = goalsconceded + json.matchData.players[i].matchPeriodData[j].statistics[6];
                }

                players.push({
                    'info': {
                        'name': name,
                        'steam_id': steamid,
                        'team': team
                    },
                    'statistics': {
                        'goals': goals,
                        'assists': assists,
                        'shots': shots,
                        'shotsontarget': shotsontarget,
                        'passes': passes,
                        'passescompleted': passescompleted,
                        'interceptions': interceptions,
                        'saves': saves,
                        'fouls': fouls,
                        'yellowcards': yellowcards,
                        'redcards': redcards,
                        'owngoals': owngoals,
                        'offsides': offsides,
                        'distancecovered': distancecovered,
                        'possession': calcIndivPossession(possessiontime, json.matchData.teams[0].matchTotal.statistics[22], json.matchData.teams[1].matchTotal.statistics[22]),
                        'corners': corners,
                        'throwins': throwins,
                        'penalties': penalties,
                        'freekicks': freekicks,
                        'tackles': tackles,
                        'tacklescompleted': tacklescompleted,
                        'foulssuffered': foulssuffered,
                        'savescaught': savescaught,
                        'goalkicks': goalkicks,
                        'goalsconceded': goalsconceded
                    }
                });
            }
        }

        let homePlayerStatistics = [];
        let awayPlayerStatistics = [];

        for (let i = 0; i < players.length; i++) {
            if (players[i].info.team == json.matchData.teams[0].matchTotal.name) {
                homePlayerStatistics.push(players[i]);
            } else {
                awayPlayerStatistics.push(players[i]);
            }
        }

        let homeresult;
        let awayresult;

        if (json.matchData.teams[0].matchTotal.statistics[12] > json.matchData.teams[1].matchTotal.statistics[12]) {
            homeresult = 1;
            awayresult = -1;
        } else if (json.matchData.teams[0].matchTotal.statistics[12] < json.matchData.teams[1].matchTotal.statistics[12]) {
            homeresult = -1;
            awayresult = 1;
        } else {
            homeresult = 0;
            awayresult = 0;
        }

        let matchevents = [];
        let hometeaminfo = {};
        let awayteaminfo = {};

        for (let i = 0; i < json.matchData.matchEvents.length; i++) {
            if (json.matchData.matchEvents[i].event == "GOAL" || json.matchData.matchEvents[i].event == "OWN GOAL" || json.matchData.matchEvents[i].event == "YELLOW CARD" || json.matchData.matchEvents[i].event == "RED CARD" || json.matchData.matchEvents[i].event == "SECOND YELLOW") {
                matchevents.push(json.matchData.matchEvents[i]);
            }
        }

        for (let i = 0; i < matchevents.length; i++) {
            for (let j = 0; j < json.matchData.players.length; j++) {
                if (matchevents[i].player1SteamId === json.matchData.players[j].info.steamId) {
                    matchevents[i].name = rt.removeTag(json.matchData.players[j].info.name);
                }
            }
        }

        client.connect((err, client) => {
            const db = client.db(dbname);
            db.collection('teams').find({_id: json.matchData.teams[0].matchTotal.name}).toArray((err, docs) => {
                hometeaminfo = docs[0];
                db.collection('teams').find({_id: json.matchData.teams[1].matchTotal.name}).toArray((err, docs) => {
                    awayteaminfo = docs[0];
                    db.collection('matchesaux').insertOne({
                        'filename': filename,
                        'fecha': date,
                        'torneo': torneo,
                        'vod': vod,
                        'teams': [{
                                'teamname': json.matchData.teams[0].matchTotal.name,
                                'side': json.matchData.teams[0].matchTotal.side,
                                'score': json.matchData.teams[0].matchTotal.statistics[12],
                                'scorereceived': json.matchData.teams[1].matchTotal.statistics[12],
                                'result': homeresult,
                                'statistics': {
                                    'shots': json.matchData.teams[0].matchTotal.statistics[7],
                                    'shotsontarget': json.matchData.teams[0].matchTotal.statistics[8],
                                    'possession': calcPercentages(json.matchData.teams[0].matchTotal.statistics[22], json.matchData.teams[1].matchTotal.statistics[22])[0],
                                    'passes': json.matchData.teams[0].matchTotal.statistics[15],
                                    'passescompleted': json.matchData.teams[0].matchTotal.statistics[9],
                                    'fouls': json.matchData.teams[0].matchTotal.statistics[2],
                                    'yellowcards': json.matchData.teams[0].matchTotal.statistics[1],
                                    'redcards': json.matchData.teams[0].matchTotal.statistics[0],
                                    'offsides': json.matchData.teams[0].matchTotal.statistics[11],
                                    'corners': json.matchData.teams[0].matchTotal.statistics[18],
                                    'throwins': json.matchData.teams[0].matchTotal.statistics[19],
                                    'penalties': json.matchData.teams[0].matchTotal.statistics[17],
                                    'freekicks': json.matchData.teams[0].matchTotal.statistics[16],
                                    'foulssuffered': json.matchData.teams[0].matchTotal.statistics[3],
                                    'goalsconceded': json.matchData.teams[0].matchTotal.statistics[6],
                                    'interceptions': json.matchData.teams[0].matchTotal.statistics[10],
                                    'owngoals': json.matchData.teams[0].matchTotal.statistics[13],
                                    'tackles': json.matchData.teams[0].matchTotal.statistics[4],
                                    'tacklescompleted': json.matchData.teams[0].matchTotal.statistics[5],
                                    'saves': json.matchData.teams[0].matchTotal.statistics[20],
                                    'savescaught': json.matchData.teams[0].matchTotal.statistics[24],
                                    'distancecovered': json.matchData.teams[0].matchTotal.statistics[23],
                                    'assists': json.matchData.teams[0].matchTotal.statistics[14],
                                    'goalkicks': json.matchData.teams[0].matchTotal.statistics[21]

                                },
                                'playerStatistics': homePlayerStatistics,
                                'teaminfo': hometeaminfo
                            },
                            {
                                'teamname': json.matchData.teams[1].matchTotal.name,
                                'side': json.matchData.teams[1].matchTotal.side,
                                'score': json.matchData.teams[1].matchTotal.statistics[12],
                                'scorereceived': json.matchData.teams[0].matchTotal.statistics[12],
                                'result': awayresult,
                                'statistics': {
                                    'shots': json.matchData.teams[1].matchTotal.statistics[7],
                                    'shotsontarget': json.matchData.teams[1].matchTotal.statistics[8],
                                    'possession': calcPercentages(json.matchData.teams[0].matchTotal.statistics[22], json.matchData.teams[1].matchTotal.statistics[22])[1],
                                    'passes': json.matchData.teams[1].matchTotal.statistics[15],
                                    'passescompleted': json.matchData.teams[1].matchTotal.statistics[9],
                                    'fouls': json.matchData.teams[1].matchTotal.statistics[2],
                                    'yellowcards': json.matchData.teams[1].matchTotal.statistics[1],
                                    'redcards': json.matchData.teams[1].matchTotal.statistics[0],
                                    'offsides': json.matchData.teams[1].matchTotal.statistics[11],
                                    'corners': json.matchData.teams[1].matchTotal.statistics[18],
                                    'throwins': json.matchData.teams[1].matchTotal.statistics[19],
                                    'penalties': json.matchData.teams[1].matchTotal.statistics[17],
                                    'freekicks': json.matchData.teams[1].matchTotal.statistics[16],
                                    'foulssuffered': json.matchData.teams[1].matchTotal.statistics[3],
                                    'goalsconceded': json.matchData.teams[1].matchTotal.statistics[6],
                                    'interceptions': json.matchData.teams[1].matchTotal.statistics[10],
                                    'owngoals': json.matchData.teams[1].matchTotal.statistics[13],
                                    'tackles': json.matchData.teams[1].matchTotal.statistics[4],
                                    'tacklescompleted': json.matchData.teams[1].matchTotal.statistics[5],
                                    'saves': json.matchData.teams[1].matchTotal.statistics[20],
                                    'savescaught': json.matchData.teams[1].matchTotal.statistics[24],
                                    'distancecovered': json.matchData.teams[1].matchTotal.statistics[23],
                                    'assists': json.matchData.teams[1].matchTotal.statistics[14],
                                    'goalkicks': json.matchData.teams[1].matchTotal.statistics[21]
                                },
                                'playerStatistics': awayPlayerStatistics,
                                'teaminfo': awayteaminfo
                            }
                        ],
                        'players': players,
                        'matchevents': matchevents
                    }, (err, r) => {
                        if (err === null) {
                            res.end('Successfully pushed to Database. ID: ' + r.ops[0]._id);
                            client.close();
                        } else {
                            res.end(err);
                            client.close();
                        }
                    });
                });
            });
        });
    }
}