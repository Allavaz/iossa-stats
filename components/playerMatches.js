import { useMemo } from "react";
import { useTable } from 'react-table';
import Link from 'next/link';
import { getTeamLogo, fecha, getTeamShortname, getTournamentIcon } from '../utils/Utils';

function WonOrLost(match, playerID) {
  for (let i in match.teams[0].playerStatistics) {
    if (match.teams[0].playerStatistics[i].info.steam_id === playerID) {
      if (match.teams[0].result === 1) {
        return <div style={{color: 'green'}}>W</div>
      } else if (match.teams[0].result === -1) {
        return <div style={{color: 'red'}}>L</div>
      } else if (match.teams[0].result === 0) {
        return <div style={{color: 'orange'}}>D</div>
      }
    }
  }
  for (let i in match.teams[1].playerStatistics) {
    if (match.teams[1].playerStatistics[i].info.steam_id === playerID) {
      if (match.teams[1].result === 1) {
        return <div style={{color: 'green'}}>W</div>
      } else if (match.teams[1].result === -1) {
        return <div style={{color: 'red'}}>L</div>
      } else if (match.teams[1].result === 0) {
        return <div style={{color: 'orange'}}>D</div>
      }
    }
  }
}

export default function PlayerMatches ({ matches, id }) {
  const columns = useMemo(() => [
    {
      Header: 'Fecha',
      accessor: 'fecha',
      Cell: row => {
        return <Link href={`/partido/${row.row.original._id}`}><a>{fecha(row.row.original.fecha)}</a></Link>
      },
      width: 110,
      disableGlobalFilter: true
    },
    {
      Header: 'Resultado',
      accessor: 'result',
      Cell: row => <Link href={`/partido/${row.row.original._id}`}><a>{WonOrLost(row.row.original, id)}</a></Link>
    },
    {
      Header: 'Local',
      accessor: 'teams[0].teamname',
      Cell: row => {
        return <Link href={`/partido/${row.row.original._id}`}><a><div className='teamlogo' id='home'><div id='teamname'>{row.row.original.teams[0].teamname}</div><div id='shortname'>{getTeamShortname(row.row.original.teams[0].teamname)}</div> <div style={{marginLeft: '5px'}}><img height='16px' src={getTeamLogo(row.row.original.teams[0].teamname)} alt={row.row.original.teams[0].teamname}></img></div></div></a></Link>
      }
    },
    {
      Header: 'Resultado',
      accessor: 'teams[0].score',
      Cell: row => {
        return <Link href={`/partido/${row.row.original._id}`}>{row.row.original.teams[0].score + " - " + row.row.original.teams[1].score}</Link>
      },
      width: 60,
      disableGlobalFilter: true
    },
    {
      Header: 'Visitante',
      accessor: 'teams[1].teamname',
      Cell: row => {
        return <Link href={`/partido/${row.row.original._id}`}><a><div className='teamlogo' id='away'><div style={{marginRight: '5px'}}><img height='16px' src={getTeamLogo(row.row.original.teams[1].teamname)} alt={row.row.original.teams[1].teamname}></img></div> <div id='teamname'>{row.row.original.teams[1].teamname}</div><div id='shortname'>{getTeamShortname(row.row.original.teams[1].teamname)}</div></div></a></Link>
      }
    },
    {
      Header: 'Torneo',
      accessor: 'torneo',
      Cell: row => {
        return <Link href={`/partido/${row.row.original._id}`}><a><div style={{display: 'flex', justifyContent: 'center'}}><img id='torneoimg' height='16px' src={getTournamentIcon(row.row.original.torneo)} alt={row.row.original.torneo}></img> <div className='torneo'>{row.row.original.torneo}</div></div></a></Link>
      },
    }
  ], []);

  const data = useMemo(() => matches, [matches]);
  const tableInstance = useTable({ columns, data });

  const {
    getTableProps,
    getTableBodyProps,
    rows,
    prepareRow
  } = tableInstance

  return (
    <>
      <h3 style={{marginTop: 0}}>ÚLTIMOS RESULTADOS</h3>
      <div className='divDataTable' style={{borderLeft: '1px solid var(--table-border-color)', borderRight: '1px solid var(--table-border-color)'}}>
        <table className='dataTable' {...getTableProps()}>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, index) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} key={index}>
                  {row.cells.map((cell, index) => (
                    <td style={{borderLeft: 0, borderRight: 0, padding: '7px'}} key={index}>
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}