import * as React from 'react';
import {Box, List, ListItem, ListItemText, Typography, Divider, Button, Tooltip, Rating} from '@mui/material';
import {useContext, useState} from "react";
import {Context} from "../../index";
import {observer} from "mobx-react-lite";
import MasterRating from "./MasterRating";

const OrderListCustomer = observer(() => {
    let {orders, cities} = useContext(Context)
    const [open, setOpen] = useState(false)
    const [dataForEdit, setDataForEdit] = useState({})

    function createData(order) {
        let data = {
            orderId: order.id,
            masterId: order.masterId,
            userId: order.userId,
        }
        setDataForEdit(data)
        setOpen((true))
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
                                  primary="Оценка"
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
                        <Divider orientation="vertical" variant="middle" flexItem/>
                        <ListItemText sx={{width: 10}}
                                      primary={order.name}
                        />
                        <ListItemText sx={{width: 10}}
                                      primary={`${order.date} ${time}`}
                        />
                        <ListItemText sx={{width: 10}}
                                      primary={`${order.date} ${endTime}`}
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

                                      primary={order.rating !== null ? <Box>
                                              <Rating
                                                  readOnly
                                                  precision={0.5}
                                                  value={order.rating.rating}
                                              /></Box>
                                          : <Tooltip title={!order.finished ?
                                              'Станет доступна после выполнения заказа'
                                              : "Оценить работу мастера"}
                                                     placement="right"
                                                     arrow>
                                              <span>
                                              <Button color="success"
                                                      size="small"
                                                      variant="outlined"
                                                      disabled={!order.finished}
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
                                  dataForEdit={dataForEdit}
                                  onClose={() => setOpen(false)}
            /> : null}
        </Box>
    )
        ;
})
export default OrderListCustomer;