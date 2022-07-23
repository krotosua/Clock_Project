import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    CircularProgress,
    Divider,
    Fab,
    FormControl,
    InputLabel,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    MenuItem,
    Rating,
    Select,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import {ORDER_ROUTE} from "../utils/consts";
import {Link, useNavigate, useParams} from "react-router-dom";
import TablsPagination from "../components/TablsPagination";
import MyAlert from "../components/adminPageComponents/MyAlert";
import {fetchCustomerOrders} from "../http/orderAPI";
import {FormProvider, useForm} from "react-hook-form";
import {fetchMasters} from "../http/masterAPI";
import {STATUS_LIST} from "../store/OrderStore";
import {DateRangePicker, LocalizationProvider} from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import ruLocale from "date-fns/locale/ru";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import MasterRating from "../components/customerPageComponents/MasterRating";
import {fetchCities} from "../http/cityAPI";
import {fetchSize} from "../http/sizeAPI";
import SelectorMultiple from "../components/adminPageComponents/modals/SlectorMultiplate";

const STYLE_LIST = {
    ID: {width: 90, height: 70, position: "absolute", left: 0},
    NAME: {width: 100, height: 70, position: "absolute", left: 110},
    TIME: {width: 100, height: 70, position: "absolute", left: 230},
    END_TIME: {width: 100, height: 70, position: "absolute", left: 350},
    SIZE_NAME: {width: 100, height: 70, position: "absolute", left: 460},
    MASTER_NAME: {width: 90, height: 70, position: "absolute", left: 555, textAlign: "center"},
    CITY_NAME: {width: 80, height: 70, position: "absolute", left: 645, textAlign: "center"},
    PRICE: {width: 70, height: 70, position: "absolute", left: 760},
    STATUS: {width: 100, height: 70, position: "absolute", left: 850},
    MARK: {maxWidth: 150, position: "absolute", right: 70}
}
const STYLE_COMPONENT_LIST = {
    ID: {width: 60, position: "absolute", left: 30},
    NAME: {width: 100, position: "absolute", left: 120, wordWrap: "break-word"},
    TIME: {width: 100, position: "absolute", left: 220, textAlign: "center"},
    END_TIME: {width: 100, position: "absolute", left: 340, textAlign: "center", wordWrap: "break-word"},
    SIZE_NAME: {width: 100, position: "absolute", left: 450, wordWrap: "break-word", textAlign: "center"},
    MASTER_NAME: {width: 100, position: "absolute", left: 550, wordWrap: "break-word", textAlign: "center"},
    CITY_NAME: {width: 70, position: "absolute", left: 650, wordWrap: "break-word", textAlign: "center"},
    PRICE: {width: 70, position: "absolute", left: 780},
    STATUS: {width: 150, position: "absolute", left: 860},
    MARK: {position: "absolute", right: 30}
}


