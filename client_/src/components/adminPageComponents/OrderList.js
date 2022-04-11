import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import {useContext, useEffect} from "react";
import {Context} from "../../index";
import Divider from "@mui/material/Divider";
import {observer} from "mobx-react-lite";
import {deleteOrder, fetchAlLOrders} from "../../http/orderAPI";
import Pages from "../Pages";
import {ORDER_ROUTE} from "../../utils/consts";
import {useNavigate} from "react-router-dom";
import {Tooltip} from "@mui/material";


const OrderList = observer(({alertMessage}) => {
    let {orders} = useContext(Context)
    const navigate = useNavigate()
    const getOrders = () => {
        fetchAlLOrders(orders.page, 8).then(res => {
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
    }
    useEffect(() => {
        getOrders()
    }, [orders.page])


    const delOrder = (id) => {
        deleteOrder(id).then((res) => {
            orders.setOrders(orders.orders.filter(obj => obj.id !== id));
            alertMessage('Успешно удаленно', false)
            getOrders()
        }, (err) => {
            alertMessage('Не удалось удалить', true)
        })

    }


    return (
        <Box>
            <Box sx={{flexGrow: 1, maxWidth: "1fr", height: 700}}>
                <Typography sx={{mt: 4, mb: 2}} variant="h6" component="div">
                    Заказы
                </Typography>

                <List disablePadding>
                    <ListItem
                        key={1}
                        divider
                        secondaryAction={
                            <Tooltip title={'Добавить заказ'}
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
                        }
                    >
                        <ListItemText sx={{width: 10}}
                                      primary="№"
                        />
                        <ListItemText sx={{width: 10}}
                                      primary="Имя"
                        />

                        <ListItemText sx={{width: 10}}
                                      primary="Дата и время"
                        />
                        <ListItemText sx={{width: 10}}
                                      primary="Размер часов"/>

                        <ListItemText sx={{width: 10}}
                                      primary="Мастер"
                        />
                        <ListItemText sx={{width: 10}}
                                      primary="Город"

                        />


                    </ListItem>
                    <Divider orientation="vertical"/>
                    {orders.IsEmpty ? <h1>Список пуст</h1> :
                        orders.orders.map((order, index) => {
                            return (<ListItem
                                key={order.id}
                                divider
                                secondaryAction={
                                    <IconButton sx={{width: 5}}
                                                edge="end"
                                                aria-label="delete"
                                                onClick={() => delOrder(order.id)}
                                    >
                                        <DeleteIcon/>
                                    </IconButton>
                                }
                            >
                                <ListItemText sx={{width: 10}}
                                              primary={index + 1}
                                />
                                <ListItemText sx={{width: 10}}
                                              primary={order.name}
                                />
                                <ListItemText sx={{width: 10}}
                                              primary={`${order.date} ${order.time}`}
                                /> <ListItemText sx={{width: 10}}
                                                 primary={order.sizeClock.name}
                            /><ListItemText sx={{width: 10}}
                                            primary={order.master.name}
                            />
                                <ListItemText sx={{width: 10}}
                                              primary={order.master.city.name}
                                />

                            </ListItem>)
                        })}
                    <Divider/>
                </List>

            </Box>
            <Box sx={{position: "relative", left: "35%"}}>
                <Pages context={orders}/>
            </Box>
        </Box>
    );
})
export default OrderList;
