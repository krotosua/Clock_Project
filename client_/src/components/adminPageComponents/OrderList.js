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
    TextField,
    Tooltip,
    Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import TablsPagination from "../TablsPagination";
import {deleteOrder, downloadFile, fetchAlLOrders, statusChangeOrder} from "../../http/orderAPI";
import {ORDER_ROUTE} from "../../utils/consts";
import {Link, useNavigate} from "react-router-dom";
import EditOrder from "./modals/EditOrder";
import {STATUS_LIST} from "../../store/OrderStore";
import {add, getHours, isPast, set, setHours} from 'date-fns'
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import {fetchMasters} from "../../http/masterAPI";
import {DateRangePicker, LocalizationProvider} from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import ruLocale from "date-fns/locale/ru";
import {FormProvider, useForm} from "react-hook-form";
import SelectorMultiple from "./modals/SlectorMultiplate";
import {fetchCities} from "../../http/cityAPI";
import GetAppSharpIcon from '@mui/icons-material/GetAppSharp';
import {PhotoCamera} from "@mui/icons-material";
import PhotoList from "./modals/PhotoList";


const STYLE_LIST = {
    ID: {width: 60, height: 70, position: "absolute", left: 0},
    NAME: {width: 100, height: 70, position: "absolute", left: 120},
    TIME: {width: 100, height: 70, position: "absolute", left: 230},
    MASTER_NAME: {width: 100, height: 70, position: "absolute", left: 350},
    CITY_NAME: {width: 100, height: 70, position: "absolute", left: 460},
    CITY_PRICE: {width: 80, height: 70, position: "absolute", left: 570, textAlign: "center"},
    SIZE_TIME: {width: 80, height: 70, position: "absolute", left: 665, textAlign: "center"},
    TOTAL_PRICE: {width: 70, height: 70, position: "absolute", left: 760},
    STATUS: {width: 100, height: 70, position: "absolute", left: 850}
}
const STYLE_COMPONENT_LIST = {
    ID: {width: 60, position: "absolute", left: 15},
    NAME: {width: 100, position: "absolute", left: 130, wordWrap: "break-word"},
    TIME: {width: 100, position: "absolute", left: 230, textAlign: "center"},
    MASTER_NAME: {width: 100, position: "absolute", left: 340, textAlign: "center", wordWrap: "break-word"},
    CITY_NAME: {width: 100, position: "absolute", left: 450, wordWrap: "break-word", textAlign: "center"},
    CITY_PRICE: {width: 100, position: "absolute", left: 560, textAlign: "center"},
    SIZE_TIME: {width: 70, position: "absolute", left: 665, textAlign: "center"},
    TOTAL_PRICE: {width: 70, position: "absolute", left: 770},
    STATUS: {width: 150, position: "absolute", left: 850},
    PHOTO: {position: "absolute", right: 90}
}

