const ObjectId = require('mongodb').ObjectId;
const MongoClient = require('mongodb').MongoClient;
const { host, user, pw, dbname } = require('./db.json');
const encuser = encodeURIComponent(user);
const encpw = encodeURIComponent(pw);
const authMechanism = 'DEFAULT';
const url = `mongodb://${encuser}:${encpw}@${host}:27017/?authMechanism=${authMechanism}`;

exports.getPlayers = function(id, res) {
    const client = new MongoClient(url, { useNewUrlParser: true });
    client.connect((err, client) => {
        const db = client.db(dbname);
        db.collection('players' + id).find({}).toArray((err, docs) => {
            res.json(docs);
            client.close();
        });
    });
}

exports.getTop10Goals = function(id, res) {
    const client = new MongoClient(url, { useNewUrlParser: true });
    client.connect((err, client) => {
        const db = client.db(dbname);
        db.collection('players' + id).find({}).sort({'goals': -1, 'matches': 1}).limit(10).toArray((err, docs) => {
            res.json(docs);
            client.close();
        });
    });
}

exports.getTop10Assists = function(id, res) {
    const client = new MongoClient(url, { useNewUrlParser: true });
    client.connect((err, client) => {
        const db = client.db(dbname);
        db.collection('players' + id).find({}).sort({'assists': -1, 'matches': 1}).limit(10).toArray((err, docs) => {
            res.json(docs);
            client.close();
        });
    });
}

exports.getPositions = function(id, res) {
    const client = new MongoClient(url, { useNewUrlParser: true });
    client.connect((err, client) => {
        const db = client.db(dbname);
        db.collection('posiciones' + id).find({}).toArray((err, docs) => {
            res.json(docs);
            client.close();
        });
    });
}

