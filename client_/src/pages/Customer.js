import React, {useContext, useEffect, useState} from 'react';
import OrderListCustomer from '../components/customerPageComponents/OrderListCustomer'
import {Box, CircularProgress, Fab, Tooltip} from "@mui/material";
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
    const [loading, setLoading] = useState(true)
    const getOrders = async () => {
        try {
            const res = await fetchCustomerOrders(id, orders.page, 8)
            if (res.status === 204) {
                orders.setIsEmpty(true)
                return
            }
            orders.setIsEmpty(false)
            orders.setOrders(res.data.rows)
            orders.setTotalCount(res.data.count)
        } catch (e) {
            orders.setIsEmpty(true)
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
            <Box sx={{height: "750px", pt: 5, position: "relative"}}>
                <h2>Список заказов</h2>
                <Box sx={{height: "650px"}}>
                    <OrderListCustomer
                        getOrders={() => getOrders()}/>
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