import React from 'react';
import ReactTable from 'react-table';
import { useHistory } from 'react-router-dom';
import 'react-table/react-table.css';
import withFixedColumns from 'react-table-hoc-fixed-columns';
import 'react-table-hoc-fixed-columns/lib/styles.css';
import { resultColumns } from '../Columns';

const ReactTableFixedColumns = withFixedColumns(ReactTable);

export default function PlayerMatches(props) {
    const TheadComponent = props => null;
    const history = useHistory();

    return(
        <div style={{width: '100%'}}>
            <h3 style={{marginTop: 0}}>ÚLTIMOS RESULTADOS</h3>
            <ReactTableFixedColumns
                className='-striped -highlight'
                data={props.data}
                TheadComponent={TheadComponent}
                columns={resultColumns} 
                resizable={false}
                showPagination={false}
                showPageSizeOptions={false}
                defaultPageSize={5}
                getTrProps={(state, rowInfo, column, instance) => ({
                    onClick: e => {
                        history.push('/partido/' + rowInfo.original._id);
                    },
                    style: {
                        cursor: 'pointer'
                    }
                })}
            />
        </div>
    )
}