const defaultValues = {
    status: "",
    time: null,
    cityList: [],
    masterList: [],
    forFilter: true,
    minPrice: "",
    maxPrice: ""
}
const OrderList = ({alertMessage}) => {
    const {
        register,
        handleSubmit,
        trigger,
        setValue,
        getValues,
        reset,
        watch,
        formState: {errors, dirtyFields}
    } = useForm({
        defaultValues
    });
    const status = watch("status", 0)
    const resetLists = watch("reset", false)
    const [editVisible, setEditVisible] = useState(false)
    const [openPhotos, setOpenPhotos] = useState(false)
    const [photosId, setPhotosId] = useState(null)
    const [idToEdit, setIdToEdit] = useState(null);
    const [timeToEdit, setTimeToEdit] = useState(add(new Date(0, 0, 0,), {hours: 1}));
    const [date, setDate] = useState([null, null]);
    const [orderToEdit, setOrderToEdit] = useState(null)
    const [ordersList, setOrdersList] = useState(null)
    const [page, setPage] = useState(1)
    const [totalCount, setTotalCount] = useState(0)
    const [limit, setLimit] = useState(10)
    const [sorting, setSorting] = useState("time")
    const [ascending, setAscending] = useState(false)
    const [loading, setLoading] = useState(true)
    const [filters, setFilters] = useState(null)
    const [maxOrderPrice, setMaxOrderPrice] = useState(null)
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
    const getOrders = async (page, limit, sorting, ascending, filters) => {
        try {
            const res = await fetchAlLOrders(page, limit, sorting, ascending, filters)
            if (res.status === 204) {
                setOrdersList([])
                setTotalCount(0)
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
        await getOrders(page, limit, sorting, ascending, filters)
    }, [page, limit, sorting, ascending, filters])
    useEffect(async () => {
        if (ordersList) {
            setMaxOrderPrice(Math.max(...ordersList.map(order => order.price)))
        }
    }, [])
    const removeOrder = async (id) => {
        try {
            await deleteOrder(id)
            alertMessage('Успешно удаленно', false)
            await getOrders(page, limit, sorting, ascending, filters)
        } catch (e) {
            alertMessage('Не удалось удалить', true)
        }
    }
    if (loading && !getValues("forFilter")) {
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
    const createFilter = async ({status, masterList, userName, date, cityList, minPrice, maxPrice}) => {
        const filter = {
            cityIDes: cityList.length !== 0 ? cityList.map(city => city.id) : null,
            masterIDes: masterList.length !== 0 ? masterList.map(master => master.id) : null,
            time: date || null,
            status: status === "" ? null : status,
            minPrice: minPrice === "" ? null : minPrice,
            maxPrice: maxPrice === "" ? maxOrderPrice : maxPrice,
            userName: userName.length !== 0 ? userName : null,
        }
        setPage(1)
        setLoading(true)
        setFilters(filter)
    };
    const resetFilter = async () => {
        reset()
        setDate([null, null])
        setValue("reset", !resetLists)
        setFilters({})
    };
    const exportExel = async () => {
        try {
            await downloadFile(sorting, ascending, filters)

        } catch (e) {
            console.log(e)
        }
    }
    return (<Box>
        <Box sx={{flexGrow: 1, maxWidth: "1fr", minHeight: document.documentElement.clientHeight - 130}}>
            <Box sx={{display: "flex", justifyContent: "space-between"}}>
                <Typography sx={{mt: 4, mb: 2}} variant="h6" component="div">
                    Список заказов
                </Typography>
            </Box>

            <FormProvider register={register} errors={errors} watch={watch} trigger={trigger} getValues={getValues}
                          setValue={setValue}>
                <form onSubmit={handleSubmit(createFilter)}>
                    <Box>
                        <Typography sx={{mb: 1, mt: -2}}>
                            Выберите фильтр:
                        </Typography>
                        <Box sx={{display: "flex", justifyContent: "space-between", minHeight: 130}}>
                            <Box sx={{mb: 1}}>
                                <SelectorMultiple name={"cityList"} fetch={fetchCities}
                                                  label={"Выберите город"} id={"cities"}/>
                                <SelectorMultiple name={"masterList"} fetch={fetchMasters}
                                                  label={"Выберите мастера"} id={"masters"}/>
                                <TextField
                                    {...register("userName",)}
                                    size={"small"}
                                    sx={{my: 1, width: 300}}
                                    id="userName"
                                    label={`По имени`}
                                    variant="outlined"
                                />
                            </Box>
                            <Box>
                                <Box sx={{display: "flex", justifyContent: "space-between"}}>
                                    <FormControl sx={{minWidth: 100}} size="small">
                                        <InputLabel htmlFor="grouped-native-select">Статус</InputLabel>
                                        <Select
                                            {...register("status")}
                                            size={"small"}
                                            labelId="status"
                                            value={status || ""}
                                            onChange={(event) => setValue("status", event.target.value)}
                                            label="Статус"
                                        >
                                            <MenuItem value={STATUS_LIST.WAITING}>Ожидание</MenuItem>
                                            <MenuItem value={STATUS_LIST.REJECTED}>Отказ</MenuItem>
                                            <MenuItem value={STATUS_LIST.ACCEPTED}>Подтвержден</MenuItem>
                                            <MenuItem value={STATUS_LIST.DONE}>Выполнен</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <Box sx={{display: "flex"}}>
                                        <TextField
                                            {...register("minPrice",)}
                                            type={"number"}
                                            error={!!errors.maxPrice}
                                            label={"начальная сумма"}
                                            sx={{width: 100}} size={"small"}
                                            onBlur={() => trigger("maxPrice")}/>
                                        <Box sx={{mx: 2, mt: 1}}>по </Box>
                                        <TextField
                                            {...register("maxPrice", {
                                                validate: {
                                                    isBigger: value => Number(value) >= Number(getValues("minPrice")) ||
                                                        dirtyFields.minPrice && dirtyFields.maxPrice && "больше"
                                                }
                                            })}
                                            type={"number"}
                                            error={!!errors.maxPrice}
                                            label={"конечная сумма"}
                                            helperText={errors.maxPrice?.message}
                                            sx={{width: 100}}
                                            size={"small"}
                                            onBlur={() => trigger("maxPrice")}
                                        />
                                    </Box>
                                    <FormControl variant="standard" sx={{minWidth: 60}} size="small">
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
                                <LocalizationProvider
                                    dateAdapter={AdapterDateFns}
                                    locale={ruLocale}
                                    localeText={{start: 'first', end: 'Конец дата'}}
                                >
                                    <DateRangePicker
                                        {...register("date",)}
                                        mask='__.__.____'
                                        value={date}
                                        endText={"конечная дата"}
                                        startText={"начальная дата"}
                                        onChange={(newValue) => {
                                            setDate(newValue);
                                            setValue("date", newValue)
                                        }}
                                        renderInput={(startProps, endProps) => (
                                            <React.Fragment key={1}>
                                                <TextField size={"small"} label="Начальная дата" {...startProps} />
                                                <Box sx={{mx: 2}}> по </Box>
                                                <TextField sx={{mt: "12px"}} size={"small"} {...endProps} />
                                            </React.Fragment>
                                        )}
                                    />
                                </LocalizationProvider>
                            </Box>
                            <Box
                                sx={{width: 200, mt: 2}}>
                                <Button size={"small"} variant="contained" sx={{mb: 1}} color={"error"}
                                        onClick={resetFilter}>Сбросить
                                    фильтр</Button>
                                <Button variant="contained" size={"small"} type="submit" disabled={!!errors.maxPrice}
                                        color={"success"} key="two">Применить
                                    фильтр</Button>
                            </Box>
                        </Box>
                    </Box>
                    <Divider/>
                </form>
            </FormProvider>
            {loading ? <Box sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: window.innerHeight - 60,
                }}>
                    <CircularProgress/>
                </Box> :
                <List disablePadding>
                    <ListItem
                        key={1}
                        sx={{minHeight: 70}}
                        divider
                        secondaryAction={
                            <Box>
                                <Tooltip title={'Скачать таблицу'}
                                         placement="top"
                                         arrow>
                                    <IconButton sx={{mr: 2}}
                                                edge="end"
                                                aria-label="add"
                                                onClick={() => exportExel()}
                                    >
                                        <GetAppSharpIcon/>
                                    </IconButton>
                                </Tooltip>
                                <Link to={ORDER_ROUTE}
                                      style={{textDecoration: 'none', color: 'white'}}>
                                    <Tooltip title={'Добавить заказ'}
                                             placement="top"
                                             arrow>
                                        <IconButton sx={{position: "absolute", right: 0, px: 0}}
                                                    edge="end"
                                                    aria-label="add"
                                                    onClick={() => navigate(ORDER_ROUTE)}
                                        >
                                            <AddIcon/>
                                        </IconButton>
                                    </Tooltip>
                                </Link></Box>}
                    >
                        <ListItemButton
                            selected={sorting === "id"}
                            sx={STYLE_LIST.ID}
                            onClick={() => sortingList("id")}
                        >
                            ID
                            {ascending ? sorting === "id" && <ExpandMoreIcon/> : sorting === "id" && <ExpandLessIcon/>}
                        </ListItemButton>
                        <ListItemButton
                            sx={STYLE_LIST.NAME}
                            selected={sorting === "name"}
                            onClick={() => sortingList("name")}
                        >
                            Имя
                            {ascending ? sorting === "name" &&
                                <ExpandMoreIcon sx={{maxWidth: 40}}/> : sorting === "name" &&
                                <ExpandLessIcon/>}
                        </ListItemButton>

                        <ListItemButton
                            selected={sorting === "time"}
                            sx={STYLE_LIST.TIME}
                            onClick={() => sortingList("time")}
                        >
                            Дата и время
                            {ascending ? sorting === "time" && <ExpandMoreIcon/> : sorting === "time" &&
                                <ExpandLessIcon/>}
                        </ListItemButton>

                        <ListItemButton
                            selected={sorting === "masterName"}
                            sx={STYLE_LIST.MASTER_NAME}
                            onClick={() => sortingList("masterName")}
                        >
                            Мастер
                            {ascending ? sorting === "masterName" && <ExpandMoreIcon/> : sorting === "masterName" &&
                                <ExpandLessIcon/>}
                        </ListItemButton>
                        <ListItemButton
                            sx={STYLE_LIST.CITY_NAME}
                            selected={sorting === "cityName"}
                            onClick={() => sortingList("cityName")}
                        >
                            Город
                            {ascending ? sorting === "cityName" && <ExpandMoreIcon/> : sorting === "cityName" &&
                                <ExpandLessIcon/>}
                        </ListItemButton>
                        <ListItemButton
                            sx={STYLE_LIST.CITY_PRICE}
                            selected={sorting === "cityPrice"}
                            onClick={() => sortingList("cityPrice")}
                        >
                            Цена за час
                            {ascending ? sorting === "cityPrice" && <ExpandMoreIcon/> : sorting === "cityPrice" &&
                                <ExpandLessIcon/>}
                        </ListItemButton>
                        <ListItemButton
                            sx={STYLE_LIST.SIZE_TIME}
                            selected={sorting === "date"}
                            onClick={() => sortingList("date")}
                        >
                            Кол-во часов
                            {ascending ? sorting === "date" && <ExpandMoreIcon/> : sorting === "date" &&
                                <ExpandLessIcon/>}
                        </ListItemButton>
                        <ListItemButton
                            selected={sorting === "price"}
                            sx={STYLE_LIST.TOTAL_PRICE}
                            onClick={() => sortingList("price")}
                        >
                            Итог
                            {ascending ? sorting === "price" && <ExpandMoreIcon/> : sorting === "price" &&
                                <ExpandLessIcon/>}
                        </ListItemButton>
                        <ListItemButton
                            selected={sorting === "status"}
                            sx={STYLE_LIST.STATUS}
                            onClick={() => sortingList("status")}
                        >
                            Статус
                            {ascending ? sorting === "status" && <ExpandMoreIcon/> : sorting === "status" &&
                                <ExpandLessIcon/>}
                        </ListItemButton>
                    </ListItem>
                    <Divider orientation="vertical"/>
                    {ordersList.length === 0 ? <h1>Список пуст</h1> : ordersList.map((order) => {
                        const time = new Date(order.time).toLocaleString("uk-UA")
                        return (<ListItem
                            key={order.id}
                            sx={{minHeight: 70}}
                            divider
                            secondaryAction={<Tooltip title={'Удалить заказ'}
                                                      placement="right"
                                                      arrow>
                                <IconButton sx={{width: 10}}
                                            edge="end"
                                            aria-label="delete"
                                            onClick={() => removeOrder(order.id)}
                                >
                                    <DeleteIcon/>
                                </IconButton>
                            </Tooltip>}
                        >
                            <ListItemText sx={STYLE_COMPONENT_LIST.ID}
                                          primary={order.id}
                            />
                            <ListItemText sx={STYLE_COMPONENT_LIST.NAME}
                                          primary={order.name}
                            />
                            <ListItemText sx={STYLE_COMPONENT_LIST.TIME}
                                          primary={time}
                            />
                            <ListItemText sx={STYLE_COMPONENT_LIST.MASTER_NAME}
                                          primary={order.master.name}/>
                            <ListItemText sx={STYLE_COMPONENT_LIST.CITY_NAME}
                                          primary={order.city.name}
                            />
                            <ListItemText sx={STYLE_COMPONENT_LIST.CITY_PRICE}
                                          primary={order.city.price + " грн"}
                            />
                            <ListItemText sx={STYLE_COMPONENT_LIST.SIZE_TIME}
                                          primary={getHours(setHours(new Date(), order.sizeClock.date.slice(0, 2))) + " ч."}/>
                            <ListItemText sx={STYLE_COMPONENT_LIST.TOTAL_PRICE}
                                          primary={order.price + " грн"}
                            />
                            <ListItemText sx={STYLE_COMPONENT_LIST.STATUS}
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
                            <Tooltip title={'Прикрепленные фото'}
                                     placement="top"
                                     arrow>
                                <IconButton sx={STYLE_COMPONENT_LIST.PHOTO} color="primary" aria-label="upload picture"
                                            component="label" onClick={() => {
                                    setOpenPhotos(true)
                                    setPhotosId(order.id)
                                }}>
                                    <PhotoCamera/>
                                </IconButton>
                            </Tooltip>
                            {isPast(new Date(order.time)) ? null :
                                <Tooltip title={'Изменить заказ'}
                                         placement="top"
                                         arrow>
                                    <IconButton sx={{position: "absolute", right: 50}}
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
                </List>}

            {editVisible ? <EditOrder
                open={editVisible}
                onClose={() => {
                    setEditVisible(false)
                }}
                orderToEdit={orderToEdit}
                alertMessage={alertMessage}
                idToEdit={idToEdit}
                timeToEdit={timeToEdit}
                getOrders={() => getOrders(page, limit, sorting, ascending, filters)}
            /> : null}

            {openPhotos ? <PhotoList
                open={openPhotos}
                onClose={() => {
                    setOpenPhotos(false)
                }}
                photosId={photosId}
            /> : null}

        </Box>
        <Box sx={{display: "flex", justifyContent: "center"}}>
            <TablsPagination page={page} totalCount={totalCount} limit={limit} pagesFunction={(page) => setPage(page)}/>
        </Box>
    </Box>);
}
export default OrderList;
