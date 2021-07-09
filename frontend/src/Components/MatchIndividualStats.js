import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import withFixedColumns from 'react-table-hoc-fixed-columns';
import 'react-table-hoc-fixed-columns/lib/styles.css';
import { matchIndivStatsColumns } from '../Columns';
import { useHistory } from 'react-router-dom';

const ReactTableFixedColumns = withFixedColumns(ReactTable);

export default function MatchIndividualStats(props) {
	const history = useHistory();
  return (
    <div>
      <h3>ESTADÍSTICAS INDIVIDUALES - {props.data.teamname.toString().toUpperCase()}</h3>
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
          getTdProps={(state, rowInfo, column, instance) => ({
            onClick: e => {
              if (column.Header === 'Jugador') {
                history.push('/jugador/' + rowInfo.original.info.steam_id);
              }
            },
            style: {
              cursor: column.Header === 'Jugador' ? 'pointer' : 'initial'
            }
          })}
        />
      </div>
    </div>
  );
}
