import React from 'react';
import OrderList from '../components/userPageComponents/OrderList'
import Box from "@mui/material/Box";
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import {Tooltip} from "@mui/material";
import {ORDER_ROUTE} from "../utils/consts";
import {useNavigate} from "react-router-dom";

const User = () => {
    const navigate = useNavigate()
    return (
        <Box sx={{height: window.innerHeight, position: 'relative', pt: 5}}>
            <h2>Список заказов</h2>
            <OrderList/>
            <Tooltip title="Добавить заказ" placement="top" arrow>
                <Fab color="primary" aria-label="add" sx={{position: 'fixed', bottom: 80, right: 400,}}>
                    <AddIcon onClick={() => navigate(ORDER_ROUTE)}/>
                </Fab>
            </Tooltip>

        </Box>

    );
};

export default User;