const MongoClient = require('mongodb').MongoClient;
const { host, user, pw, dbname, collection } = require('./db.json');
const encuser = encodeURIComponent(user);
const encpw = encodeURIComponent(pw);
const authMechanism = 'DEFAULT';
const url = `mongodb://${encuser}:${encpw}@${host}:27017/?authMechanism=${authMechanism}`;
const cj = require('./CreateJSON');

exports.pushToDBios = function(files, torneo, vod, res) {
    if (vod == "") {
        vod = null;
    }

    let documents = []

    if (Array.isArray(files)) {
        files.forEach((item) => {
            documents.push(cj.createJSON(item, torneo, vod, res));
        });
    } else {
        documents.push(cj.createJSON(files, torneo, vod, res));
    }

    MongoClient.connect(url, {useNewUrlParser: true}, (err, client) => {
        const db = client.db(dbname);
        db.collection(collection).insertMany(documents, (err, r) => {
            if (err === null) {
                res.json({
                    status: 'success'
                });
                client.close();
            } else {
                res.json({
                    status: 'error',
                    error: err
                });
                console.error(err);
                client.close();
            }
        });
    });
}