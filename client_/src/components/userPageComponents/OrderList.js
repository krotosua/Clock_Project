import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {useContext} from "react";
import {Context} from "../../index";
import Orders from "../../store/OrderStore"
const columns = [
    {
        field: 'name',
        headerName: 'Имя заказчика',
        width: 200

    },
    {
        field: 'date',
        headerName: 'Время',
        width: 200

    },
    {
        field: 'sizeClock',
        headerName: 'Размер часов',
        width: 200,

    },
    {
        field: 'master',
        headerName: 'Имя мастера',
        type: 'number',
        width: 200,

    },
    {
        field: 'city',
        headerName: 'Город',
        type: 'strings',
        width: 200,

    },
];

const rows = [
    // { id: 1, name: 'Леха', date: '23.01.2015 22:00:00', sizeClock: '1', master:'Игорь',city:'Днепр'},
    // { id: 2, name: 'Валя', date: '21.05.2015 22:00:00', sizeClock: '2', master:'Алина',city:'Днепр'},
    // { id: 3, name: 'Кириха', date: '28.02.2015 22:00:00', sizeClock: '3', master:'Вертолет',city:'Днепр'},

];

export default function PageTwoStepp() {

    return (
        <div style={{ width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={15}
                autoHeight
                disableMultipleSelection
                disableMultipleColumnsSorting
                disableSelectionOnClick
                disableColumnMenu
                hideFooterSelectedRowCount
            />
        </div>
    );
}
