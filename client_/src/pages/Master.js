import React, {useEffect, useState} from 'react';
import OrderListMaster from '../components/masterPageComponents/OrderListMaster'
import {Box, CircularProgress} from "@mui/material";
import {useParams} from "react-router-dom";
import {observer} from "mobx-react-lite";
import Pages from "../components/Pages";
import MyAlert from "../components/adminPageComponents/MyAlert";
import {useDispatch, useSelector} from "react-redux";
import {setPageOrderAction} from "../store/OrderStore";
import {getMasterOrders} from "../asyncActions/orders";

const Master = observer(() => {
    const orders = useSelector(state => state.orders)
    const dispatch = useDispatch()
    const {id} = useParams()
    const [activated, setActivated] = useState(false)
    const [open, setOpen] = useState(false)
    const [isError, setIsError] = useState(false)
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(true)
    const alertMessage = (message, bool) => {
        setOpen(true)
        setMessage(message)
        setIsError(bool)
    }
    const getOrders = async () => {
        try {
            getMasterOrders(id, orders.page)
            setActivated(true)
        } catch (e) {
            setActivated(false)
        } finally {
            setLoading(false)
        }
    }
    useEffect(async () => {
        await getOrders()
    }, [orders.page])

    if (loading) {
        return (
            <Box sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: window.innerHeight - 60,
            }}>
                <CircularProgress/>
            </Box>
        )
    }
    return (
        <Box>
            {activated ?
                <Box sx={{height: "750px", pt: 5, position: "relative"}}>
                    <h2>Список заказов</h2>
                    <Box sx={{height: "650px"}}>
                        <OrderListMaster alertMessage={alertMessage}/>

                    </Box>
                    <Box style={{display: "flex", justifyContent: "center"}}>
                        <Pages store={orders} pagesFunction={setPageOrderAction}/>
                    </Box>
                </Box>
                :
                <Box sx={{height: "800px", pt: 5, position: "relative"}}>

                    <Box style={{display: "flex", justifyContent: "center"}}>
                        <h3>Требуется активация от администратора</h3>
                    </Box>
                </Box>
            }
            <MyAlert open={open}
                     onClose={() => setOpen(false)}
                     message={message}
                     isError={isError}/>

        </Box>

    );
});

export default Master;