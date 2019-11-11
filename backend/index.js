const express = require('express');
const app = express();
const formidable = require('formidable');
const db = require('./PushToDB');
const rdb = require('./GetFromDB');
const cors = require('cors');
const path = require('path');
const { key } = require('./db.json');

app.use(cors());

app.post('/api/postupload', (req, res) => {
	var form = formidable.IncomingForm();
	form.multiples = true;
	form.parse(req, (err, fields, files) => {
		if (fields.pw === key) {
			try {
				db.pushToDB(files.upload, fields.torneo, fields.vod, res);
			} catch(e) {
				res.end(e);
			}
		} else {
			res.end('Wrong password');
		}
	});
});

app.get('/api/players/:id', (req, res) => {
	rdb.getPlayers(req.params.id, res);
});

app.get('/api/top10goals/:id', (req, res) => {
	rdb.getTop10Goals(req.params.id, res);
});

app.get('/api/top10assists/:id', (req, res) => {
	rdb.getTop10Assists(req.params.id, res);
});

app.get('/api/top10rusticos/:id', (req, res) => {
	rdb.getTop10Rusticos(req.params.id, res);
});

app.get('/api/positions/:id', (req, res) => {
	rdb.getPositions(req.params.id, res);
});

app.get('/api/matches/:id', (req, res) => {
	rdb.getMatches(req.params.id, res);
});

app.get('/api/match/:id', (req, res) => {
	rdb.getMatchFromID(req.params.id, res);
});

app.get('/api/player/:id', (req, res) => {
	rdb.getPlayerFromID(req.params.id, res);
});

app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', function(req, res){
	res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(3000, "0.0.0.0", () => {
	console.log(`Server started on port 3000`);
});