import * as React from 'react';
import {useContext, useEffect, useState} from 'react';
import {
    Box,
    Divider,
    FormControl,
    IconButton,
    InputLabel,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Select,
    Tooltip,
    Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import {Context} from "../../index";
import {observer} from "mobx-react-lite";
import Pages from "../Pages";
import {deleteOrder, fetchAlLOrders, statusChangeOrder} from "../../http/orderAPI";
import {ORDER_ROUTE} from "../../utils/consts";
import {Link, useNavigate} from "react-router-dom";
import EditOrder from "./modals/EditOrder";
import {STATUS_LIST} from "../../store/OrderStore";
import {add, isPast, set} from 'date-fns'


const OrderList = observer(({alertMessage}) => {
    let {orders, cities} = useContext(Context)
    const [editVisible, setEditVisible] = useState(false)
    const [idToEdit, setIdToEdit] = useState(null);
    const [timeToEdit, setTimeToEdit] = useState(add(new Date(0, 0, 0,), {hours: 1}));
    const [orderToEdit, setOrderToEdit] = useState(null)

    const handleChange = async (statusOrder, order) => {
        try {
            const changeInfo = {
                id: order.id,
                status: statusOrder
            }
            await statusChangeOrder(changeInfo)
            alertMessage("Статус заказа успешно смененн", false)
            return order.status = statusOrder
        } catch (e) {
            alertMessage("Не удалось сменить статус заказа", true)
        }

    };

    const navigate = useNavigate()
    const getOrders = async () => {
        try {
            const res = await fetchAlLOrders(orders.page, 8)
            if (res.status === 204) {
                orders.setIsEmpty(true)
                return
            }
            orders.setIsEmpty(false)
            orders.setOrders(res.data.rows)
            orders.setTotalCount(res.data.count)
        } catch (e) {
            orders.setIsEmpty(true)
        }
    }

    useEffect(async () => {
        await getOrders()
    }, [orders.page])

    const removeOrder = async (id) => {
        try {
            await deleteOrder(id)
            orders.setOrders(orders.orders.filter(obj => obj.id !== id));
            alertMessage('Успешно удаленно', false)
            orders.setIsEmpty(false)
            await getOrders()
        } catch (e) {
            alertMessage('Не удалось удалить', true)
            orders.setIsEmpty(false)
        }
    }
    const editOrder = (order, time) => {
        const date = new Date()
        setOrderToEdit(order)
        setIdToEdit(order.id)
        setTimeToEdit(set(new Date(0, 0, 0), {hours: time.slice(0, 2)}))
        setEditVisible(true)
    }
    return (<Box>
        <Box sx={{flexGrow: 1, maxWidth: "1fr", minHeight: "700px"}}>
            <Typography sx={{mt: 4, mb: 2}}
                        variant="h6"
                        component="div">
                Заказы
            </Typography>

            <List disablePadding>
                <ListItem
                    key={1}
                    divider
                    secondaryAction={<Link to={ORDER_ROUTE}
                                           style={{textDecoration: 'none', color: 'white'}}>
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
                    </Link>}
                >
                    <ListItemText sx={{width: 10}}
                                  primary="ID"
                    />
                    <ListItemText sx={{width: 10}}
                                  primary="Имя"
                    />

                    <ListItemText sx={{width: 10, mr: 3}}
                                  primary="Дата и время"
                    />

                    <ListItemText sx={{width: 10}}
                                  primary="Мастер"
                    />
                    <ListItemText sx={{width: 10}}
                                  primary="Город"
                    />
                    <ListItemText sx={{width: 10}}
                                  primary="Цена за час"
                    />
                    <ListItemText sx={{width: 10}}
                                  primary="Время работы"
                    />
                    <ListItemText sx={{width: 10}}
                                  primary="Итог"
                    />
                    <ListItemText sx={{width: 10, mr: 4}}
                                  primary="Статус"
                    />
                </ListItem>
                <Divider orientation="vertical"/>
                {orders.IsEmpty ? <h1>Список пуст</h1> : orders.orders.map((order) => {
                    const time = new Date(order.time).toLocaleString("uk-UA")
                    const city = cities.cities.find(city => city.id === order.cityId)
                    return (<ListItem
                        key={order.id}
                        divider
                        secondaryAction={<Tooltip title={'Удалить заказ'}
                                                  placement="right"
                                                  arrow>
                            <IconButton sx={{width: 5}}
                                        edge="end"
                                        aria-label="delete"
                                        onClick={() => removeOrder(order.id)}
                            >
                                <DeleteIcon/>
                            </IconButton>
                        </Tooltip>}
                    >
                        <ListItemText sx={{width: 10}}
                                      primary={order.id}
                        />
                        <ListItemText sx={{width: 10}}
                                      primary={order.name}
                        />
                        <ListItemText sx={{width: 10, mr: 3}}
                                      primary={time}
                        />
                        <ListItemText sx={{width: 10}}
                                      primary={order.master.name}/>
                        <ListItemText sx={{width: 10}}
                                      primary={city.name}
                        />
                        <ListItemText sx={{width: 10}}
                                      primary={city.price + " грн"}
                        />
                        <ListItemText sx={{width: 10}}
                                      primary={order.sizeClock.date.slice(0, 2) + " ч."}/>
                        <ListItemText sx={{width: 10}}
                                      primary={order.price + " грн"}
                        />
                        <ListItemText sx={{width: 10, mr: 4}}
                                      primary={<FormControl sx={{maxWidth: 100}} size="small">
                                          <InputLabel htmlFor="grouped-native-select">Статус</InputLabel>
                                          <Select
                                              labelId="status"
                                              value={order.status}
                                              onChange={(event) => handleChange(event.target.value, order)}
                                              label="Статус"
                                          >
                                              <MenuItem value={STATUS_LIST.WAITING}>Ожидание</MenuItem>
                                              <MenuItem value={STATUS_LIST.REJECTED}>Отказ</MenuItem>
                                              <MenuItem value={STATUS_LIST.ACCEPTED}>Подтвержден</MenuItem>
                                              <MenuItem value={STATUS_LIST.DONE}>Выполнен</MenuItem>
                                          </Select>
                                      </FormControl>}
                        />
                        {isPast(new Date(order.time)) ? null :

                            <Tooltip title={'Изменить заказ'}
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
                timeToEdit={timeToEdit}
                getOrders={() => getOrders()}
            /> : null}

        </Box>
        <Box sx={{display: "flex", justifyContent: "center"}}>
            <Pages context={orders}/>
        </Box>
    </Box>);
})
export default OrderList;
