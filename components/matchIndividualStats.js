import { useState, useMemo } from "react";
import { useTable } from "react-table";
import Link from 'next/link'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPlus, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import MatchIndivStatsEditor from "./matchIndivStatsEditor";

export default function MatchIndividualStats({ players, teamName, editable, changeIndivStats, removePlayer, playersAutocomplete, side }) {
	const [playerHovering, setPlayerHovering] = useState(-1);
  const [playerEditing, setPlayerEditing] = useState(-1);
  const [playerCreating, setPlayerCreating] = useState(null);
  const [hovering, setHovering] = useState(false);

	function onChangeIndivStats(player) {
    let oldsteamid;
    if (player.info.steam_id !== players[playerEditing].info.steam_id) {
      oldsteamid = players[playerEditing].info.steam_id;
    }
    changeIndivStats(player, side, playerEditing, oldsteamid);
    setPlayerCreating(null);
    setPlayerEditing(-1);
    setPlayerHovering(-1);
    setHovering(false);
  }

  function onRemovePlayer(index) {
    removePlayer(players[index], side, index)
  }

  const newItem = () => {
    return({
      info: {
        name: '',
        steam_id: '',
        team: teamName
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

  const columns = useMemo(() => [
		{
			Header: 'Jugador',
			accessor: 'info.name',
			sticky: 'left',
			width: 120,
			Cell: row => {
				if (editable) {
					return (
						<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}} onMouseOver={e => setPlayerHovering(row.row.index)} onMouseOut={e => setPlayerHovering(-1)}>
							<div style={{flex: 1}}>
								<div style={{width: '30px'}}>

								</div>
							</div>
							<div style={{marginLeft: '5px', marginRight: '5px'}}>
								<Link href={'/jugador/' + row.row.original.info.steam_id}><a>{row.row.original.info.name}</a></Link>
							</div>
							<div style={{flex: 1}}>
								<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '30px', opacity: playerHovering === row.row.index ? '100%' : '0%'}}>
									<FontAwesomeIcon icon={faEdit} style={{cursor: 'pointer'}} onClick={e => setPlayerEditing(row.row.index)} />
									<FontAwesomeIcon icon={faTrashAlt} style={{cursor: 'pointer'}} onClick={e => onRemovePlayer(row.row.index)} />
								</div>
							</div>
						</div>
					)
				} else {
					return (
						<Link href={'/jugador/' + row.row.original.info.steam_id}><a>{row.row.original.info.name}</a></Link>
					)
				}
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
				return row.row.original.statistics.shots +" (" + row.row.original.statistics.shotsontarget + ")"
			}
		},
		{
			Header: 'Pases (Completados)',
			accessor: 'statistics.passes',
			width: 160,
			Cell: row => {
				return row.row.original.statistics.passes +" (" + row.row.original.statistics.passescompleted + ")"
			}
		},
		{
			Header: 'Precisión de Pases',
			accessor: 'statistics.passescompleted',
			Cell: row => {
				return isNaN(row.row.original.statistics.passescompleted/row.row.original.statistics.passes) ? '0%' : Math.round((row.row.original.statistics.passescompleted/row.row.original.statistics.passes)*100)+'%'
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
				return row.row.original.statistics.saves +" (" + row.row.original.statistics.savescaught + ")"
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
				return (Math.round(row.row.original.statistics.distancecovered)/1000) + " km"
			}
		},
		{
			Header: 'Posesión',
			accessor: 'statistics.possession',
			width: 80,
			Cell: row => {
				return Math.round(row.row.original.statistics.possession) + "%"
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
				return row.row.original.statistics.tackles +" (" + row.row.original.statistics.tacklescompleted + ")"
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
	], [playerHovering, editable]);

  const data = useMemo(() => players, [players]);
  const tableInstance = useTable({ columns, data });

  const {
    getTableProps,
    getTableBodyProps,
    rows,
    headerGroups,
    prepareRow
  } = tableInstance

  return (
    <div onMouseOver={e => setHovering(true)} onMouseOut={e => setHovering(false)}>
			<div style={{display: 'flex', alignItems: 'center'}}>
				{playerEditing !== -1 ? 
				<MatchIndivStatsEditor player={playerCreating ? newItem() : players[playerEditing]} 
					team={teamName} 
					setPlayerEditing={setPlayerEditing} 
					playerCreating={playerCreating} 
					setPlayerCreating={setPlayerCreating}
					players={playersAutocomplete}
					onChangeIndivStats={onChangeIndivStats}
				/> : null}
	      <h3>ESTADÍSTICAS INDIVIDUALES - {teamName.toUpperCase()}</h3>
				{editable ? <FontAwesomeIcon 
					icon={faPlus} 
					style={{marginLeft: '5px', marginBottom: '2px', opacity: hovering ? '100%' : '0%', cursor: 'pointer'}} 
					onClick={e => {
						setPlayerCreating(side);
            setPlayerEditing(players.length);
					}}
				/> : null}
			</div>
      <div className='divDataTable' style={{borderRight: '1px solid var(--table-border-color)', borderLeft: '1px solid var(--table-border-color)', borderTop: '1px solid var(--table-border-color)'}}>
        <table {...getTableProps()} style={{borderCollapse: 'initial'}} className="dataTable">
          <thead>
            {headerGroups.map((headerGroup, index) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={index}>
                {headerGroup.headers.map((column, index) => (
                  <th {...column.getHeaderProps()} 
									style={column.Header === 'Jugador' ? {
										position: 'sticky',
										left: 0,
										border: '0px',
										borderBottom: '1px solid var(--table-border-color)',
										borderRight: '1px solid var(--table-border-color)',
									} : {
										border: 0, 
										borderBottom: '1px solid var(--table-border-color)', 
										borderLeft: column.Header === 'Pos.' ? 0 : '1px solid var(--table-border-color)'
									}}
									key={index}>
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, index) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} key={index}>
                  {row.cells.map((cell, index) => (
                    <td {...cell.getCellProps()}
                    style={cell.column.Header === 'Jugador' ? {
                      position: 'sticky',
											left: 0,
											border: 0,
											borderBottom: '1px solid var(--table-border-color)',
											borderRight: '1px solid var(--table-border-color)',
                    } : {
											border: 0, 
											borderLeft: cell.column.Header === 'Pos.' ? 0 : '1px solid var(--table-border-color)', 
											borderBottom: '1px solid var(--table-border-color)'
										}}
										key={index}>
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}