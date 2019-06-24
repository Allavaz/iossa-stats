const ObjectId = require('mongodb').ObjectId;
const MongoClient = require('mongodb').MongoClient;
const { host, user, pw, dbname } = require('./db.json');
const encuser = encodeURIComponent(user);
const encpw = encodeURIComponent(pw);
const authMechanism = 'DEFAULT';
const url = `mongodb://${encuser}:${encpw}@${host}:27017/?authMechanism=${authMechanism}`;
const positionsagg = require('./Aggregations/Positions');
const playersagg = require('./Aggregations/Players');
const queries = require('./Aggregations/Queries');

exports.getPlayers = function(id, res) {
    const client = new MongoClient(url, { useNewUrlParser: true });
    client.connect((err, client) => {
        const db = client.db(dbname);
        db.collection('matchesaux')
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
        db.collection('matchesaux')
            .find({})
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
        db.collection('matchesaux')
            .find({})
            .sort({'assists': -1, 'matches': 1})
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
        db.collection('matchesaux')
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
            db.collection('matchesaux')
            .sort({'fecha': -1})
            .project({'fecha': 1, 'torneo': 1, 'teams': 1})
            .limit(20)
            .toArray((err, docs) => {
                res.json(docs);
                client.close();
            });
        } else {
            db.collection('matchesaux')
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
        db.collection('matchesaux')
            .findOne({"_id": o_id}, (err, doc) => {
                res.json(doc);
                client.close();
            });
    });
}

exports.getPlayerFromID = function(id, res){
    const client = new MongoClient(url, { useNewUrlParser: true })
    client.connect((err, client) => {
        const db = client.db(dbname);
        const o_id = new ObjectId(id);
        db.collection('matchesaux')
            .aggregate(playersagg('all'))
            .findOne({"_id": o_id}, (err, doc) => {
                res.json(doc);
                client.close();
            });
    });
}