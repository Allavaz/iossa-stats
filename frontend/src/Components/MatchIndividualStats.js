import React from './node_modules/react';
import ReactTable from './node_modules/react-table';
import './node_modules/react-table/react-table.css';
import withFixedColumns from './node_modules/react-table-hoc-fixed-columns';
import './node_modules/react-table-hoc-fixed-columns/lib/styles.css';
import { matchIndivStatsColumns } from '../Columns';

const ReactTableFixedColumns = withFixedColumns(ReactTable);

export default function MatchIndividualStats(props) {
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
				/>
			</div>
        </div>
    );
}
