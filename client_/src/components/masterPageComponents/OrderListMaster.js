import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import {statusChangeOrder} from "../../http/orderAPI";
import {STATUS_LIST} from "../../store/OrderStore";
import {useSelector} from "react-redux";


const OrderListMaster = ({alertMessage, ordersList}) => {
    const cities = useSelector(state => state.cities)
    const changeStatus = async (order, status) => {
        const changeInfo = {
            id: order.id,
            status: status
        }
        try {
            await statusChangeOrder(changeInfo)
            order.status = status
            alertMessage('Статус заказа успешно изменен', false)
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
                {ordersList === 0 ? <h1>Список пуст</h1> : ordersList.map((order, index) => {
                    const time = new Date(order.time).toLocaleString("uk-UA")
                    const endTime = new Date(order.endTime).toLocaleString("uk-UA")
                    return (<ListItem
                        key={order.id}
                        divider
                    >
                        <ListItemText sx={{width: 10}}
                                      primary={order.id}
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
                                          <Button color={order.status === STATUS_LIST.DONE ? "success" : "error"}
                                                  disabled={order.status !== STATUS_LIST.ACCEPTED && order.status !== STATUS_LIST.DONE}
                                                  size="small"
                                                  variant="outlined"
                                                  onClick={() => order.status === "ACCEPTED" ? changeStatus(order, "DONE") : changeStatus(order, "ACCEPTED")}>
                                              {order.status === STATUS_LIST.DONE ? "Выполнен"
                                                  : order.status === STATUS_LIST.ACCEPTED ? "Подтвержден"
                                                      : order.status === STATUS_LIST.REJECTED ? "Отказ" : "Ожиднаие"}
                                          </Button>
                                      }
                        />
                    </ListItem>)
                })}
                <Divider/>
            </List>

        </Box>
    );
}
export default OrderListMaster;
