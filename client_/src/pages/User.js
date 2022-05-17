import React, {useContext, useEffect, useState} from 'react';
import OrderList from '../components/userPageComponents/OrderList'
import Box from "@mui/material/Box";
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import {Tooltip} from "@mui/material";
import {ORDER_ROUTE} from "../utils/consts";
import {useNavigate, useParams} from "react-router-dom";
import {fetchUserOrders} from "../http/orderAPI";
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import Pages from "../components/Pages";

const User = observer(() => {
    const navigate = useNavigate()

    let {orders} = useContext(Context)
    const {id} = useParams()
    const getOrders = () => {
        fetchUserOrders(id, orders.page, 8).then(res => {
            if (res.status === 204) {
                orders.setIsEmpty(true)
                return
            }
            res.data.rows.map(item => {
                item.date = new Date(item.date).toLocaleDateString()
            })

            orders.setIsEmpty(false)
            orders.setOrders(res.data.rows)
            orders.setTotalCount(res.data.count)
        }, error => orders.setIsEmpty(true))
    }
    useEffect(() => {
        getOrders()
    }, [orders.page])


    return (
        <Box>
            <Box sx={{height: "800px", pt: 5, position: "relative"}}>
                <h2>Список заказов</h2>
                <Box sx={{height: "650px"}}>
                    <OrderList/>
                </Box>
                <Tooltip title="Добавить заказ" placement="top" arrow>
                    <Fab onClick={() => navigate(ORDER_ROUTE)}
                         color="primary"
                         aria-label="add"
                         sx={{position: 'absolute', bottom: 50, right: 50,}}>
                        <AddIcon/>
                    </Fab>
                </Tooltip>

            </Box>
            <Box style={{display: "flex", justifyContent: "center"}}>
                <Pages context={orders}/>
            </Box>
        </Box>

    );
});

export default User;