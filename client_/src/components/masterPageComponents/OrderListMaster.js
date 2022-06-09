import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import {useContext} from "react";
import {Context} from "../../index";
import Divider from "@mui/material/Divider";
import {observer} from "mobx-react-lite";
import Button from "@mui/material/Button";
import {activateMaster} from "../../http/masterAPI";
import {finishedOrder} from "../../http/orderAPI";


const OrderListMaster = observer(({alertMessage}) => {
    let {orders, cities} = useContext(Context)

    function changeFinished(order) {
        let changeInfo = {
            id: order.id,
            finished: !order.finished
        }

        finishedOrder(changeInfo)
            .then(res => {
                alertMessage('Статус заказа успешно изменен', false)
                return order.finished = !order.finished
            }, err => {
                alertMessage('Не удалось изменить статус заказа', true)
            })
    }


    return (
        <Box sx={{flexGrow: 1, maxWidth: "1fr"}}>
            <List disablePadding>
                <ListItem
                    key={1}
                    divider

                >
                    <ListItemText sx={{width: 10}}
                                  primary="№"
                    />
                    <ListItemText sx={{width: 10}}
                                  primary="Имя клиента"
                    />

                    <ListItemText sx={{width: 10}}
                                  primary="Город"

                    />
                    <ListItemText sx={{width: 10}}
                                  primary="Дата/время начало"
                    />
                    <ListItemText sx={{width: 10}}
                                  primary="Дата/время конец"
                    />
                    <ListItemText sx={{width: 10}}
                                  primary="Тип услуги"/>

                    <ListItemText sx={{width: 10}}
                                  primary="Статус"
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
                                      primary={cities.cities.find(city => city.id === order.cityId).name}
                        />
                        <ListItemText sx={{width: 10}}
                                      primary={`${order.date} ${time}`}
                        />
                        <ListItemText sx={{width: 10}}
                                      primary={`${order.date} ${endTime}`}
                        />

                        <ListItemText sx={{width: 10}}
                                      primary={order.sizeClock.name}
                        />
                        <ListItemText sx={{width: 10}}
                                      primary={
                                          <Button color={order.finished ? "success" : "error"}
                                                  size="small"
                                                  variant="outlined"
                                                  onClick={() => changeFinished(order)}>
                                              {order.finished ? "Закончен" : "Не закончен"}
                                          </Button>
                                      }
                    />

                    </ListItem>)
                })}
                <Divider/>
            </List>

        </Box>
    );
})
export default OrderListMaster;
