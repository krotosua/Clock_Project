import React, {useContext, useEffect, useState} from 'react';
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
import {Context} from "../../../index";
import {updateOrder} from "../../../http/orderAPI";
import SelectorSize from "../../orderPageComponents/SelectorSize";
import SelectorCity from "../../SelectorCity";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import ruLocale from "date-fns/locale/ru";
import {DatePicker, TimePicker} from "@mui/lab";
import {fetchMastersForOrder} from "../../../http/masterAPI";
import {observer} from "mobx-react-lite";
import PagesOrder from "../../orderPageComponents/Pages";


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
const EditOrder = observer(({
                                open, onClose, alertMessage,
                                idToEdit,
                                dateToEdit,
                                timeToEdit,
                                orderToEdit,
                                getOrders
                            }) => {
    let {cities, size, masters, orders} = useContext(Context)
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
    const [price, setPrice] = useState(orderToEdit.price)
    const getMasters = async () => {
        setLoading(true)
        try {
            const res = await fetchMastersForOrder(cityChosen, new Date(new Date(date).setHours(time.getHours(), 0, 0)), sizeClock, masters.page, 3)
            if (res.status === 204) {
                setFreeMasters([])
                return
            }
            setFreeMasters(res.data.rows)
            masters.setMasters(res.data.rows);
            masters.setTotalCount(res.data.count);
        } catch (e) {
            masters.setIsEmpty(true);
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        size.setSelectedSize(size.size.find(clock => clock.id === orderToEdit.sizeClockId))
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
        if (time.toLocaleTimeString("uk-UA") !== timeToEdit.toLocaleTimeString("uk-UA") ||
            dateToEdit.toLocaleDateString("uk-UA") !== date.toLocaleDateString("uk-UA")
            || orderToEdit.masterId !== changedMaster
            || orderToEdit.cityId !== cityChosen || orderToEdit.sizeClockId !== sizeClock) {
            setChangedMaster(true)
        }
        const changeInfo = {
            id: idToEdit,
            name: name.trim(),
            email: email.trim(),
            time: new Date(new Date(date).setHours(time.getHours(), 0, 0)),
            cityId: cityChosen,
            masterId: chosenMaster,
            sizeClockId: Number(sizeClock),
            changedMaster: changedMaster,
            price
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
        setTime(new Date(new Date().setUTCHours(newValue.getUTCHours(), 0, 0)));
        setOpenList(false)
        setChosenMaster(null)
        setOpenTime(false)
        setChosenMaster(null)
        setChangedMaster(true)
        setFreeMasters([])
    }

    const close = () => {
        setError(false)
        masters.setMasters([]);
        masters.setPage(1);
        onClose()
    }
    //--------------------Validation
    const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    const checkInfo = !openList || !idToEdit || !name || !email
        || !date || !time || !cityChosen
        || !chosenMaster || !sizeClock || reg.test(email) === false
        || name.length < 3 || errorTimePicker || errorDatePicket
    const validName = blurName && name.length < 3
    const validEmail = blurEmail && reg.test(email) === false
    const checkOpenList = freeMasters.length === 0 && openList === true
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
                                          cleanMaster={() => setChosenMaster(null)}
                                          closeList={() => {
                                              setOpenList(false)
                                              setFreeMasters([])
                                              setChangedMaster(true)
                                              setPrice(size.selectedSize.date.slice(0, 2) * cities.cities
                                                  .find(city => city.id === cities.selectedCity).price)
                                          }}
                                          sizeToEdit={() => setSizeClock(size.selectedSize.id)}/>
                            <SelectorCity cityChosen={cityChosen}
                                          editOpen={open}
                                          closeList={() => {
                                              setOpenList(false)
                                              setFreeMasters([])
                                              setChangedMaster(true)
                                              setPrice(size.selectedSize.date.slice(0, 2) * cities.cities
                                                  .find(city => city.id === cities.selectedCity).price)
                                          }}
                                          cleanMaster={() => setChosenMaster(null)}
                                          cityToEdit={() => setCityChosen(cities.selectedCity)}/>
                        </Box>
                        <Box> Стоимость услуги: <b>{price}</b></Box>
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
                                label="Кол-во часов на ремонт"
                                open={openTime}
                                value={time}
                                onChange={(newValue) => timeChange(newValue)}
                                onError={(e) =>
                                    e ? setErrorTimePicker(true) : setErrorTimePicker(false)}
                                ampm={false}
                                views={["hours"]}
                                minTime={date.toLocaleDateString("uk-UA") == new Date().toLocaleDateString("uk-UA") ?
                                    new Date(0, 0, 0, new Date().getHours() + 1) :
                                    new Date(0, 0, 0, 8)}
                                maxTime={new Date(0, 0, 0, 22)}
                                renderInput={(params) =>
                                    <TextField
                                        onClick={() => setOpenTime(true)}
                                        sx={{
                                            '& .MuiInputBase-input': {
                                                cursor: "pointer"
                                            }
                                        }}
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
                                            {(openList ? freeMasters.map((master, index) => {
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
                                        {openList == true ? <Box sx={{display: "flex", justifyContent: "center"}}>
                                            <PagesOrder context={masters}/>
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
});

export default EditOrder;