exports.getMatches = function(id, res) {
    const client = new MongoClient(url, { useNewUrlParser: true });
    client.connect((err, client) => {
        const db = client.db(dbname);
        switch (id) {
            case '20':
                db.collection('matchesaux').find({}).sort({fecha: -1}).project({fecha: 1, torneo: 1, teams: 1}).limit(20).toArray((err, docs) => {
                    res.json(docs);
                    client.close();
                });
                break;
            case 'all':
                db.collection('matchesaux').find({}).sort({fecha: -1}).project({fecha: 1, torneo: 1, teams: 1}).toArray((err, docs) => {
                    res.json(docs);
                    client.close();
                });
                break;
            case 't2':
                db.collection('matchesaux').find({$or: [
                    {torneo: "Liga D1 - Temporada 2"},
                    {torneo: "Liga D1 - Temporada 2 (Desempate"},
                    {torneo: "Liga D2 - Temporada 1"},
                    {torneo: "Copa Master 2019"},
                    {torneo: "Recopa Master 2019"}
                ]}).sort({fecha: -1}).project({fecha: 1, torneo: 1, teams: 1}).toArray((err, docs) => {
                    res.json(docs);
                    client.close();
                });
                break;
            case 't3':
                db.collection('matchesaux').find({$or: [
                    {torneo: "Liga D1 T3"},
                    {torneo: "Liga D2 T3"},
                    {torneo: "Copa Master T3"},
                    {torneo: "Copa Maradei T3 - Grupo A"},
                    {torneo: "Copa Maradei T3 - Grupo B"},
                    {torneo: "Copa Maradei T3 - Grupo C"},
                    {torneo: "Copa Maradei T3 - Grupo D"},
                    {torneo: "Copa Maradei T3 - Eliminatorias"}
                ]}).sort({fecha: -1}).project({fecha: 1, torneo: 1, teams: 1}).toArray((err, docs) => {
                    res.json(docs);
                    client.close();
                });
                break;
            case 'd1':
                db.collection('matchesaux').find({$or: [
                    {torneo: "Liga D1 - Temporada 2"},
                    {torneo: "Liga D1 - Temporada 2 (Desempate)"},
                    {torneo: "Liga D1 T3"},
                ]}).sort({fecha: -1}).project({fecha: 1, torneo: 1, teams: 1}).toArray((err, docs) => {
                    res.json(docs);
                    client.close();
                });
            case 'd2':
                db.collection('matchesaux').find({$or: [
                    {torneo: "Liga D2 - Temporada 1"},
                    {torneo: "Liga D2 T3"},
                ]}).sort({fecha: -1}).project({fecha: 1, torneo: 1, teams: 1}).toArray((err, docs) => {
                    res.json(docs);
                    client.close();
                });
                break;
            case 'maradei':
                db.collection('matchesaux').find({$or: [
                    {torneo: "Copa Maradei T3 - Grupo A"},
                    {torneo: "Copa Maradei T3 - Grupo B"},
                    {torneo: "Copa Maradei T3 - Grupo C"},
                    {torneo: "Copa Maradei T3 - Grupo D"},
                    {torneo: "Copa Maradei T3 - Eliminatorias"}
                ]}).sort({fecha: -1}).project({fecha: 1, torneo: 1, teams: 1}).toArray((err, docs) => {
                    res.json(docs);
                    client.close();
                });
                break;
            case 'master':
                db.collection('matchesaux').find({$or: [
                    {torneo: "Copa Master 2019"},
                    {torneo: "Copa Master T3"},
                ]}).sort({fecha: -1}).project({fecha: 1, torneo: 1, teams: 1}).toArray((err, docs) => {
                    res.json(docs);
                    client.close();
                });
                break;
            case 'd1t2':
                db.collection('matchesaux').find({$or: [{torneo: "Liga D1 - Temporada 2"}, {torneo: "Liga D1 - Temporada 2 (Desempate)"}]}).sort({fecha: -1}).project({fecha: 1, torneo: 1, teams: 1}).toArray((err, docs) => {
                    res.json(docs);
                    client.close();
                });
                break;
            case 'd2t1':
                db.collection('matchesaux').find({torneo: "Liga D2 - Temporada 1"}).sort({fecha: -1}).project({fecha: 1, torneo: 1, teams: 1}).toArray((err, docs) => {
                    res.json(docs);
                    client.close();
                });
                break;
            case 'd1t3':
                db.collection('matchesaux').find({torneo: "Liga D1 T3"}).sort({fecha: -1}).project({fecha: 1, torneo: 1, teams: 1}).toArray((err, docs) => {
                    res.json(docs);
                    client.close();
                });
                break;
            case 'd2t3':
                db.collection('matchesaux').find({torneo: "Liga D2 T3"}).sort({fecha: -1}).project({fecha: 1, torneo: 1, teams: 1}).toArray((err, docs) => {
                    res.json(docs);
                    client.close();
                });
                break;
            case 'master2019':
                db.collection('matchesaux').find({torneo: "Copa Master 2019"}).sort({fecha: -1}).project({fecha: 1, torneo: 1, teams: 1}).toArray((err, docs) => {
                    res.json(docs);
                    client.close();
                });
                break;
            case 'mastert3':
                db.collection('matchesaux').find({torneo: "Copa Master T3"}).sort({fecha: -1}).project({fecha: 1, torneo: 1, teams: 1}).toArray((err, docs) => {
                    res.json(docs);
                    client.close();
                });
                break;
            case 'maradeit3':
                db.collection('matchesaux').find({$or: [
                    {torneo: "Copa Maradei T3 - Eliminatorias"}, 
                    {torneo: "Copa Maradei T3 - Grupo A"},
                    {torneo: "Copa Maradei T3 - Grupo B"},
                    {torneo: "Copa Maradei T3 - Grupo C"},
                    {torneo: "Copa Maradei T3 - Grupo D"}
                ]})
                .sort({fecha: -1}).project({fecha: 1, torneo: 1, teams: 1}).toArray((err, docs) => {
                    res.json(docs);
                    client.close();
                });
                break;
            default:
                res.send("Invalid argument.")
                break;
        }
    })
}

exports.getMatchID = function(id, res){
    const client = new MongoClient(url, { useNewUrlParser: true })
    client.connect((err, client) => {
        const db = client.db(dbname)
        const o_id = new ObjectId(id)
        db.collection('matchesaux').find({_id: o_id}).toArray((err, docs) => {
            res.json(docs[0])
            client.close()
        })
    })
}

exports.getPlayerID = function(id, res){
    const client = new MongoClient(url, { useNewUrlParser: true })
    client.connect((err, client) => {
        db.collection('players').find({"_id": id}).toArray((err, docs) => {
            res.json(docs[0])
            client.close()
        })
    })
}