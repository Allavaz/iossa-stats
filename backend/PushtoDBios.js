const MongoClient = require('mongodb').MongoClient;
const { host, user, pw, dbname, collection } = require('./db.json');
const encuser = encodeURIComponent(user);
const encpw = encodeURIComponent(pw);
const authMechanism = 'DEFAULT';
const url = `mongodb://${encuser}:${encpw}@${host}:27017/?authMechanism=${authMechanism}`;
// Old Push to DB -> const cd = require('./CreateDocument');
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


    console.log('ACA TERMINO EL PUSH');
    console.log(documents);

}