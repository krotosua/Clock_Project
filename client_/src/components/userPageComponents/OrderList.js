import * as React from 'react';
import {Box,List,ListItem,ListItemText,Typography,Divider} from '@mui/material';
import {useContext} from "react";
import {Context} from "../../index";
import {observer} from "mobx-react-lite";


const OrderList = observer(() => {
    let {orders, cities} = useContext(Context)
    return (
        <Box sx={{flexGrow: 1, maxWidth: "1fr"}}>
            <Typography sx={{mt: 4, mb: 2}} variant="h6" component="div">
                Заказы
            </Typography>

            <List disablePadding>
                <ListItem
                    key={1}
                    divider

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
                    const time = new Date(order.time).toLocaleTimeString("uk-UA").slice(0, 5)
                    const endTime = new Date(order.endTime).toLocaleTimeString("uk-UA").slice(0, 5)
                    return (<ListItem
                        key={order.id}
                        divider
                    >
                        <ListItemText sx={{width: 10}}
                                      primary={index + 1}
                        />
                        <ListItemText sx={{width: 10}}
                                      primary={order.name}
                        />
                        <ListItemText sx={{width: 10}}
                                      primary={`${order.date} ${time}`}
                        />

                        <ListItemText sx={{width: 10}}
                                      primary={order.sizeClock.name}
                        /><ListItemText sx={{width: 10}}
                                        primary={order.master.name}
                    />
                        <ListItemText sx={{width: 10}}
                                      primary={cities.cities.find(city => city.id === order.cityId).name}
                        />

                    </ListItem>)
                })}
                <Divider/>
            </List>

        </Box>
    );
})
export default OrderList;
