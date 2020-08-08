const express = require('express');
const app = express();
const formidable = require('formidable');
const db = require('./PushToDB');
const idb = require('./PushToDBios');
const rdb = require('./GetFromDB');
const cors = require('cors');
const path = require('path');
const { key } = require('./db.json');
const steam = require('./steam');
const serverip = require('./serverip');

app.use(express.json());

app.use(cors());

app.post('/api/postupload', (req, res) => {
	var form = formidable.IncomingForm();
	form.multiples = true;
	form.parse(req, (err, fields, files) => {
		if (fields.pw === key) {
			try {
				db.pushToDB(files.upload, fields.torneo, fields.vod, res);
			} catch(e) {
				console.error(e);
				res.end(e.toString());
			}
		} else {
			res.end('Wrong Key');
		}
	});
});

app.post('/api/postuploadios', (req, res) => {
	let torneo = `${req.body.access_token}`;
	let vod = "";
	console.dir(`Received JSON from ${req.ip} with Token ID: ${torneo}`);
	if (req.ip === serverip) {
		try {
			idb.pushToDBios(req.body, torneo, vod, res);
			res.end(' -> JSON subido con exito');
		} catch(e) {
			console.error(e);
			res.end(e.toString());
		}
	} else {
		res.end(' -> Wrong IP');
	}
});

app.get('/api/everything', (req, res) => {
	rdb.getEverything(res);
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

app.get('/api/player/:id/:torneo', (req, res) => {
	rdb.getPlayerFromID(req.params.id, req.params.torneo, res);
});

app.get('/api/getsteaminfo/:id', (req, res) => {
	steam.getSteamInfo(req.params.id, res);
});

app.get('/api/getplayermatches/:id', (req, res) => {
	rdb.getPlayerMatchesFromID(req.params.id, res);
});

app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));

app.get('/*', function(req, res){
	res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));
});

app.listen(3000, "0.0.0.0", () => {
	console.log(`Server started on port 3000`);
});