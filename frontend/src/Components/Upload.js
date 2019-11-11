import React, { useState } from 'react';
import { api } from '../api';
import axios from 'axios';
import { faCheckCircle, faExclamationTriangle, faSpinner, faKey } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

const torneos = [
	'Liga D1 T4',
	'Liga D2 T4',
	'Copa Gubero T4',
	'Liga D1 T4 - (Desempate)',
	'Liga D1 T4 - Promoción',
	'Division de Honor T0',
	'Liga Master T0',
	'Recopa Master T0',
	'Liga D1 T1',
	'Copa Maradei T1 - Grupo A',
	'Copa Maradei T1 - Grupo B',
	'Copa Maradei T1 - Grupo C',
	'Copa Maradei T1 - Eliminatorias'
]

export default function Upload() {
	const [torneo, setTorneo] = useState(torneos[0]);
	const [pw, setPw] = useState(null);
	const [vod, setVod] = useState(null);
	const [file, setFile] = useState(null);
	const [status, setStatus] = useState(0);
	const [error, setError] = useState(null);

	function submit(torneo, pw, vod, file) {
		let fd = new FormData();
		fd.append('torneo', torneo);
		fd.append('vod', vod);
		fd.append('pw', pw);
		if (file === null) {
			alert('No seleccionaste ningun archivo.')
		} else {
			for (let i=0; i<file.length; i++) {
				fd.append('upload', file[i])
			}
			setStatus(2);
			axios.post(api + 'postupload', fd).then((res) => {
				if (res.data.status === 'success') {
					setStatus(1);
				} else if (res.data === 'Wrong password') {
					setStatus(-1);
				} else {
					setError(res.data.error.toString());
					setStatus(-2);
				}
			})
			.catch((error) => {
				setError(error.toString());
				setStatus(-2);
			});
		}
	}

	function retry() {
		setTorneo(torneos[0]);
		setPw(null);
		setVod(null);
		setFile(null);
		setError(null);
		setStatus(0);
	}

	switch (status) {
		default:
			return (
				<div className='content'>
					<div className='whitespace' style={{padding: '0', width: '310px'}}>
						<div className='form'>
							<h3 style={{marginBottom: 0}}>Cargar Partido</h3>
							<div><input type="file" multiple onChange={(e) => setFile(e.target.files)} accept=".json"></input></div>
							<div><select style={{marginTop: 0, width: '260px'}} id="selector" name="torneo" onChange={(e) => setTorneo(e.target.value)}>
								{torneos.map((e) => (
									<option key={e} name='torneo' value={e}>{e}</option>
								))}
							</select></div>
							<div><input className='campo' type="text" onChange={(e) => setVod(e.target.value)} size="24" placeholder="ID del VOD (Ej: lQMMnMvnMLk)"></input></div>
							<div><input className='campo' type="password" onChange={(e) => setPw(e.target.value)} placeholder="Contraseña"></input></div>
							<div><button className='boton' onClick={() => submit(torneo, pw, vod, file)}>Enviar</button></div>
						</div>
					</div>
				</div>
			)
		case 1:
			return (
				<div className='content'>
					<div className='whitespace' style={{padding: '0', width: '310px', textAlign: 'center', minHeight: '355px'}}>
						<div className='cartel'>
							<FontAwesomeIcon icon={faCheckCircle} color='grey' size='5x'></FontAwesomeIcon>
							<div style={{color: 'grey'}}>Partido(s) cargado(s) correctamente.</div>
							<div><Link to='/resultados'><button style={{margin: 0}} className='boton'>Resultados</button></Link></div>
						</div>
					</div>
				</div>
			)
		case 2:
			return (
				<div className='content'>
					<div className='whitespace' style={{padding: '0', width: '310px', textAlign: 'center', minHeight: '355px'}}>
						<div className='cartel'>
							<FontAwesomeIcon icon={faSpinner} spin color='#ff9800' size='5x'></FontAwesomeIcon>
						</div>
					</div>
				</div>
			)
		case -1:
			return (
				<div className='content'>
					<div className='whitespace' style={{padding: '0', width: '310px', textAlign: 'center', minHeight: '355px'}}>
						<div className='cartel'>
							<FontAwesomeIcon icon={faKey} color='grey' size='5x'></FontAwesomeIcon>
							<div style={{color: 'grey'}}>Contraseña incorrecta.</div>
							<div><button style={{margin: 0}} onClick={() => retry()} className='boton'>Reintentar</button></div>
						</div>
					</div>
				</div>
			)
		case -2:
			return (
				<div className='content'>
					<div className='whitespace' style={{padding: '0', width: '310px', textAlign: 'center', minHeight: '355px'}}>
						<div className='cartel'>
							<FontAwesomeIcon icon={faExclamationTriangle} color='grey' size='5x'></FontAwesomeIcon>
							<div style={{color: 'grey'}}>Ocurrió un error:</div>
							<div style={{color: 'grey', fontFamily: 'monospace'}}>{error}</div>
							<div><button style={{margin: 0}} onClick={() => retry()} className='boton'>Reintentar</button></div>
						</div>
					</div>
				</div>
			)
	}
}
