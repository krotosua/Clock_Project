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

import {fetchAlLOrders} from "../../http/orderAPI";


const OrderList = observer(() => {
    let {orders} = useContext(Context)

    useEffect(() => {
        fetchAlLOrders().then(data => {
            data.map(item => {
                let date = new Date(Date.parse(item.date))
                item.date = `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()} ${date.getHours()}:00:00`
            })
            orders.setOrders(data)
        })
    }, [])

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
                {orders.orders.map((order, index) => {
                    return (<ListItem
                        key={order.id}
                        divider
                        secondaryAction={
                            <IconButton sx={{width: 5}}
                                        edge="end"
                                        aria-label="delete"
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
                                      primary={(order.date)}
                        /> <ListItemText sx={{width: 10}}
                                         primary={order.sizeClock}
                    /><ListItemText sx={{width: 10}}
                                    primary={order.masterId}
                    />
                        <ListItemText sx={{width: 10}}
                                      primary={order.cityId}
                        />

                    </ListItem>)
                })}
                <Divider/>
            </List>

        </Box>
    );
})
export default OrderList;
