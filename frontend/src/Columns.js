import React from 'react';
import { fecha, getTournamentIcon } from './Utils';
import Teams from './Teams';

export const playersColumns = [
    {
        Header: 'Equipo',
        accessor: 'team',
        width: 200,
        Cell: row => {
            return <div className='teamlogo' style={{justifyContent: 'center', paddingRight: '5px'}}><img height='16px' src={`clubs/${Teams[row.row._original.team].toLowerCase()}.png`} alt={row.row._id}></img> {row.row.team}</div>
        },
        filterable: true
    },
    {
        Header: 'Jugador',
        accessor: 'name',
        fixed: 'left',
        width: 150,
        filterable: true
    },
    {
        Header: 'Partidos',
        accessor: 'matches',
        width: 70
    },
    {
        Header: 'Goles',
        accessor: 'goals',
        width: 70
    },
    {
        Header: 'Asistencias',
        accessor: 'assists',
        width: 100
    },
    {
        Header: 'Tiros (al Arco)',
        accessor: 'shotsontarget',
        width: 130,
        Cell: row => {
            return row.row._original.shots +" (" + row.row._original.shotsontarget + ")"
        }
    },
    {
        Header: 'Pases (Completados)',
        accessor: 'passescompleted',
        width: 160,
        Cell: row => {
            return row.row._original.passes +" (" + row.row._original.passescompleted + ")"
        }
    },
    {
        Header: 'Precisión de Pases',
        accessor: 'passescompleted',
        Cell: row => {
            return isNaN(row.row._original.passescompleted/row.row._original.passes) ? '0%' : Math.round((row.row._original.passescompleted/row.row._original.passes)*100)+'%'
        },
        width: 150
    },
    {
        Header: 'Intercepciones',
        accessor: 'interceptions',
        width: 130
    },
    {
        Header: 'Atajadas (Sin Rebote)',
        accessor: 'savescaught',
        width: 180,
        Cell: row => {
            return row.row._original.saves +" (" + row.row._original.savescaught + ")"
        }
    },
    {
        Header: 'Faltas',
        accessor: 'fouls',
        width: 80
    },
    {
        Header: 'Tarjetas Amarillas',
        accessor: 'yellowcards',
        width: 150
    },
    {
        Header: 'Tarjetas Rojas',
        accessor: 'redcards',
        width: 130
    },
    {
        Header: 'Goles en Contra',
        accessor: 'owngoals',
        width: 130
    },
    {
        Header: 'Offsides',
        accessor: 'offsides',
        width: 80
    },
    {
        Header: 'Prom. Distancia Recorrida',
        accessor: 'distancecovered',
        width: 200,
        Cell: row => {
            return (Math.round(row.row._original.distancecovered)/1000)+ " km"
        }
    },
    {
        Header: 'Prom. Posesión',
        accessor: 'possession',
        width: 130,
        Cell: row => {
            return Math.round(row.row._original.possession)+ "%"
        }
    },
    {
        Header: 'Córners',
        accessor: 'corners',
        width: 80
    },
    {
        Header: 'Laterales',
        accessor: 'throwins',
        width: 90
    },
    {
        Header: 'Penales',
        accessor: 'penalties',
        width: 80
    },
    {
        Header: 'Tiros Libres',
        accessor: 'freekicks',
        width: 110
    },
    {
        Header: 'Tackles (Completados)',
        accessor: 'tacklescompleted',
        width: 180,
        Cell: row => {
            return row.row._original.tackles +" (" + row.row._original.tacklescompleted + ")"
        }
    },
    {
        Header: 'Faltas Sufridas',
        accessor: 'foulssuffered',
        width: 120
    },
    {
        Header: 'Saques de Arco',
        accessor: 'goalkicks',
        width: 130
    },
    {
        Header: 'Goles Recibidos',
        accessor: 'goalsconceded',
        width: 130
    },
]

