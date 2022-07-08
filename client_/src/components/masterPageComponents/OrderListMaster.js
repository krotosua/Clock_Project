import * as React from 'react';
import {useEffect, useState} from 'react';
import {statusChangeOrder} from "../../http/orderAPI";
import {STATUS_LIST} from "../../store/OrderStore";
import {FormProvider, useForm} from "react-hook-form";
import {
    Box,
    Button,
    Checkbox,
    CircularProgress,
    Divider,
    FormControl,
    InputLabel,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Select,
    TextField,
    Typography
} from "@mui/material";
import SelectorMultipleCity from "../adminPageComponents/modals/SelectorMultipleCity";
import {DateRangePicker, LocalizationProvider} from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import ruLocale from "date-fns/locale/ru";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import {fetchCustomers} from "../../http/userAPI";
import {fetchCities} from "../../http/cityAPI";
import {fetchSize} from "../../http/sizeAPI";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};
const defaultValues = {
    status: "",
    time: null,
    cityId: null,
    masterId: null,
    forFilter: true,
    minPrice: "",
    maxPrice: ""
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
    const status = watch("status", null)
    const [clockList, setClockList] = useState([])
    const [citiesList, setCitiesList] = useState([])
    const [customerList, setCustomerList] = useState([])
    const [clockChosen, setClockChosen] = useState([])
    const [userChosen, setUserChosen] = useState([]);
    const [date, setDate] = useState([null, null]);
    const [maxOrderPrice, setMaxOrderPrice] = useState(null)
    useEffect(async () => {
        try {
            const res = await fetchCustomers()
            if (res.status === 204) {
                setCustomerList([])
                return
            }
            setCustomerList(res.data)
            setMaxOrderPrice(Math.max(...ordersList.map(order => order.price)))
        } catch (e) {
            setCustomerList([])
        }
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
        try {
            const res = await fetchSize(null, null)
            setClockList(res.data.rows)
        } catch (e) {
            setClockList([])
        }
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
    const createFilter = async ({status, usersList, date, cityList, sizeList, minPrice, maxPrice}) => {
        const filter = {
            cityIDes: cityList.length !== 0 ? cityList.map(city => city.id) : null,
            userIDes: usersList.length !== 0 ? usersList.map(user => user.id) : null,
            sizeIDes: sizeList.length !== 0 ? sizeList.map(size => size.id) : null,
            time: date || null,
            status: status === "" ? null : status,
            minPrice: minPrice === "" ? null : minPrice,
            maxPrice: maxPrice === "" ? maxOrderPrice : maxPrice
        }
        setFilters(filter)
        setLoading(true)
    };
    const resetFilter = async () => {
        reset()
        setUserChosen([])
        setDate([null, null])
        setValue("reset", true)
        setFilters({})
    };
    const multipleChange = (event, setter) => {
        const {target: {value}} = event
        setter(
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    return (
        <Box sx={{flexGrow: 1, maxWidth: "1fr"}}>
            <FormProvider register={register} errors={errors} trigger={trigger} getValues={getValues}
                          setValue={setValue}>
                <form onSubmit={handleSubmit(createFilter)}>
                    <Box>
                        <Typography sx={{mb: 1, mt: 1}}>
                            Выберите фильтр:
                        </Typography>
                        <Box sx={{display: "flex", justifyContent: "space-between",}}>
                            <Box sx={{height: 150, width: 300}}>
                                <SelectorMultipleCity/>
                                <FormControl sx={{mt: 1, width: 300}}>
                                    <InputLabel size={"small"} id="master-multiple-checkbox">Выберите
                                        ID пользователя</InputLabel>
                                    <Select
                                        {...register("usersList",)}
                                        size={"small"}
                                        labelId="master-multiple-checkbox"
                                        id="master-multiple-checkbox"
                                        multiple
                                        value={userChosen}
                                        onChange={(e) => multipleChange(e, setUserChosen)}
                                        input={<OutlinedInput label="Выберите ID пользователя"/>}
                                        renderValue={(selected) => selected.map(sels => sels.id).join(', ')}
                                        MenuProps={MenuProps}
                                    >
                                        {customerList.map((user, index) => (
                                            <MenuItem key={index} value={user}>
                                                <Checkbox checked={userChosen.indexOf(user) > -1}/>
                                                <ListItemText primary={user.id}/>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl sx={{mt: 1, width: 300}}>
                                    <InputLabel size={"small"} id="master-multiple-checkbox">Выберите тип
                                        услуги</InputLabel>
                                    <Select
                                        {...register("sizeList",)}
                                        size={"small"}
                                        labelId="master-multiple-checkbox"
                                        id="master-multiple-checkbox"
                                        multiple
                                        value={clockChosen}
                                        onChange={(e) => multipleChange(e, setClockChosen)}
                                        input={<OutlinedInput label="Выберите тип услуги"/>}
                                        renderValue={(selected) => selected.map(sels => sels.name).join(', ')}
                                        MenuProps={MenuProps}
                                    >
                                        {clockList.map((clock, index) => (
                                            <MenuItem key={index} value={clock}>
                                                <Checkbox checked={clockChosen.indexOf(clock) > -1}/>
                                                <ListItemText primary={clock.name}/>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
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
                        sx={{height: 60}}
                        key={1}
                        divider

                    >
                        <ListItemButton
                            selected={sorting === "id"}
                            sx={{maxWidth: 100, position: "absolute", left: 0}}
                            onClick={() => sortingList("id")}>
                            № заказа
                            {ascending ? sorting === "id" && <ExpandMoreIcon/> : sorting === "id" && <ExpandLessIcon/>}
                        </ListItemButton>
                        <ListItemButton
                            selected={sorting === "name"}
                            sx={{maxWidth: 150, position: "absolute", left: 120}}
                            onClick={() => sortingList("name")}>
                            Имя
                            {ascending ? sorting === "name" && <ExpandMoreIcon/> : sorting === "name" &&
                                <ExpandLessIcon/>}
                        </ListItemButton>
                        <ListItemButton
                            selected={sorting === "userId"}
                            sx={{maxWidth: 150, position: "absolute", left: 210}}
                            onClick={() => sortingList("userId")}>
                            UserID
                            {ascending ? sorting === "userId" && <ExpandMoreIcon/> : sorting === "userId" &&
                                <ExpandLessIcon/>}
                        </ListItemButton>
                        <ListItemButton
                            selected={sorting === "time"}
                            sx={{maxWidth: 100, position: "absolute", left: 310}}
                            onClick={() => sortingList("time")}>
                            Начало заказа
                            {ascending ? sorting === "time" && <ExpandMoreIcon/> : sorting === "time" &&
                                <ExpandLessIcon/>}
                        </ListItemButton>
                        <ListItemButton
                            selected={sorting === "endTime"}
                            sx={{maxWidth: 100, position: "absolute", left: 440}}
                            onClick={() => sortingList("endTime")}>
                            Конец заказа
                            {ascending ? sorting === "endTime" && <ExpandMoreIcon/> : sorting === "endTime" &&
                                <ExpandLessIcon/>}
                        </ListItemButton>
                        <ListItemButton
                            selected={sorting === "sizeName"}
                            sx={{maxWidth: 100, position: "absolute", left: 560}}
                            onClick={() => sortingList("sizeName")}>
                            Тип услуги
                            {ascending ? sorting === "sizeName" && <ExpandMoreIcon/> : sorting === "sizeName" &&
                                <ExpandLessIcon/>}
                        </ListItemButton>
                        <ListItemButton
                            selected={sorting === "cityName"}
                            sx={{maxWidth: 150, position: "absolute", left: 650}}
                            onClick={() => sortingList("cityName")}>
                            Город
                            {ascending ? sorting === "cityName" && <ExpandMoreIcon/> : sorting === "cityName" &&
                                <ExpandLessIcon/>}
                        </ListItemButton>
                        <ListItemButton
                            selected={sorting === "price"}
                            sx={{maxWidth: 150, position: "absolute", left: 770}}
                            onClick={() => sortingList("price")}>
                            Цена
                            {ascending ? sorting === "price" && <ExpandMoreIcon/> : sorting === "price" &&
                                <ExpandLessIcon/>}
                        </ListItemButton>
                        <ListItemButton
                            selected={sorting === "status"}
                            sx={{maxWidth: 150, position: "absolute", left: 900}}
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
                            <ListItemText sx={{maxWidth: 150, height: 50, position: "absolute", left: 30}}
                                          primary={order.id}
                            />
                            <ListItemText sx={{maxWidth: 150, height: 50, position: "absolute", left: 120}}
                                          primary={order.name}
                            />
                            <ListItemText sx={{maxWidth: 150, height: 50, position: "absolute", left: 240}}
                                          primary={order.user.id}
                            />
                            <ListItemText sx={{maxWidth: 100, height: 50, position: "absolute", left: 320}}
                                          primary={time}
                            />
                            <ListItemText sx={{maxWidth: 100, height: 50, position: "absolute", left: 440}}
                                          primary={endTime}
                            />
                            <ListItemText sx={{maxWidth: 150, height: 50, position: "absolute", left: 560}}
                                          primary={order.sizeClock.name}
                            />
                            <ListItemText sx={{maxWidth: 150, height: 50, position: "absolute", left: 665}}
                                          primary={citiesList.find(city => city.id === order.cityId)?.name}
                            />


                            <ListItemText sx={{maxWidth: 150, height: 50, position: "absolute", left: 790}}
                                          primary={order.price}
                            />
                            <ListItemText sx={{maxWidth: 150, height: 50, position: "absolute", left: 900}}
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
