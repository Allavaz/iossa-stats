const ObjectId = require('mongodb').ObjectId;
const MongoClient = require('mongodb').MongoClient;
const { host, user, pw, dbname, collection } = require('./db.json');
const encuser = encodeURIComponent(user);
const encpw = encodeURIComponent(pw);
const authMechanism = 'DEFAULT';
const url = `mongodb://${encuser}:${encpw}@${host}:27017/?authMechanism=${authMechanism}`;
const positionsagg = require('./Aggregations/Positions');
const playersagg = require('./Aggregations/Players');
const playerlast15agg = require('./Aggregations/PlayerLast15');
const top10goalsagg = require('./Aggregations/Top10Goals');
const top10assistsagg = require('./Aggregations/Top10Assists');
const top10rusticosagg = require('./Aggregations/Top10Rusticos');
const queries = require('./Aggregations/Queries');

exports.getEverything = function(res) {
    const client = new MongoClient(url, { useNewUrlParser: true });
    client.connect((err, client) => {
        const db = client.db(dbname);
        db.collection(collection).find({})
            .toArray((err, docs) => {
                res.json(docs);
                client.close();
            });
    });
}

exports.getPlayers = function(id, res) {
    const client = new MongoClient(url, { useNewUrlParser: true });
    client.connect((err, client) => {
        const db = client.db(dbname);
        db.collection(collection)
            .aggregate(playersagg(id))
            .toArray((err, docs) => {
                res.json(docs);
                client.close();
            });
    });
}

exports.getTop10Goals = function(id, res) {
    const client = new MongoClient(url, { useNewUrlParser: true });
    client.connect((err, client) => {
        const db = client.db(dbname);
        db.collection(collection)
            .aggregate(top10goalsagg(id))
            .sort({'goals': -1, 'matches': 1})
            .limit(10)
            .toArray((err, docs) => {
                res.json(docs);
                client.close();
            });
    });
}

exports.getTop10Assists = function(id, res) {
    const client = new MongoClient(url, { useNewUrlParser: true });
    client.connect((err, client) => {
        const db = client.db(dbname);
        db.collection(collection)
            .aggregate(top10assistsagg(id))
            .sort({'assists': -1, 'matches': 1})
            .limit(10)
            .toArray((err, docs) => {
                res.json(docs);
                client.close();
            });
    });
}

exports.getTop10Rusticos = function(id, res) {
    const client = new MongoClient(url, { useNewUrlParser: true });
    client.connect((err, client) => {
        const db = client.db(dbname);
        db.collection(collection)
            .aggregate(top10rusticosagg(id))
            .sort({'redcards': -1, 'yellowcards': -1, 'fouls': 1, 'matches': 1})
            .limit(10)
            .toArray((err, docs) => {
                res.json(docs);
                client.close();
            });
    });
}

exports.getPositions = function(id, res) {
    const client = new MongoClient(url, { useNewUrlParser: true });
    client.connect((err, client) => {
        const db = client.db(dbname);
        db.collection(collection)
            .aggregate(positionsagg(id))
            .toArray((err, docs) => {
                res.json(docs);
                client.close();
            });
    });
}

exports.getMatches = function(id, res) {
    const client = new MongoClient(url, { useNewUrlParser: true });
    client.connect((err, client) => {
        const db = client.db(dbname);
        if (id === '20') {
            db.collection(collection)
            .find({})
            .sort({'fecha': -1})
            .project({'fecha': 1, 'torneo': 1, 'teams': 1})
            .limit(20)
            .toArray((err, docs) => {
                res.json(docs);
                client.close();
            });
        } else {
            db.collection(collection)
            .find(queries[id])
            .sort({'fecha': -1})
            .project({'fecha': 1, 'torneo': 1, 'teams': 1})
            .toArray((err, docs) => {
                res.json(docs);
                client.close();
            });
        }
    });
}

exports.getMatchFromID = function(id, res){
    const client = new MongoClient(url, { useNewUrlParser: true })
    client.connect((err, client) => {
        const db = client.db(dbname);
        const o_id = new ObjectId(id);
        db.collection(collection)
            .findOne({"_id": o_id}, (err, doc) => {
                res.json(doc);
                client.close();
            });
    });
}

exports.getPlayerFromID = function(id, torneo, res){
    const client = new MongoClient(url, { useNewUrlParser: true })
    client.connect((err, client) => {
        const db = client.db(dbname);
        db.collection(collection)
            .aggregate(playersagg(torneo))
            .match({"_id": id})
            .toArray((err, doc) => {
                res.json(doc);
                client.close();
            });
    });
}

exports.getPlayerMatchesFromID = async function(id, res) {
    const client = new MongoClient(url, { useNewUrlParser: true })
    let c = await client.connect();
    const db = c.db(dbname);
    let matches = await db.collection(collection)
        .find({"players.info.steam_id": id})
        .sort({fecha: -1})
        .toArray()
    res.json(matches);
}