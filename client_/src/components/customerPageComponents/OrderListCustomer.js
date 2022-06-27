import * as React from 'react';
import {useState} from 'react';
import {Box, Button, Divider, List, ListItem, ListItemText, Rating, Tooltip} from '@mui/material';
import MasterRating from "./MasterRating";
import {STATUS_LIST} from "../../store/OrderStore";
import {useSelector} from "react-redux";

const OrderListCustomer = ({getOrders, alertMessage}) => {
    const cities = useSelector(state => state.city)
    const orders = useSelector(state => state.orders)
    const [open, setOpen] = useState(false)
    const [dataForEdit, setDataForEdit] = useState({})

    function createData(order) {
        let data = {
            orderId: order.id,
            masterId: order.masterId,
            userId: order.userId,
        }
        setDataForEdit(data)
        setOpen(true)
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
                                  primary="Имя"
                    />

                    <ListItemText sx={{width: 10}}
                                  primary="Начало заказа"
                    />
                    <ListItemText sx={{width: 10}}
                                  primary="Конец заказа"
                    />
                    <ListItemText sx={{width: 10}}
                                  primary="Тип услуги"/>

                    <ListItemText sx={{width: 10}}
                                  primary="Мастер"
                    />
                    <ListItemText sx={{width: 10}}
                                  primary="Город"
                    />
                    <ListItemText sx={{width: 10}}
                                  primary="Цена"
                    />
                    <ListItemText sx={{width: 10}}
                                  primary="Статус"
                    />
                    <ListItemText sx={{width: 10}}
                                  primary="Оценка"
                    />


                </ListItem>
                <Divider orientation="vertical"/>
                {orders.isEmpty ? <h1>Список пуст</h1> : orders.orders.map((order, index) => {
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
                                      primary={time}
                        />
                        <ListItemText sx={{width: 10}}
                                      primary={endTime}
                        />

                        <ListItemText sx={{width: 10}}
                                      primary={order.sizeClock.name}
                        /><ListItemText sx={{width: 10}}
                                        primary={order.master.name}
                    />
                        <ListItemText sx={{width: 10}}
                                      primary={cities.cities.find(city => city.id === order.cityId).name}
                        />
                        <ListItemText sx={{width: 10}}
                                      primary={order.price}
                        />
                        <ListItemText sx={{width: 10}}
                                      primary={order.status === STATUS_LIST.DONE ? "Выполнен" :
                                          order.status === STATUS_LIST.ACCEPTED ? "Подтвержден" :
                                              order.status === STATUS_LIST.REJECTED ? "Отказ" : "Ожидание"}
                        />
                        <ListItemText sx={{width: 10}}

                                      primary={order.rating !== null ? <Box>
                                              <Rating
                                                  readOnly
                                                  precision={0.5}
                                                  value={order.rating.rating}
                                              /></Box>
                                          : <Tooltip title={order.status !== "DONE" ?
                                              'Станет доступна после выполнения заказа'
                                              : "Оценить работу мастера"}
                                                     placement="right"
                                                     arrow>
                                              <span>
                                              <Button color="success"
                                                      size="small"
                                                      variant="outlined"
                                                      disabled={order.status !== STATUS_LIST.DONE}
                                                      onClick={() => {
                                                          createData(order)
                                                      }}>
                                                  Оценить
                                              </Button>
                                                  </span>
                                          </Tooltip>}
                        />
                    </ListItem>)
                })}
                <Divider/>

            </List>

            {open ? <MasterRating open={open}
                                  alertMessage={alertMessage}
                                  dataForEdit={dataForEdit}
                                  getOrders={getOrders}
                                  onClose={() => setOpen(false)}
            /> : null}
        </Box>
    )
        ;
}
export default OrderListCustomer;
