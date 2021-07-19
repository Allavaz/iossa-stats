const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const { host, user, pw, dbname, collection } = require('./db.json');
const encuser = encodeURIComponent(user);
const encpw = encodeURIComponent(pw);
const authMechanism = 'DEFAULT';
const url = `mongodb://${encuser}:${encpw}@${host}:27017/?authMechanism=${authMechanism}`;

exports.updateMatch = function(data, res) {
  MongoClient.connect(url, {useNewUrlParser: true}, (err, client) => {
    const db = client.db(dbname);
    const o_id = new ObjectId(data._id);
    delete data._id;
    db.collection(collection).replaceOne({'_id': o_id}, data, (err, r) => {
      if (err === null) {
        res.end("Success!");
        client.close();
      } else {
        res.end("Error");
        console.error(err);
        client.close();
      }
    });
  });
}