const defaultValues = {
    status: "",
    time: [null, null],
    cityId: null,
    masterId: null,
    forFilter: true,
    minPrice: "",
    maxPrice: "",
    cityList: [],
    masterList: [],
    sizeList: [],

}
const Customer = () => {
    const navigate = useNavigate()
    const {id} = useParams()
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
    const resetLists = watch("reset", false)
    const status = watch("status", "")
    const [citiesList, setCitiesList] = useState([])
    const [ordersList, setOrdersList] = useState([])
    const [order, setOrder] = useState({})
    const [maxOrderPrice, setMaxOrderPrice] = useState(null)
    const [openRating, setOpenRating] = useState(false)
    const [date, setDate] = useState([null, null]);
    const [loading, setLoading] = useState(true)
    const [sorting, setSorting] = useState("id")
    const [filters, setFilters] = useState(null)
    const [ascending, setAscending] = useState(true)
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [totalCount, setTotalCount] = useState(0)
    const [open, setOpen] = useState(false)
    const [isError, setIsError] = useState(false)
    const [message, setMessage] = useState("")
    const alertMessage = (message, bool) => {
        setOpen(true)
        setMessage(message)
        setIsError(bool)
    }
    const getCustomerOrders = async (id, page, limit, sorting, ascending, filters) => {
        try {
            const res = await fetchCustomerOrders(id, page, limit, sorting, ascending, filters)
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
    useEffect(async () => {
        await getCustomerOrders(id, page, limit, sorting, ascending, filters)
    }, [page, limit, sorting, ascending, filters])
    useEffect(async () => {
        try {
            const res = await fetchCities(null, null)
            if (res.status === 204) {
                setCitiesList([])
                return
            }
            setCitiesList(res.data.rows)
        } catch (e) {
            setCitiesList([])
        }
        setMaxOrderPrice(Math.max(...ordersList.map(order => order.price)))
    }, [])
    const createFilter = async ({status, masterList, date, cityList, sizeList, minPrice, maxPrice}) => {
        const filter = {
            cityIDes: cityList.length !== 0 ? cityList.map(city => city.id) : null,
            masterIDes: masterList.length !== 0 ? masterList.map(master => master.id) : null,
            sizeIDes: sizeList.length !== 0 ? sizeList.map(size => size.id) : null,
            time: date.includes(null) ? null : date,
            status: status === "" ? null : status,
            minPrice: minPrice === "" ? null : minPrice,
            maxPrice: maxPrice === "" ? maxOrderPrice : maxPrice
        }
        setFilters(filter)
        setLoading(true)
    };
    const resetFilter = async () => {
        reset()
        setValue("reset", !resetLists)
        setDate([null, null])
        setFilters({})
    };
    if (loading && !filters) {
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
    const sortingList = (param) => {
        if (sorting === param) {
            setAscending(!ascending)
            return
        }
        setAscending(true)
        setSorting(param)
    }
    return (
        <Box>
            <Box sx={{height: "750px", pt: 5, position: "relative"}}>
                <h2>Список заказов</h2>
                <Box sx={{height: "650px"}}>
                    <Box sx={{flexGrow: 1, maxWidth: "1fr",}}>
                        <FormProvider register={register} errors={errors} trigger={trigger} getValues={getValues}
                                      setValue={setValue}>
                            <form onSubmit={handleSubmit(createFilter)}>
                                <Box>
                                    <Typography sx={{mb: 1, mt: 1}}>
                                        Выберите фильтр:
                                    </Typography>
                                    <Box sx={{display: "flex", justifyContent: "space-between", mb: 2}}>
                                        <Box sx={{minHeight: 150, width: 300}}>
                                            <SelectorMultiple name={"cityList"} fetch={fetchCities}
                                                              label={"Выберите город"} id={"cities"}/>
                                            <SelectorMultiple name={"masterList"} fetch={fetchMasters}
                                                              label={"Выберите мастера"} id={"masters"}/>
                                            <SelectorMultiple name={"sizeList"} fetch={fetchSize}
                                                              label={"Выберите часы"} id={"sizes"}/>
                                        </Box>
                                        <Box>
                                            <Box sx={{display: "flex", justifyContent: "space-between",}}>
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
                                                    <Box sx={{mx: 2}}>по </Box>
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
                                                            <TextField size={"small"}
                                                                       label="Начальная дата" {...startProps} />
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
                                                    onClick={resetFilter}>Сбросить фильтр</Button>
                                            <Button variant="contained" size={"small"} type="submit" color={"success"}
                                                    key="two">Применить
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
                                    sx={{height: 70}}
                                    key={1}
                                    divider
                                >
                                    <ListItemButton
                                        selected={sorting === "id"}
                                        sx={STYLE_LIST.ID}
                                        onClick={() => sortingList("id")}>
                                        № заказа
                                        {ascending ? sorting === "id" && <ExpandMoreIcon/> : sorting === "id" &&
                                            <ExpandLessIcon/>}
                                    </ListItemButton>
                                    <ListItemButton
                                        selected={sorting === "name"}
                                        sx={STYLE_LIST.NAME}
                                        onClick={() => sortingList("name")}>
                                        Имя
                                        {ascending ? sorting === "name" && <ExpandMoreIcon/> : sorting === "name" &&
                                            <ExpandLessIcon/>}
                                    </ListItemButton>

                                    <ListItemButton
                                        selected={sorting === "time"}
                                        sx={STYLE_LIST.TIME}
                                        onClick={() => sortingList("time")}>
                                        Начало заказа
                                        {ascending ? sorting === "time" && <ExpandMoreIcon/> : sorting === "time" &&
                                            <ExpandLessIcon/>}
                                    </ListItemButton>
                                    <ListItemButton
                                        selected={sorting === "endTime"}
                                        sx={STYLE_LIST.END_TIME}
                                        onClick={() => sortingList("endTime")}>
                                        Конец заказа
                                        {ascending ? sorting === "endTime" &&
                                            <ExpandMoreIcon/> : sorting === "endTime" &&
                                            <ExpandLessIcon/>}
                                    </ListItemButton>
                                    <ListItemButton
                                        selected={sorting === "sizeName"}
                                        sx={STYLE_LIST.SIZE_NAME}
                                        onClick={() => sortingList("sizeName")}>
                                        Тип услуги
                                        {ascending ? sorting === "sizeName" &&
                                            <ExpandMoreIcon/> : sorting === "sizeName" &&
                                            <ExpandLessIcon/>}
                                    </ListItemButton>
                                    <ListItemButton
                                        selected={sorting === "masterName"}
                                        sx={STYLE_LIST.MASTER_NAME}
                                        onClick={() => sortingList("masterName")}>
                                        Мастер
                                        {ascending ? sorting === "masterName" &&
                                            <ExpandMoreIcon/> : sorting === "masterName" &&
                                            <ExpandLessIcon/>}
                                    </ListItemButton>
                                    <ListItemButton
                                        selected={sorting === "cityName"}
                                        sx={STYLE_LIST.CITY_NAME}
                                        onClick={() => sortingList("cityName")}>
                                        Город
                                        {ascending ? sorting === "cityName" &&
                                            <ExpandMoreIcon/> : sorting === "cityName" &&
                                            <ExpandLessIcon/>}
                                    </ListItemButton>
                                    <ListItemButton
                                        selected={sorting === "price"}
                                        sx={STYLE_LIST.PRICE}
                                        onClick={() => sortingList("price")}>
                                        Цена
                                        {ascending ? sorting === "price" && <ExpandMoreIcon/> : sorting === "price" &&
                                            <ExpandLessIcon/>}
                                    </ListItemButton>
                                    <ListItemButton
                                        selected={sorting === "status"}
                                        sx={STYLE_LIST.STATUS}
                                        onClick={() => sortingList("status")}>
                                        Статус
                                        {ascending ? sorting === "status" && <ExpandMoreIcon/> : sorting === "status" &&
                                            <ExpandLessIcon/>}
                                    </ListItemButton>
                                    <ListItemText sx={STYLE_LIST.MARK}
                                                  primary="Оценка"
                                    />


                                </ListItem>
                                <Divider orientation="vertical"/>
                                {ordersList.length === 0 ? <h1>Список пуст</h1> : ordersList.map((order, index) => {
                                    const time = new Date(order.time).toLocaleString("uk-UA")
                                    const endTime = new Date(order.endTime).toLocaleString("uk-UA")
                                    return (<ListItem
                                        sx={{height: 70}}
                                        key={order.id}
                                        divider
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
                                        <ListItemText sx={STYLE_COMPONENT_LIST.END_TIME}
                                                      primary={endTime}
                                        />

                                        <ListItemText sx={STYLE_COMPONENT_LIST.SIZE_NAME}
                                                      primary={order.sizeClock.name}
                                        /><ListItemText sx={STYLE_COMPONENT_LIST.MASTER_NAME}
                                                        primary={order.master.name}
                                    />
                                        <ListItemText sx={STYLE_COMPONENT_LIST.CITY_NAME}
                                                      primary={citiesList.find(city => city.id === order.cityId)?.name}
                                        />
                                        <ListItemText sx={STYLE_COMPONENT_LIST.PRICE}
                                                      primary={order.price + '$'}
                                        />
                                        <ListItemText sx={STYLE_COMPONENT_LIST.STATUS}
                                                      primary={order.status === STATUS_LIST.DONE ? "Выполнен" :
                                                          order.status === STATUS_LIST.ACCEPTED ? "Подтвержден" :
                                                              order.status === STATUS_LIST.REJECTED ? "Отказ" : "Ожидание"}
                                        />
                                        <ListItemText sx={STYLE_COMPONENT_LIST.MARK}
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
                                                      sx={{mr: 2}}
                                                      disabled={order.status !== STATUS_LIST.DONE}
                                                      onClick={() => {
                                                          setOrder(order)
                                                          setOpenRating(true)
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
                        }


                        {openRating ? <MasterRating openRating={openRating}
                                                    uuid={order.ratingLink}
                                                    alertMessage={alertMessage}
                                                    getOrders={() => getCustomerOrders(id, page, limit, sorting, ascending, filters)}
                                                    onClose={() => setOpenRating(false)}
                        /> : null}
                    </Box>
                    <Box style={{display: "flex", justifyContent: "center"}}>
                        <TablsPagination page={page} totalCount={totalCount} limit={limit}
                                         pagesFunction={(page) => setPage(page)}/>
                    </Box>
                </Box>
                <Link to={ORDER_ROUTE}
                      style={{textDecoration: 'none', color: 'white'}}>
                    <Tooltip title="Добавить заказ" placement="top" arrow>
                        <Fab onClick={() => navigate(ORDER_ROUTE)}
                             color="warning"
                             aria-label="add"
                             sx={{position: 'absolute', bottom: 50, right: 25,}}>
                            <AddIcon/>
                        </Fab>
                    </Tooltip>
                </Link>
            </Box>

            <MyAlert open={open}
                     onClose={() => setOpen(false)}
                     message={message}
                     isError={isError}/>

        </Box>

    );
};

export default Customer;