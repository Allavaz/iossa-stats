import React, { useState, useRef } from 'react';
import { api } from '../api';
import axios from 'axios';

const torneos = [
	'Liga D1 T4',
	'Liga D2 T4'
]

function submit(torneo, pw, vod, file) {
	console.log(file);
}

export default function Upload() {
	const file = useRef(null);
	const [torneo, setTorneo] = useState(torneos[0]);
	const [pw, setPw] = useState(null);
	const [vod, setVod] = useState(null);

	return (
		<div className='content'>
			<div className='whitespace'>
				<form id="uploadForm" onSubmit={submit(torneo, pw, vod, file.current)}>
					<input type="file" ref={file.current} accept=".json"></input>
					<select name="torneo" onChange={(e) => setTorneo(e.target.value)}>
						{torneos.map((e) => (
							<option name='torneo' value={e}>{e}</option>
						))}
					</select>
					<input type="text" onChange={(e) => setVod(e.target.value)} size="24" placeholder="ID del VOD (Ej: lQMMnMvnMLk)"></input>
					<input type="password" onChange={(e) => setPw(e.target.value)} placeholder="Clave"></input>
					<input type='submit'></input>
				</form>
			</div>
		</div>
	)
}
