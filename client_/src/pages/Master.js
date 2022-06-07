import React, {useContext, useEffect, useState} from 'react';
import OrderList from '../components/masterPageComponents/OrderList'
import Box from "@mui/material/Box";
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import {Tooltip} from "@mui/material";
import {ORDER_ROUTE} from "../utils/consts";
import {useNavigate, useParams} from "react-router-dom";
import {fetchMasterOrders} from "../http/orderAPI";
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import Pages from "../components/Pages";
import MyAlert from "../components/adminPageComponents/MyAlert";

const Master = observer(() => {
    const navigate = useNavigate()
    let {orders} = useContext(Context)
    const {id} = useParams()
    const [activated,setActivated]=useState(false)
    const [open, setOpen] = useState(false)
    const [isError, setIsError] = useState(false)
    const [message, setMessage] = useState("")
    const alertMessage = (message, bool) => {
        setOpen(true)
        setMessage(message)
        setIsError(bool)
    }
    const getOrders = () => {
        fetchMasterOrders(id, orders.page, 8).then(res => {
            setActivated(true)
            if (res.status === 204) {
                orders.setIsEmpty(true)
                return
            }
            console.log(res.data.rows)
            res.data.rows.map(item => {
                item.date = new Date(item.date).toLocaleDateString("uk-UA")
            })

            orders.setIsEmpty(false)
            orders.setOrders(res.data.rows)
            orders.setTotalCount(res.data.count)
        }).catch(error =>setActivated(false) )
    }
    useEffect(() => {
        getOrders()
    }, [orders.page])


    return (
        <Box>
            {activated?
                <Box sx={{height: "800px", pt: 5, position: "relative"}}>

                    <h2>Список заказов</h2>
                    <Box sx={{height: "650px"}}>
                        <OrderList alertMessage={alertMessage}/>

                    </Box>
                    <Box style={{display: "flex", justifyContent: "center"}}>
                        <Pages context={orders}/>
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