import React, {useEffect, useState} from 'react';
import OrderListMaster from '../components/masterPageComponents/OrderListMaster'
import {Box, CircularProgress} from "@mui/material";
import {useParams} from "react-router-dom";
import {observer} from "mobx-react-lite";
import TablsPagination from "../components/TablsPagination";
import MyAlert from "../components/adminPageComponents/MyAlert";
import {useDispatch, useSelector} from "react-redux";
import {fetchMasterOrders} from "../http/orderAPI";

const Master = observer(() => {
    const orders = useSelector(state => state.orders)
    const dispatch = useDispatch()
    const {id} = useParams()
    const [activated, setActivated] = useState(false)
    const [open, setOpen] = useState(false)
    const [isError, setIsError] = useState(false)
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(true)
    const [ordersList, setOrdersList] = useState([])
    const [page, setPage] = useState(1)
    const [totalCount, setTotalCount] = useState(0)
    const [limit, setLimit] = useState(8)
    const alertMessage = (message, bool) => {
        setOpen(true)
        setMessage(message)
        setIsError(bool)
    }
    const getMasterOrders = async () => {
        try {
            const res = await fetchMasterOrders(id, page, limit)
            setActivated(true)
            if (res.status === 204) {
                setOrdersList([])
                return
            }
            setOrdersList(res.data.rows)
            setTotalCount(res.data.count)
        } catch (e) {
            setOrdersList([])
        } finally {
            setLoading(false)
        }
    }
    useEffect(async () => {
        await getMasterOrders(id, page, limit)
    }, [page])
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
                        <OrderListMaster ordersList={ordersList}
                                         alertMessage={alertMessage}/>

                    </Box>
                    <Box style={{display: "flex", justifyContent: "center"}}>
                        <TablsPagination page={page} totalCount={totalCount} limit={limit}
                                         pagesFunction={(page) => setPage(page)}/>
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