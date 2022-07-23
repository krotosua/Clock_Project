import * as React from 'react';
import {useEffect, useState} from 'react';
import {statusChangeOrder} from "../../http/orderAPI";
import {STATUS_LIST} from "../../store/OrderStore";
import {FormProvider, useForm} from "react-hook-form";
import {
    Box,
    Button,
    CircularProgress,
    Divider,
    FormControl,
    InputLabel,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    MenuItem,
    Select,
    TextField,
    Typography
} from "@mui/material";
import {DateRangePicker, LocalizationProvider} from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import ruLocale from "date-fns/locale/ru";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import {fetchCustomers} from "../../http/userAPI";
import {fetchCities} from "../../http/cityAPI";
import {fetchSize} from "../../http/sizeAPI";
import SelectorMultiple from "../adminPageComponents/modals/SlectorMultiplate";

const defaultValues = {
    status: "",
    time: null,
    cityList: [],
    userList: [],
    sizeList: [],
    userEmailList: [],
    date: [null, null],
    forFilter: true,
    minPrice: "",
    maxPrice: "",
    reset: false
}
const STYLE_LIST = {
    ID: {width: 100, height: 70, position: "absolute", left: 5},
    NAME: {width: 100, height: 70, position: "absolute", left: 105},
    USER_ID: {width: 100, height: 70, position: "absolute", left: 210},
    TIME: {width: 100, height: 70, position: "absolute", left: 320},
    END_TIME: {width: 100, height: 70, position: "absolute", left: 440},
    SIZE_NAME: {width: 90, height: 70, position: "absolute", left: 550, textAlign: "center"},
    CITY_NAME: {width: 100, height: 70, position: "absolute", left: 650},
    PRICE: {width: 80, height: 70, position: "absolute", left: 790},
    STATUS: {width: 100, height: 70, position: "absolute", left: 900}
}
const STYLE_COMPONENT_LIST = {
    ID: {width: 100, position: "absolute", left: 5, textAlign: "center"},
    NAME: {width: 100, position: "absolute", left: 105, textAlign: "center", wordWrap: "break-word"},
    USER_ID: {width: 100, position: "absolute", left: 200, textAlign: "center"},
    TIME: {width: 100, position: "absolute", left: 320, textAlign: "center"},
    END_TIME: {width: 100, position: "absolute", left: 440, textAlign: "center"},
    SIZE_NAME: {width: 90, position: "absolute", left: 550, textAlign: "center", wordWrap: "break-word"},
    CITY_NAME: {width: 100, position: "absolute", left: 640, textAlign: "center"},
    PRICE: {width: 70, position: "absolute", left: 790, textAlign: "center", wordWrap: "break-word"},
    STATUS: {width: 100, position: "absolute", left: 900, textAlign: "center"}
}
const OrderListMaster = ({
                             limit,
                             setLoading,
                             loading,
                             alertMessage,
                             setFilters,
                             setLimit,
                             ordersList,
                             sorting,
                             ascending,
                             sortingList
                         }) => {
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
    const status = watch("status", null)
    const [citiesList, setCitiesList] = useState([])
    const [date, setDate] = useState([null, null]);
    const [maxOrderPrice, setMaxOrderPrice] = useState(null)
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
    const createFilter = async ({
                                    cityList,
                                    userList,
                                    sizeList,
                                    minPrice,
                                    maxPrice,
                                    date,
                                    userEmailList,
                                    userName
                                }) => {
        const filter = {
            cityIDes: cityList.length !== 0 ? cityList.map(city => city.id) : null,
            userIDes: userList.length !== 0 ? userList.map(user => user.id) : null,
            sizeIDes: sizeList.length !== 0 ? sizeList.map(size => size.id) : null,
            userEmails: userEmailList.length !== 0 ? userEmailList.map(user => user.email) : null,
            userName: userName.length !== 0 ? userName : null,
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

    return (
        <Box sx={{flexGrow: 1, maxWidth: "1fr"}}>
            <FormProvider register={register} errors={errors} trigger={trigger} getValues={getValues}
                          setValue={setValue} watch={watch}>
                <form onSubmit={handleSubmit(createFilter)}>
                    <Box>
                        <Typography sx={{mb: 1, mt: 1}}>
                            Выберите фильтр:
                        </Typography>
                        <Box sx={{display: "flex", justifyContent: "space-between",}}>
                            <Box sx={{minHeight: 150, width: 300, mb: 2}}>
                                <SelectorMultiple name={"cityList"} fetch={fetchCities}
                                                  label={"Выберите город"} id={"cities"}/>
                                <SelectorMultiple name={"sizeList"} fetch={fetchSize}
                                                  label={"Выберите часы"} id={"sizes"}/>
                                <SelectorMultiple name={"userList"} fetch={fetchCustomers}
                                                  label={"Выберите ID пользователя"} id={"user"}
                                                  OptionLabel={(option) => (option.id).toString()}/>
                            </Box>
                            <Box>
                                <Box sx={{display: "flex", justifyContent: "space-between",}}>
                                    <FormControl sx={{width: 100}} size="small">
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
                                            sx={{width: 130}} size={"small"}
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
                                            sx={{width: 130}}
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
                                <Box sx={{display: "flex", justifyContent: "space-between",}}>
                                    <Box>
                                        <SelectorMultiple name={"userEmailList"} fetch={fetchCustomers}
                                                          label={"Выберите Email пользователя"} id={"email"}
                                                          OptionLabel={(option) => option.email}/>
                                    </Box>
                                    <TextField
                                        {...register("userName",)}
                                        size={"small"}
                                        sx={{ml: 1, mt: 1}}
                                        id="userName"
                                        label={`По имени`}
                                        variant="outlined"
                                    />
                                </Box>
                            </Box>
                            <Box
                                sx={{width: 200, mt: 2}}>
                                <Button size={"small"} variant="contained" sx={{mb: 1}} color={"error"}
                                        onClick={resetFilter}>Сбросить фильтр</Button>
                                <Button variant="contained" size={"small"} type="submit" color={"success"} key="two">Применить
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
                            {ascending ? sorting === "id" && <ExpandMoreIcon/> : sorting === "id" && <ExpandLessIcon/>}
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
                            selected={sorting === "userId"}
                            sx={STYLE_LIST.USER_ID}
                            onClick={() => sortingList("userId")}>
                            UserID
                            {ascending ? sorting === "userId" && <ExpandMoreIcon/> : sorting === "userId" &&
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
                            {ascending ? sorting === "endTime" && <ExpandMoreIcon/> : sorting === "endTime" &&
                                <ExpandLessIcon/>}
                        </ListItemButton>
                        <ListItemButton
                            selected={sorting === "sizeName"}
                            sx={STYLE_LIST.SIZE_NAME}
                            onClick={() => sortingList("sizeName")}>
                            Тип услуги
                            {ascending ? sorting === "sizeName" && <ExpandMoreIcon/> : sorting === "sizeName" &&
                                <ExpandLessIcon/>}
                        </ListItemButton>
                        <ListItemButton
                            selected={sorting === "cityName"}
                            sx={STYLE_LIST.CITY_NAME}
                            onClick={() => sortingList("cityName")}>
                            Город
                            {ascending ? sorting === "cityName" && <ExpandMoreIcon/> : sorting === "cityName" &&
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
                            <ListItemText sx={STYLE_COMPONENT_LIST.USER_ID}
                                          primary={order.user.id}
                            />
                            <ListItemText sx={STYLE_COMPONENT_LIST.TIME}
                                          primary={time}
                            />
                            <ListItemText sx={STYLE_COMPONENT_LIST.END_TIME}
                                          primary={endTime}
                            />
                            <ListItemText sx={STYLE_COMPONENT_LIST.SIZE_NAME}
                                          primary={order.sizeClock.name}
                            />
                            <ListItemText sx={STYLE_COMPONENT_LIST.CITY_NAME}
                                          primary={citiesList.find(city => city.id === order.cityId)?.name}
                            />


                            <ListItemText sx={STYLE_COMPONENT_LIST.PRICE}
                                          primary={order.price + `$`}
                            />
                            <ListItemText sx={STYLE_COMPONENT_LIST.STATUS}
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
                </List>}

        </Box>
    );
}
export default OrderListMaster;
