import * as React from 'react';
import {DataGrid} from '@mui/x-data-grid';

const columns = [
    {
        field: 'firstName',
        headerName: 'Имя Мастера',
        width: 150

    },
    {
        field: 'lastName',
        headerName: 'Рейтинг мастера',
        width: 150,

    },
    {
        field: 'age',
        headerName: 'Статус',
        type: 'number',
        width: 110,

    },
];

const rows = [
    {id: 1, lastName: 'Snow', firstName: 'Jon', age: 'свободен'},
    {id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42},
    {id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45},
    {id: 4, lastName: 'Stark', firstName: 'Arya', age: 16},
    {id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null},
    {id: 6, lastName: 'Melisandre', firstName: null, age: 150},
    {id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44},
    {id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36},
    {id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65},
];

export default function PageTwoStepp() {
    return (
        <div style={{width: '100%'}}>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                autoHeight
                checkboxSelection
                disableMultipleSelection
                disableMultipleColumnsSorting
                disableSelectionOnClick
                disableColumnMenu
                hideFooterSelectedRowCount

            />
        </div>
    );
}
