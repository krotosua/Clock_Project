import * as React from 'react';
import {useContext} from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import {Context} from "../../index";
import Divider from "@mui/material/Divider";
import {observer} from "mobx-react-lite";
import Button from "@mui/material/Button";
import {statusChangeOrder} from "../../http/orderAPI";


const OrderListMaster = observer(({alertMessage}) => {
    let {orders, cities} = useContext(Context)

    const changeStatus = async (order, status) => {
        const changeInfo = {
            id: order.id,
            status: status
        }
        try {
            await statusChangeOrder(changeInfo)
            alertMessage('Статус заказа успешно изменен', false)
            return order.status = status
        } catch (e) {
            alertMessage('Не удалось изменить статус заказа', true)
        }
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
                                  primary="Цена"/>

                    <ListItemText sx={{width: 10}}
                                  primary="Статус"
                    />


                </ListItem>
                <Divider orientation="vertical"/>
                {orders.IsEmpty ? <h1>Список пуст</h1> : orders.orders.map((order, index) => {
                    const time = new Date(order.time).toLocaleString("uk-UA")
                    const endTime = new Date(order.endTime).toLocaleString("uk-UA")
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
                                      primary={time}
                        />
                        <ListItemText sx={{width: 10}}
                                      primary={endTime}
                        />

                        <ListItemText sx={{width: 10}}
                                      primary={order.sizeClock.name}
                        />
                        <ListItemText sx={{width: 10}}
                                      primary={order.price}
                        />
                        <ListItemText sx={{width: 10}}
                                      primary={
                                          <Button color={order.status === "DONE" ? "success" : "error"}
                                                  disabled={order.status !== "ACCEPTED" && order.status !== "DONE"}
                                                  size="small"
                                                  variant="outlined"
                                                  onClick={() => order.status === "ACCEPTED" ? changeStatus(order, "DONE") : changeStatus(order, "ACCEPTED")}>
                                              {order.status === "DONE" ? "Выполнен"
                                                  : order.status === "ACCEPTED" ? "Подтвержден"
                                                      : order.status === "REJECTED" ? "Отказ" : "Ожиднаие"}
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
