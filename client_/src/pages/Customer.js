import React, {useContext, useEffect, useState} from 'react';
import OrderListCustomer from '../components/customerPageComponents/OrderListCustomer'
import {Box, Fab, Tooltip} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import {ORDER_ROUTE} from "../utils/consts";
import {Link, useNavigate, useParams} from "react-router-dom";
import {fetchCustomerOrders,} from "../http/orderAPI";
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import Pages from "../components/Pages";

const Customer = observer(() => {
    const navigate = useNavigate()

    let {orders} = useContext(Context)
    const {id} = useParams()
    const getOrders = () => {
        fetchCustomerOrders(id, orders.page, 8).then(res => {
            if (res.status === 204) {
                orders.setIsEmpty(true)
                return
            }
            res.data.rows.map(item => {
                item.date = new Date(item.date).toLocaleDateString("uk-UA")
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
                    <OrderListCustomer/>
                </Box>
                <Link to={ORDER_ROUTE}
                      style={{textDecoration: 'none', color: 'white'}}>
                    <Tooltip title="Добавить заказ" placement="top" arrow>
                        <Fab onClick={() => navigate(ORDER_ROUTE)}
                             color="warning"
                             aria-label="add"
                             sx={{position: 'absolute', bottom: 50, right: 50,}}>
                            <AddIcon/>
                        </Fab>
                    </Tooltip>
                </Link>
            </Box>
            <Box style={{display: "flex", justifyContent: "center"}}>
                <Pages context={orders}/>
            </Box>
        </Box>

    );
});

export default Customer;