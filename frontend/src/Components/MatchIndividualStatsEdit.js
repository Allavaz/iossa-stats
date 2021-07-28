import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import withFixedColumns from 'react-table-hoc-fixed-columns';
import 'react-table-hoc-fixed-columns/lib/styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import MatchIndivStatsEditor from './MatchIndivStatsEditor';

const ReactTableFixedColumns = withFixedColumns(ReactTable);

function getLargestName(data) {
  let len = 0;
  for (let i in data.playerStatistics) {
    if (data.playerStatistics[i].info.name.length > len) {
      len = data.playerStatistics[i].info.name.length;
    }
  }
  return len;
}

export default function MatchIndividualStatsEdit(props) {
  const [playerHovering, setPlayerHovering] = useState(-1);
  const [playerEditing, setPlayerEditing] = useState(-1);
  const [playerCreating, setPlayerCreating] = useState(null);
  const [hovering, setHovering] = useState(false);

  function onChangeIndivStats(player) {
    let oldsteamid;
    if (player.info.steam_id !== props.data.playerStatistics[playerEditing].info.steam_id) {
      oldsteamid = props.data.playerStatistics[playerEditing].info.steam_id;
    }
    props.changeIndivStats(player, props.side, playerEditing, oldsteamid);
    setPlayerCreating(null);
    setPlayerEditing(-1);
    setPlayerHovering(-1);
    setHovering(false);
  }

  function onRemovePlayer(index) {
    props.removePlayer(props.data.playerStatistics[index], props.side, index)
  }

  const newItem = () => {
    return({
      info: {
        name: '',
        steam_id: '',
        team: props.data.teamname
      },
      statistics: {
        assists: 0,
        corners: 0,
        distancecovered: 0,
        fouls: 0,
        foulssuffered: 0,
        freekicks: 0,
        goalkicks: 0,
        goals: 0,
        goalsconceded: 0,
        interceptions: 0,
        offsides: 0,
        owngoals: 0,
        passes: 0,
        passescompleted: 0,
        penalties: 0,
        positions: [],
        possession: 0,
        redcards: 0,
        saves: 0,
        savescaught: 0,
        secondsplayed: 0,
        shots: 0,
        shotsontarget: 0,
        tackles: 0,
        tacklescompleted: 0,
        throwins: 0,
        yellowcards: 0
      }
    })
  }

  const matchIndivStatsColumns = [
    {
      Header: 'Jugador',
      accessor: 'info.name',
      fixed: 'left',
        minWidth: getLargestName(props.data)*10+75,
        Cell: row => {
          return (
            <div 
              style={{
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                marginLeft: '40px',
              }}
              onMouseOver={e => setPlayerHovering(row.index)}
              onMouseOut={e => setPlayerHovering(-1)}
            >
              <Link to={'/jugador/' + row.row._original.info.steam_id}>{row.row._original.info.name}</Link>
              <FontAwesomeIcon icon={faEdit} 
                style={{
                  cursor: 'pointer', 
                  marginLeft: '5px',
                  opacity: playerHovering === row.index ? '100%' : '0%'
                }}
                onClick={e => setPlayerEditing(row.index)}
              />
              <FontAwesomeIcon icon={faTrashAlt} 
                style={{
                  cursor: 'pointer', 
                  marginLeft: '5px',
                  opacity: playerHovering === row.index ? '100%' : '0%'
                }}
                onClick={e => onRemovePlayer(row.index)}
              />
            </div>
          )
        }
      },
    {
      Header: 'Pos.',
      accessor: 'statistics.positions[0].position',
      width: 50
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

  return (
    <div onMouseOver={e => setHovering(true)} onMouseOut={e => setHovering(false)}>
      {playerEditing !== -1 ? 
      <MatchIndivStatsEditor player={playerCreating ? newItem() : props.data.playerStatistics[playerEditing]} 
        team={props.data} 
        setPlayerEditing={setPlayerEditing} 
        playerCreating={playerCreating} 
        setPlayerCreating={setPlayerCreating}
        players={props.players}
        onChangeIndivStats={onChangeIndivStats}
      /> : null}
      <h3>
        ESTADÍSTICAS INDIVIDUALES - {props.data.teamname.toString().toUpperCase()}
        <FontAwesomeIcon icon={faPlus} 
          style={{
            cursor: 'pointer', 
            color: 'var(--normal-text-color)', 
            marginLeft: '.75ch',
            opacity: hovering ? '100%' : '0%'
          }}
          onClick={e => {
            setPlayerCreating(props.side);
            setPlayerEditing(props.data.playerStatistics.length);
          }}
        />
      </h3>
      <div className='divDataTable'>
        <ReactTableFixedColumns
          className='-striped -highlight'
          data={props.data.playerStatistics} 
          columns={matchIndivStatsColumns}
          resizable={false}
          previousText={'Anterior'}
          nextText={'Siguiente'}
          noDataText={'No hay jugadores'}
          pageText={'Página'}
          ofText={'de'}
          rowsText={'filas'}
          showPagination={false}
          minRows={0}
        />
      </div>
    </div>
  );
}
