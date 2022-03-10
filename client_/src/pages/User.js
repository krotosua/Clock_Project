import React, {useContext, useEffect, useState} from 'react';
import OrderList from '../components/userPageComponents/OrderList'
import Box from "@mui/material/Box";
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import {Tooltip} from "@mui/material";
import {ORDER_ROUTE} from "../utils/consts";
import {useNavigate, useParams} from "react-router-dom";
import {fetchUserOrders} from "../http/orderAPI";
import MyAlert from "../components/adminPageComponents/MyAlert";
import {Context} from "../index";
import {observer} from "mobx-react-lite";

const User = observer(() => {
    const navigate = useNavigate()
    const [open, setOpen] = useState(false)
    const [isError, setIsError] = useState(false)
    const [message, setMessage] = useState("")
    let {orders} = useContext(Context)

    const {id} = useParams()
    useEffect(() => {
        fetchUserOrders(id).then(res => {
            if (res.status === 204) {
                orders.setIsEmpty(true)
                return
            }
            res.data.rows.map(item => {
                let date = new Date(item.date)
                item.date = formatDate(date)
            })

            orders.setOrders(res.data.rows)
        })
    }, [])

    function formatDate(date) {
        let orderDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
        return orderDate
    }

    const alertMessage = (message, bool) => {
        setOpen(true)
        setMessage(message)
        setIsError(bool)
    }
    return (
        <Box sx={{height: window.innerHeight, position: 'relative', pt: 5}}>
            <h2>Список заказов</h2>
            <OrderList alertMessage={alertMessage}/>
            <Tooltip title="Добавить заказ" placement="top" arrow>
                <Fab onClick={() => navigate(ORDER_ROUTE)}
                     color="primary"
                     aria-label="add"
                     sx={{position: 'fixed', bottom: 80, right: 400,}}>
                    <AddIcon/>
                </Fab>
            </Tooltip>
            <MyAlert open={open}
                     onClose={() => setOpen(false)}
                     message={message}
                     isError={isError}/>
        </Box>


    );
});

export default User;