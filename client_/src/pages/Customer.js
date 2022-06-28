import React, {useEffect, useState} from 'react';
import OrderListCustomer from '../components/customerPageComponents/OrderListCustomer'
import {Box, CircularProgress, Fab, Tooltip} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import {ORDER_ROUTE} from "../utils/consts";
import {Link, useNavigate, useParams} from "react-router-dom";
import TablsPagination from "../components/TablsPagination";
import MyAlert from "../components/adminPageComponents/MyAlert";
import {fetchCustomerOrders} from "../http/orderAPI";

const Customer = () => {
    const navigate = useNavigate()
    const {id} = useParams()
    const [loading, setLoading] = useState(true)
    const [open, setOpen] = useState(false)
    const [isError, setIsError] = useState(false)
    const [message, setMessage] = useState("")
    const [ordersList, setOrdersList] = useState([])
    const [page, setPage] = useState(1)
    const [totalCount, setTotalCount] = useState(0)
    const [limit, setLimit] = useState(8)
    const alertMessage = (message, bool) => {
        setOpen(true)
        setMessage(message)
        setIsError(bool)
    }
    const getCustomerOrders = async () => {
        try {
            const res = await fetchCustomerOrders(id, page, limit)
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
        await getCustomerOrders()
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
            <Box sx={{height: "750px", pt: 5, position: "relative"}}>
                <h2>Список заказов</h2>
                <Box sx={{height: "650px"}}>
                    <OrderListCustomer
                        ordersList={ordersList}
                        alertMessage={alertMessage}
                        getOrders={() => getCustomerOrders(id, page)}/>
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
                <TablsPagination page={page} totalCount={totalCount} limit={limit}
                                 pagesFunction={(page) => setPage(page)}/>
            </Box>
            <MyAlert open={open}
                     onClose={() => setOpen(false)}
                     message={message}
                     isError={isError}/>

        </Box>

    );
};

export default Customer;