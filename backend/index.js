const express = require('express');
const app = express();
const formidable = require('formidable');
const fs = require('fs');
const db = require('./PushToDB');
const rdb = require('./GetFromDB');
const cors = require('cors');
const path = require('path');
const { endpoint, key } = require('./db.json');

app.use(cors());

app.post('/postupload', (req, res) => {
	var form = formidable.IncomingForm();
	form.parse(req, (err, fields, files) => {
		if (fields.pw === key) {
			fs.readFile(files.upload.path, (err, data) => {
				try {
					var json = JSON.parse(data);
					db.pushToDB(json, files.upload.name, fields.torneo, fields.vod, res);
				} catch(e) {
					res.end('Invalid file. Try again. ' + e);
				}		
			});
		} else {
			res.end('Wrong password');
		}
	});
});

app.get('/' + endpoint, (req, res) => {
	res.writeHead(200, {'content-type': 'text/html'});
	res.end(
		'<form id="uploadForm" action="/postupload" enctype="multipart/form-data" method="post">'+
		'<input type="file" name="upload" accept=".json"><br></br>'+
		'<select name="torneo" class="select">'+
		'<option name="torneo" value="Liga D1 T3">Liga D1 T3</option>'+
		'<option name="torneo" value="Liga D2 T3">Liga D2 T3</option>'+
		'<option name="torneo" value="Copa Maradei T3 - Grupo A">Copa Maradei T3 - Grupo A</option>'+
		'<option name="torneo" value="Copa Maradei T3 - Grupo B">Copa Maradei T3 - Grupo B</option>'+
		'<option name="torneo" value="Copa Maradei T3 - Grupo C">Copa Maradei T3 - Grupo C</option>'+
		'<option name="torneo" value="Copa Maradei T3 - Grupo D">Copa Maradei T3 - Grupo D</option>'+
		'<option name="torneo" value="Copa Maradei T3 - Eliminatorias">Copa Maradei T3 - Eliminatorias</option>'+
		'<option name="torneo" value="Copa Master T3">Copa Master T3</option>'+
		'<option name="torneo" value="Supercopa Master T3">Supercopa Master T3</option>'+
		'</select><br></br>'+
		'<input type="text" id="vod" name="vod" size="24" placeholder="ID del VOD (Ej: lQMMnMvnMLk)"></input><br></br>'+
		'<input type="password" id="pw" name="pw" placeholder="Clave"></input><br></br>'+
		'<input type="submit">'+
		'</form>'
	  );
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