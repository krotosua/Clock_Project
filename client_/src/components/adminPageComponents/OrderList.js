import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import {useContext, useEffect, useState} from "react";
import {Context} from "../../index";
import Divider from "@mui/material/Divider";
import {observer} from "mobx-react-lite";
import {deleteOrder, fetchAlLOrders} from "../../http/orderAPI";
import Pages from "../Pages";
import {ORDER_ROUTE} from "../../utils/consts";
import {Link, useNavigate} from "react-router-dom";
import {Tooltip} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import EditOrder from "./modals/EditOrder";


const OrderList = observer(({alertMessage}) => {
    let {orders, cities} = useContext(Context)
    const [editVisible, setEditVisible] = useState(false)
    const [idToEdit, setIdToEdit] = useState(null);
    const [dateToEdit, setDateToEdit] = useState(new Date());
    const [timeToEdit, setTimeToEdit] = useState(new Date(0, 0, 0, new Date().getHours() + 1));
    const [orderToEdit, setOrderToEdit] = useState(null)
    const navigate = useNavigate()
    const getOrders = () => {
        fetchAlLOrders(orders.page, 8).then(res => {
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


    const delOrder = (id) => {
        deleteOrder(id).then((res) => {
            orders.setOrders(orders.orders.filter(obj => obj.id !== id));
            alertMessage('?????????????? ????????????????', false)
            orders.setIsEmpty(false)
            getOrders()
        }, (err) => {
            alertMessage('???? ?????????????? ??????????????', true)
            orders.setIsEmpty(false)
        })

    }

    function editOrder(order, time) {
        setOrderToEdit(order)
        setIdToEdit(order.id)
        let pattern = /(\d{2})\.(\d{2})\.(\d{4})/;
        let date = new Date(order.date.replace(pattern, '$3-$2-$1'));
        setDateToEdit(date)
        setTimeToEdit(new Date(new Date(0, 0, 0).setHours(time.slice(0, 2), 0, 0)))
        setEditVisible(true)
    }


    return (
        <Box>
            <Box sx={{flexGrow: 1, maxWidth: "1fr", minHeight: "700px"}}>
                <Typography sx={{mt: 4, mb: 2}}
                            variant="h6"
                            component="div">
                    ????????????
                </Typography>

                <List disablePadding>
                    <ListItem
                        key={1}
                        divider
                        secondaryAction={
                            <Link to={ORDER_ROUTE}
                                  style={{textDecoration: 'none', color: 'white'}}>
                                <Tooltip title={'???????????????? ??????????'}
                                         placement="top"
                                         arrow>
                                    <IconButton sx={{width: 5}}
                                                edge="end"
                                                aria-label="add"
                                                onClick={() => navigate(ORDER_ROUTE)}
                                    >
                                        <AddIcon/>
                                    </IconButton>
                                </Tooltip>
                            </Link>
                        }
                    >
                        <ListItemText sx={{width: 10}}
                                      primary="???"
                        />
                        <ListItemText sx={{width: 10}}
                                      primary="??????"
                        />

                        <ListItemText sx={{width: 10}}
                                      primary="???????? ?? ??????????"
                        />
                        <ListItemText sx={{width: 10}}
                                      primary="???????????? ??????????"/>

                        <ListItemText sx={{width: 10}}
                                      primary="????????????"
                        />
                        <ListItemText sx={{width: 10}}
                                      primary="??????????"

                        />


                    </ListItem>
                    <Divider orientation="vertical"/>
                    {orders.IsEmpty ? <h1>???????????? ????????</h1> :
                        orders.orders.map((order, index) => {
                            const time = new Date(order.time).toLocaleTimeString("uk-UA").slice(0, 5)
                            return (<ListItem
                                key={order.id}
                                divider
                                secondaryAction={
                                    <Tooltip title={'?????????????? ??????????'}
                                             placement="right"
                                             arrow>
                                        <IconButton sx={{width: 5}}
                                                    edge="end"
                                                    aria-label="delete"
                                                    onClick={() => delOrder(order.id)}
                                        >
                                            <DeleteIcon/>
                                        </IconButton>
                                    </Tooltip>
                                }
                            >
                                <ListItemText sx={{width: 10}}
                                              primary={index + 1}
                                />
                                <ListItemText sx={{width: 10}}
                                              primary={order.name}
                                />
                                <ListItemText sx={{width: 10}}
                                              primary={`${order.date} ${time}`}
                                /> <ListItemText sx={{width: 10}}
                                                 primary={order.sizeClock.name}/>
                                <ListItemText sx={{width: 10}}
                                              primary={order.master.name}/>
                                <ListItemText sx={{width: 10}}
                                              primary={cities.cities.find(city => city.id === order.cityId).name}
                                />{new Date().toLocaleDateString("uk-UA") > order.date || new Date().toLocaleDateString("uk-UA") == order.date
                            && new Date().toLocaleTimeString("uk-UA") > time ? null :
                                <Tooltip title={'???????????????? ??????????'}
                                         placement="left"
                                         arrow>
                                    <IconButton sx={{width: 5}}
                                                edge="end"
                                                aria-label="Edit"
                                                onClick={() => editOrder(order, time)}
                                    >
                                        <EditIcon/>
                                    </IconButton>
                                </Tooltip>}

                            </ListItem>)
                        })}
                    <Divider/>
                </List>

                {editVisible ? <EditOrder
                    open={editVisible}
                    onClose={() => {
                        setEditVisible(false)
                    }}
                    orderToEdit={orderToEdit}
                    alertMessage={alertMessage}
                    idToEdit={idToEdit}
                    dateToEdit={dateToEdit}
                    timeToEdit={timeToEdit}
                /> : null}

            </Box>
            <Box sx={{display: "flex", justifyContent: "center"}}>
                <Pages context={orders}/>
            </Box>
        </Box>
    );
})
export default OrderList;
