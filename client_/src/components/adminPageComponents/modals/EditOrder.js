import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    CircularProgress,
    Divider,
    FormControlLabel,
    List,
    ListItem,
    ListItemText,
    Modal,
    Radio,
    RadioGroup,
    Rating,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";
import {updateOrder} from "../../../http/orderAPI";
import SelectorSize from "../../orderPageComponents/SelectorSize";
import SelectorCity from "../../SelectorCity";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import ruLocale from "date-fns/locale/ru";
import {DatePicker, TimePicker} from "@mui/lab";
import {fetchMastersForOrder} from "../../../http/masterAPI";
import PagesOrder from "../../orderPageComponents/Pages";
import {addHours, getHours, isSameDay, isSameHour, isToday, set} from "date-fns";
import {useDispatch, useSelector} from "react-redux";
import {
    setIsEmptyMasterAction,
    setMasterAction,
    setPageMasterAction,
    setTotalCountMasterAction
} from "../../../store/MasterStore";
import {setSelectedSizeAction} from "../../../store/SizeStore";
import {setSelectedCityAction} from "../../../store/CityStore";


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};
const EditOrder = ({
                       open, onClose, alertMessage,
                       idToEdit,
                       dateToEdit,
                       timeToEdit,
                       orderToEdit,
                       getOrders
                   }) => {
    const dispatch = useDispatch()
    const cities = useSelector(state => state.city)
    const size = useSelector(state => state.sizes)
    const masters = useSelector(state => state.masters)
    const [error, setError] = useState(false)
    const [errorTimePicker, setErrorTimePicker] = useState(false)
    const [errorDatePicket, setErrorDatePicker] = useState(false)
    const [name, setName] = useState(orderToEdit.name);
    const [email, setEmail] = useState(orderToEdit.user.email);
    const [date, setDate] = useState(new Date(orderToEdit.time));
    const [time, setTime] = useState(new Date(new Date().setUTCHours(new Date(orderToEdit.time).getUTCHours(), 0, 0)));
    const [chosenMaster, setChosenMaster] = useState(orderToEdit.masterId);
    const [freeMasters, setFreeMasters] = useState([]);
    const [sizeClock, setSizeClock] = useState(orderToEdit.sizeClockId);
    const [cityChosen, setCityChosen] = useState(orderToEdit.cityId);
    const [blurName, setBlurName] = useState(false)
    const [blurEmail, setBlurEmail] = useState(false)
    const [loading, setLoading] = useState(false)
    const [openList, setOpenList] = useState(true)
    const [openDate, setOpenDate] = useState(false)
    const [openTime, setOpenTime] = useState(false)
    const [changedMaster, setChangedMaster] = useState(false)
    const getMasters = async () => {
        setLoading(true)
        try {
            console.log(cityChosen)
            const res = await fetchMastersForOrder(cities.selectedCity.id, set(new Date(date), {
                    hours: getHours(time),
                    minutes: 0,
                    seconds: 0
                }),
                size.selectedSize.id, masters.page, 3)
            if (res.status === 204) {
                dispatch(setMasterAction([]))
                dispatch(setIsEmptyMasterAction(true))
                return
            }
            dispatch(setMasterAction(res.data.rows))
            dispatch(setTotalCountMasterAction(res.data.count))
            dispatch(setIsEmptyMasterAction(false))
        } catch (e) {
            dispatch(setIsEmptyMasterAction(true))
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        dispatch(setSelectedCityAction(cities.cities.find(city => city.id === orderToEdit.cityId)))
        dispatch(setSelectedSizeAction(size.sizes.find(clock => clock.id === orderToEdit.sizeClockId)))
    }, [])
    useEffect(async () => {
        if (openList) {
            await getMasters()
        }
    }, [masters.page, openList])

    const changeOrder = async () => {
        if (checkInfo) {
            alertMessage('Не удалось изменить заказ', true)
            return
        }
        if (!isSameHour(time, timeToEdit) ||
            !isSameDay(dateToEdit, date)
            || orderToEdit.masterId !== changedMaster
            || orderToEdit.cityId !== cityChosen || orderToEdit.sizeClockId !== sizeClock) {
            setChangedMaster(true)
        }
        const changeInfo = {
            id: idToEdit,
            name: name.trim(),
            email: email.trim(),
            time: set(new Date(date), {hours: getHours(time), minutes: 0, seconds: 0}),
            cityId: cityChosen,
            masterId: chosenMaster,
            sizeClockId: Number(sizeClock),
            changedMaster: changedMaster,
            price: size.selectedSize.date.slice(0, 2) * cities.selectedCity.price
        }
        try {
            await updateOrder(changeInfo)
            close()
            alertMessage('Заказ успешно изменен', false)
            await getOrders()
        } catch (e) {
            setError(true)
            alertMessage('Не удалось изменить заказ.Мастер занят', true)
            setOpenList(false)
        }
    }
    const choseMaster = (event, master) => {
        event ? setChosenMaster(event.target.value) : setChosenMaster(master);
    };

    const dateChange = (newDate) => {
        setDate(newDate);
        setOpenList(false)
        setChosenMaster(null)
        setOpenDate(false)
        setChosenMaster(null)
        setChangedMaster(true)
        setFreeMasters([])
    }

    const timeChange = (newValue) => {
        setTime(set(new Date(), {hours: getHours(newValue), minutes: 0, seconds: 0}));
        setOpenList(false)
        setChosenMaster(null)
        setOpenTime(false)
        setChosenMaster(null)
        setChangedMaster(true)
        setFreeMasters([])
    }

    const close = () => {
        setError(false)
        dispatch(setMasterAction([]))
        dispatch(setPageMasterAction(1))
        onClose()
    }
    const closeList = () => {
        dispatch(setPageMasterAction(1))
        setOpenList(false)
        setFreeMasters([])
        setChangedMaster(true)
        setChosenMaster(null)
    }
    //--------------------Validation
    const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    const checkInfo = !openList || !idToEdit || !name || !email
        || !date || !time || !cityChosen
        || !chosenMaster || !sizeClock || reg.test(email) === false
        || name.length < 3 || errorTimePicker || errorDatePicket
    const validName = blurName && name.length < 3
    const validEmail = blurEmail && reg.test(email) === false
    const checkOpenList = masters.isEmpty && openList === true
    const checkButtonList = errorTimePicker || errorDatePicket
    return (
        <div>
            <Modal
                open={open}
                onClose={close}
            >
                <Box sx={style}>
                    <Box sx={{mt: 2}}>
                        <h3 style={{textAlign: "center"}}>Изменение заказа</h3>
                        <TextField
                            required
                            id="Name"
                            label="Ваше имя"
                            helperText={validName ? "Имя должно быть больше 3-х символов" : false}
                            variant="outlined"
                            value={name}
                            error={validName}
                            onFocus={() => setBlurName(false)}
                            onBlur={() => setBlurName(true)}
                            fullWidth
                            onChange={(e) => setName(e.target.value)}
                        />
                        <TextField
                            required
                            sx={{mt: 2}}
                            error={validEmail}
                            helperText={validEmail ? "Введите email формата:clock@clock.com " : ""}
                            id="Email"
                            onFocus={() => setBlurEmail(false)}
                            onBlur={() => setBlurEmail(true)}
                            label="Ваш Email"
                            type="email"
                            variant="outlined"
                            value={email}
                            fullWidth
                            onChange={(e) => {
                                setEmail(e.target.value)
                                setError(false)
                            }}
                        />
                        <Box
                            sx={{display: "grid", gridTemplateColumns: "repeat(2, 1fr)", my: 2}}
                        >
                            <SelectorSize sizeClock={sizeClock}
                                          editOpen={open}
                                          closeList={closeList}
                                          sizeToEdit={() => setSizeClock(size.selectedSize.id)}/>
                            <SelectorCity cityChosen={cityChosen}
                                          editOpen={open}
                                          closeList={closeList}
                                          cityToEdit={() => setCityChosen(cities.selectedCity.id)}/>
                        </Box>
                        <Box sx={{mb: 2}}> Стоимость
                            услуги: <b>{size.selectedSize.date.slice(0, 2) * cities.selectedCity.price}</b></Box>
                        <LocalizationProvider sx={{cursor: "pointer"}} dateAdapter={AdapterDateFns}
                                              locale={ruLocale}>
                            <DatePicker
                                mask='__.__.____'
                                label="День заказа"
                                value={date}
                                open={openDate}
                                onChange={(newDate) => dateChange(newDate)}
                                onError={(e) =>
                                    e ? setErrorDatePicker(true) : setErrorDatePicker(false)}
                                minDate={new Date()}
                                renderInput={(params) =>
                                    <TextField onClick={() => setOpenDate(true)}
                                               sx={{
                                                   mr: 2,
                                                   '& .MuiInputBase-input': {
                                                       cursor: "pointer",
                                                   }
                                               }} {...params} />
                                }
                            />
                        </LocalizationProvider>

                        <LocalizationProvider dateAdapter={AdapterDateFns} locale={ruLocale}>
                            <TimePicker
                                readOnly
                                label="Выберите время"
                                value={time}
                                open={openTime}
                                onChange={(newValue) => timeChange(newValue)}
                                onError={(e) =>
                                    e ? setErrorTimePicker(true) : setErrorTimePicker(false)}
                                ampm={false}
                                views={["hours"]}
                                minTime={isToday(date) ?
                                    addHours(set(new Date(), {minutes: 0, seconds: 0}), 1) :
                                    new Date(0, 0, 0, 8)}
                                maxTime={new Date(0, 0, 0, 22)}
                                renderInput={(params) =>
                                    <TextField helperText="Заказы принимаются с 8:00 до 22:00"
                                               sx={{
                                                   '& .MuiInputBase-input': {
                                                       cursor: "pointer"
                                                   }
                                               }}
                                               onClick={() => setOpenTime(true)}
                                               {...params} />}
                            />

                        </LocalizationProvider>

                        {!changedMaster ? <Box>
                            Текущий мастер:
                            <ListItem key={orderToEdit.master.id}
                                      divider
                                      style={{cursor: 'pointer'}}
                                      selected={chosenMaster === orderToEdit.master.id}
                                      onClick={() => choseMaster(null, orderToEdit.master.id)}
                            >
                                <ListItemText sx={{width: 10}}
                                              primary={1}/>
                                <ListItemText sx={{width: 10}}
                                              primary={orderToEdit.master.name}/>
                                <ListItemText sx={{width: 10}}
                                              primary={<Rating
                                                  value={orderToEdit.master.rating}
                                                  readOnly/>}/>

                            </ListItem>

                        </Box> : null}
                        {checkOpenList && loading ?
                            <Box sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                mt: 2
                            }}>
                                <CircularProgress/>
                            </Box>
                            : checkOpenList ? (
                                <Typography variant="h5" sx={{my: 2, textAlign: "center"}}>
                                    В текущее время все мастера заняты
                                </Typography>) : (
                                <Box sx={{flexGrow: 1, maxWidth: "1fr", position: "relative"}}>
                                    <Typography sx={{my: 2,}}>
                                        Свободные мастера
                                    </Typography>
                                    <List disablePadding>
                                        <ListItem key={1} divider>
                                            <ListItemText sx={{width: 10}} primary="№"/>
                                            <ListItemText sx={{width: 10}} primary="Имя мастера"/>
                                            <ListItemText sx={{width: 10,}} primary="Рейтинг"/>
                                            <ListItemText sx={{width: 10, pr: 5}} primary="Город"/>
                                        </ListItem>

                                        <Divider orientation="vertical"/>
                                        <RadioGroup
                                            aria-labelledby="demo-controlled-radio-buttons-group"
                                            name="controlled-radio-buttons-group"
                                            value={chosenMaster}
                                            onChange={choseMaster}
                                        >
                                            {(openList ? masters.masters.map((master, index) => {
                                                    return (
                                                        <ListItem key={master.id}
                                                                  divider
                                                                  style={{cursor: 'pointer'}}
                                                                  selected={chosenMaster === master.id}
                                                                  onClick={() => choseMaster(null, master.id)}
                                                                  secondaryAction={
                                                                      <Tooltip title={'Выбрать мастера'}
                                                                               placement="right"
                                                                               arrow>
                                                                          <FormControlLabel
                                                                              value={master.id}
                                                                              control={<Radio/>}
                                                                              label=""/>
                                                                      </Tooltip>
                                                                  }>
                                                            <ListItemText sx={{width: 10}}
                                                                          primary={index + 1}/>
                                                            <ListItemText sx={{width: 10}}
                                                                          primary={master.name}/>
                                                            <ListItemText sx={{width: 10}}
                                                                          primary={<Rating
                                                                              value={master.rating}
                                                                              readOnly/>}/>
                                                            <ListItemText sx={{width: 10}}
                                                                          primary={master.cities[0].name}/>
                                                        </ListItem>
                                                    );
                                                }) : <Button color="primary" sx={{flexGrow: 1,}} variant="outlined"
                                                             disabled={checkButtonList}
                                                             onClick={() => setOpenList(true)}>
                                                    Проверить свобоных мастеров в текущее время
                                                </Button>

                                            )}

                                        </RadioGroup>
                                        {openList === true ? <Box sx={{display: "flex", justifyContent: "center"}}>
                                            <PagesOrder store={masters} pagesFunction={setPageMasterAction}/>
                                        </Box> : ""}

                                    </List>
                                    {loading ? <CircularProgress size={30}
                                                                 sx={{
                                                                     position: "absolute",
                                                                     right: 10,
                                                                     bottom: 30
                                                                 }}/> : ""}
                                </Box>)}

                        <Box
                            sx={{mt: 2, display: "flex", justifyContent: "space-between"}}
                        >
                            <Button color="success" sx={{flexGrow: 1,}} variant="outlined"
                                    disabled={checkInfo}
                                    onClick={changeOrder}> Изменить</Button>
                            <Button color="error" sx={{flexGrow: 1, ml: 2}} variant="outlined"
                                    onClick={close}> Закрыть</Button>
                        </Box>
                    </Box>

                </Box>
            </Modal>
        </div>
    );
}

export default EditOrder;