export const matchIndivStatsColumns = [
	{
		Header: 'Jugador',
		accessor: 'info.name',
		fixed: 'left',
		width: 100,
	},
	{
		Header: 'Goles',
		accessor: 'statistics.goals',
		width: 70
	},
	{
		Header: 'Asistencias',
		accessor: 'statistics.assists',
		width: 100
	},
	{
		Header: 'Tiros (al Arco)',
		accessor: 'statistics.shotsontarget',
		width: 130,
		Cell: row => {
			return row.row._original.statistics.shots +" (" + row.row._original.statistics.shotsontarget + ")"
		}
	},
	{
		Header: 'Pases (Completados)',
		accessor: 'statistics.passescompleted',
		width: 160,
		Cell: row => {
			return row.row._original.statistics.passes +" (" + row.row._original.statistics.passescompleted + ")"
		}
	},
	{
		Header: 'Precisión de Pases',
		accessor: 'statistics.passescompleted',
		Cell: row => {
			return isNaN(row.row._original.statistics.passescompleted/row.row._original.statistics.passes) ? '0%' : Math.round((row.row._original.statistics.passescompleted/row.row._original.statistics.passes)*100)+'%'
		},
		width: 150
	},
	{
		Header: 'Intercepciones',
		accessor: 'statistics.interceptions',
		width: 130
	},
	{
		Header: 'Atajadas (Sin Rebote)',
		accessor: 'savescaught',
		width: 180,
		Cell: row => {
			return row.row._original.statistics.saves +" (" + row.row._original.statistics.savescaught + ")"
		}
	},
	{
		Header: 'Faltas',
		accessor: 'statistics.fouls',
		width: 80
	},
	{
		Header: 'Tarjetas Amarillas',
		accessor: 'statistics.yellowcards',
		width: 150
	},
	{
		Header: 'Tarjetas Rojas',
		accessor: 'statistics.redcards',
		width: 130
	},
	{
		Header: 'Goles en Contra',
		accessor: 'statistics.owngoals',
		width: 130
	},
	{
		Header: 'Offsides',
		accessor: 'statistics.offsides',
		width: 80
	},
	{
		Header: 'Distancia Recorrida',
		accessor: 'statistics.distancecovered',
		width: 150,
		Cell: row => {
			return (Math.round(row.row._original.statistics.distancecovered)/1000) + " km"
		}
	},
	{
		Header: 'Posesión',
		accessor: 'statistics.possession',
		width: 80,
		Cell: row => {
			return Math.round(row.row._original.statistics.possession) + "%"
		}
	},
	{
		Header: 'Córners',
		accessor: 'statistics.corners',
		width: 80
	},
	{
		Header: 'Laterales',
		accessor: 'statistics.throwins',
		width: 90
	},
	{
		Header: 'Penales',
		accessor: 'statistics.penalties',
		width: 80
	},
	{
		Header: 'Tiros Libres',
		accessor: 'statistics.freekicks',
		width: 110
	},
	{
		Header: 'Tackles (Completados)',
		accessor: 'statistics.tacklescompleted',
		width: 180,
		Cell: row => {
			return row.row._original.statistics.tackles +" (" + row.row._original.statistics.tacklescompleted + ")"
		}
	},
	{
		Header: 'Faltas Sufridas',
		accessor: 'statistics.foulssuffered',
		width: 120
	},
	{
		Header: 'Saques de Arco',
		accessor: 'statistics.goalkicks',
		width: 130
	},
	{
		Header: 'Goles Recibidos',
		accessor: 'statistics.goalsconceded',
		width: 130
	},
]

export const resultColumns = [
    {
        Header: 'Fecha',
        accessor: 'fecha',
        Cell: row => {
            return fecha(row.row._original.fecha)
        },
        width: 110
    },
    {
        Header: 'Local',
        accessor: 'teams[0].teamname',
        Cell: row => {
            return <div className='teamlogo' id='home'><div id='teamname'>{row.row._original.teams[0].teamname}</div><div id='shortname'>{Teams[row.row._original.teams[0].teamname]}</div> <img height='16px' src={`/clubs/${Teams[row.row._original.teams[0].teamname].toLowerCase()}.png`} alt={row.row._original.teams[0].teamname}></img></div>
        }
    },
    {
        Header: 'Resultado',
        accessor: 'teams[0].score',
        Cell: row => {
            return row.row._original.teams[0].score + " - " + row.row._original.teams[1].score
        },
        width: 60
    },
    {
        Header: 'Visitante',
        accessor: 'teams[1].teamname',
        Cell: row => {
            return <div className='teamlogo' id='away'><img height='16px' src={`/clubs/${Teams[row.row._original.teams[1].teamname].toLowerCase()}.png`} alt={row.row._original.teams[1].teamname}></img> <div id='teamname'>{row.row._original.teams[1].teamname}</div><div id='shortname'>{Teams[row.row._original.teams[0].teamname]}</div></div>
        }
    },
    {
        Header: 'Torneo',
        accessor: 'torneo',
        Cell: row => {
            return <div style={{display: 'flex', justifyContent: 'center'}}><img id='torneoimg' height='16px' src={getTournamentIcon(row.row._original.torneo)} alt={row.row._original.torneo}></img> <div className='torneo'>{row.row._original.torneo}</div></div>
        },
        filterable: true,
    }
];