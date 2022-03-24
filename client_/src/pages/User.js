import React, {useContext, useEffect, useState} from 'react';
import OrderList from '../components/userPageComponents/OrderList'
import Box from "@mui/material/Box";
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import {Tooltip} from "@mui/material";
import {ORDER_ROUTE} from "../utils/consts";
import {useNavigate, useParams} from "react-router-dom";
import {fetchAlLOrders, fetchUserOrders} from "../http/orderAPI";
import MyAlert from "../components/adminPageComponents/MyAlert";
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import Pages from "../components/Pages";

const User = observer(() => {
    const navigate = useNavigate()
    const [open, setOpen] = useState(false)
    const [isError, setIsError] = useState(false)
    const [message, setMessage] = useState("")
    let {orders} = useContext(Context)
    const {id} = useParams()
    useEffect(() => {
        fetchUserOrders(id, orders.page, 10).then(res => {
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
    }, [orders.page])

    function formatDate(date) {
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

    }


    return (
        <Box sx={{height: window.innerHeight, pt: 5}}>
            <h2>Список заказов</h2>
            <Box sx={{height: 650}}>
                <OrderList/>
            </Box>
            <Tooltip title="Добавить заказ" placement="top" arrow>
                <Fab onClick={() => navigate(ORDER_ROUTE)}
                     color="primary"
                     aria-label="add"
                     sx={{position: 'fixed', bottom: 80, right: 400,}}>
                    <AddIcon/>
                </Fab>
            </Tooltip>
            <Box sx={{position: "relative", left: "40%"}}>
                <Pages context={orders}/>
            </Box>
        </Box>


    );
});

export default User;