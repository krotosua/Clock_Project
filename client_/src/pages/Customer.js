import React, {useEffect, useState} from 'react';
import OrderListCustomer from '../components/customerPageComponents/OrderListCustomer'
import {Box, CircularProgress, Fab, Tooltip} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import {ORDER_ROUTE} from "../utils/consts";
import {Link, useNavigate, useParams} from "react-router-dom";
import Pages from "../components/Pages";
import {setPageOrderAction} from "../store/OrderStore";
import {useDispatch, useSelector} from "react-redux";
import MyAlert from "../components/adminPageComponents/MyAlert";
import {getCustomerOrders} from "../asyncActions/orders";

const Customer = () => {
    const navigate = useNavigate()
    const orders = useSelector(state => state.orders)
    const dispatch = useDispatch()
    const {id} = useParams()
    const [loading, setLoading] = useState(true)
    const [open, setOpen] = useState(false)
    const [isError, setIsError] = useState(false)
    const [message, setMessage] = useState("")
    const alertMessage = (message, bool) => {
        setOpen(true)
        setMessage(message)
        setIsError(bool)
    }
    useEffect(async () => {
        dispatch(getCustomerOrders(id, orders.page))
        setLoading(false)
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
                        alertMessage={alertMessage}
                        getOrders={() => dispatch(getCustomerOrders(id, orders.page))}/>
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
                <Pages store={orders} pagesFunction={setPageOrderAction}/>
            </Box>
            <MyAlert open={open}
                     onClose={() => setOpen(false)}
                     message={message}
                     isError={isError}/>

        </Box>

    );
};

export default Customer;