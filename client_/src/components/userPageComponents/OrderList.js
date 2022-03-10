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
import {deleteOrder, fetchAlLOrders, fetchUserOrders} from "../../http/orderAPI";
import {Tooltip} from "@mui/material";


const OrderList = observer(({alertMessage}) => {
    let {orders} = useContext(Context)

    const delOrder = (id) => {
        deleteOrder(id).then((res) => {
            orders.setOrders(orders.orders.filter(obj => obj.id !== id));
            alertMessage('Успешно удаленно', false)
            if (orders.orders.length === 0) {
                orders.setIsEmpty(true)
            } else {
                orders.setIsEmpty(false)
            }
        }, (err) => {
            alertMessage('Не удалось удалить', true)
        })

    }


    return (
        <Box sx={{flexGrow: 1, maxWidth: "1fr"}}>
            <Typography sx={{mt: 4, mb: 2}} variant="h6" component="div">
                Заказы
            </Typography>

            <List disablePadding>
                <ListItem
                    key={1}
                    divider
                    secondaryAction={
                        <IconButton sx={{width: 5}}
                                    edge="end"
                                    aria-label="delete"
                        >
                            <AddIcon/>
                        </IconButton>
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
                {orders.IsEmpty ? <h1>Список пуст</h1> : orders.orders.map((order, index) => {

                    return (<ListItem
                        key={order.id}
                        divider
                        secondaryAction={
                            <Tooltip title={'Удалить заказ'}
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
                                      primary={(order.date)}
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
    );
})
export default OrderList;
