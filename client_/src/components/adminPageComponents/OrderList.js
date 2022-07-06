import * as React from 'react';
import {useEffect, useState} from 'react';
import {
    Box,
    Button,
    CircularProgress,
    Divider,
    FormControl,
    IconButton,
    InputLabel,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    MenuItem,
    Select,
    Tooltip,
    Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import TablsPagination from "../TablsPagination";
import {deleteOrder, fetchAlLOrders, statusChangeOrder} from "../../http/orderAPI";
import {ORDER_ROUTE} from "../../utils/consts";
import {Link, useNavigate} from "react-router-dom";
import EditOrder from "./modals/EditOrder";
import {STATUS_LIST} from "../../store/OrderStore";
import {add, getHours, isPast, set, setHours} from 'date-fns'
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";


const OrderList = ({alertMessage}) => {
    const [editVisible, setEditVisible] = useState(false)
    const [openFilters, setOpenFilters] = useState(false)
    const [idToEdit, setIdToEdit] = useState(null);
    const [timeToEdit, setTimeToEdit] = useState(add(new Date(0, 0, 0,), {hours: 1}));
    const [orderToEdit, setOrderToEdit] = useState(null)
    const [ordersList, setOrdersList] = useState(null)
    const [page, setPage] = useState(1)
    const [totalCount, setTotalCount] = useState(0)
    const [limit, setLimit] = useState(10)
    const [sorting, setSorting] = useState("time")
    const [ascending, setAscending] = useState(false)
    const [loading, setLoading] = useState(true)
    const handleChange = async (statusOrder, order) => {
        try {
            const changeInfo = {
                id: order.id,
                status: statusOrder
            }
            await statusChangeOrder(changeInfo)
            order.status = statusOrder
            alertMessage("Статус заказа успешно изменен", false)
        } catch (e) {
            alertMessage("Не удалось изменить статус заказа", true)
        }
    };
    const getOrders = async (page, limit, sorting, ascending) => {
        try {
            const res = await fetchAlLOrders(page, limit, sorting, ascending)
            if (res.status === 204) {
                setOrdersList([])
                return
            }
            setOrdersList(res.data.rows)
            setTotalCount(res.data.count)
        } catch (e) {
            setOrdersList([])
        } finally {
            setLoading(false)
        }
    }
    const navigate = useNavigate()
    useEffect(async () => {
        await getOrders(page, limit, sorting, ascending)
    }, [page, limit, sorting, ascending])

    const removeOrder = async (id) => {
        try {
            await deleteOrder(id)
            alertMessage('Успешно удаленно', false)
            await getOrders(page, limit)
        } catch (e) {
            alertMessage('Не удалось удалить', true)
        }
    }
    if (loading) {
        return (
            <Box sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: window.innerHeight - 60,
            }}>
                <CircularProgress/>
            </Box>
        )
    }
    const editOrder = (order, time) => {
        setOrderToEdit(order)
        setIdToEdit(order.id)
        setTimeToEdit(set(new Date(0, 0, 0), {hours: time.slice(0, 2)}))
        setEditVisible(true)
    }
    const sortingList = (param) => {
        if (sorting === param) {
            setAscending(!ascending)
            return
        }
        setAscending(true)
        setSorting(param)
    }
    return (<Box>
        <Box sx={{flexGrow: 1, maxWidth: "1fr", minHeight: "700px"}}>
            <Box sx={{display: "flex", justifyContent: "space-between"}}>
                <Typography sx={{mt: 4, mb: 2}} variant="h6" component="div">
                    Список заказов
                </Typography>
                <FormControl variant="standard" sx={{m: 1, maxWidth: 60}} size="small">
                    <InputLabel id="limit">Лимит</InputLabel>
                    <Select
                        labelId="limit"
                        id="limit"
                        value={limit}
                        onChange={(e) => setLimit(e.target.value)}
                        label="Лимит"
                    >
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={25}>25</MenuItem>
                        <MenuItem value={50}>50</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Button onClick={() => setOpenFilters(true)} variant="text">Добавить фильтры</Button>
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
                    <ListItemButton
                        selected={sorting === "id"}
                        sx={{ml: -2, maxWidth: 70}}
                        onClick={() => sortingList("id")}
                    >
                        ID
                        {ascending ? sorting === "id" && <ExpandMoreIcon/> : sorting === "id" && <ExpandLessIcon/>}
                    </ListItemButton>
                    <ListItemButton
                        sx={{maxWidth: 120, ml: 5}}
                        selected={sorting === "name"}
                        onClick={() => sortingList("name")}
                    >
                        Имя
                        {ascending ? sorting === "name" && <ExpandMoreIcon sx={{maxWidth: 40}}/> : sorting === "name" &&
                            <ExpandLessIcon/>}
                    </ListItemButton>

                    <ListItemButton
                        selected={sorting === "time"}
                        sx={{maxWidth: 120, ml: 2}}
                        onClick={() => sortingList("time")}
                    >
                        Дата и время
                        {ascending ? sorting === "time" && <ExpandMoreIcon/> : sorting === "time" && <ExpandLessIcon/>}
                    </ListItemButton>

                    <ListItemButton
                        selected={sorting === "masterName"}
                        sx={{maxWidth: 100, ml: 2}}
                        onClick={() => sortingList("masterName")}
                    >
                        Мастер
                        {ascending ? sorting === "masterName" && <ExpandMoreIcon/> : sorting === "masterName" &&
                            <ExpandLessIcon/>}
                    </ListItemButton>
                    <ListItemButton
                        sx={{maxWidth: 100, mr: 4}}
                        selected={sorting === "cityName"}
                        onClick={() => sortingList("cityName")}
                    >
                        Город
                        {ascending ? sorting === "cityName" && <ExpandMoreIcon/> : sorting === "cityName" &&
                            <ExpandLessIcon/>}
                    </ListItemButton>
                    <ListItemButton
                        sx={{maxWidth: 100}}
                        selected={sorting === "cityPrice"}
                        onClick={() => sortingList("cityPrice")}
                    >
                        Цена за час
                        {ascending ? sorting === "cityPrice" && <ExpandMoreIcon/> : sorting === "cityPrice" &&
                            <ExpandLessIcon/>}
                    </ListItemButton>
                    <ListItemButton
                        sx={{maxWidth: 100}}
                        selected={sorting === "date"}
                        onClick={() => sortingList("date")}
                    >
                        Кол-во часов
                        {ascending ? sorting === "date" && <ExpandMoreIcon/> : sorting === "date" &&
                            <ExpandLessIcon/>}
                    </ListItemButton>
                    <ListItemButton
                        selected={sorting === "price"}
                        sx={{maxWidth: 100, mr: 5,}}
                        onClick={() => sortingList("price")}
                    >
                        Итог
                        {ascending ? sorting === "price" && <ExpandMoreIcon/> : sorting === "price" &&
                            <ExpandLessIcon/>}
                    </ListItemButton>
                    <ListItemButton
                        selected={sorting === "status"}
                        sx={{mr: 20, width: 100}}
                        onClick={() => sortingList("status")}
                    >
                        Статус
                        {ascending ? sorting === "status" && <ExpandMoreIcon/> : sorting === "name" &&
                            <ExpandLessIcon/>}
                    </ListItemButton>
                </ListItem>
                <Divider orientation="vertical"/>
                {ordersList.length === 0 ? <h1>Список пуст</h1> : ordersList.map((order) => {
                    const time = new Date(order.time).toLocaleString("uk-UA")
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
                                      primary={order.city.name}
                        />
                        <ListItemText sx={{width: 10}}
                                      primary={order.city.price + " грн"}
                        />
                        <ListItemText sx={{width: 10}}
                                      primary={getHours(setHours(new Date(), order.sizeClock.date.slice(0, 2))) + " ч."}/>
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
                getOrders={() => getOrders(page, limit)}
            /> : null}

        </Box>
        <Box sx={{display: "flex", justifyContent: "center"}}>
            <TablsPagination page={page} totalCount={totalCount} limit={limit} pagesFunction={(page) => setPage(page)}/>
        </Box>
    </Box>);
}
export default OrderList;
