import React, {useContext, useEffect, useState} from 'react';
import Modal from '@mui/material/Modal';
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {CircularProgress, FormControlLabel, Radio, RadioGroup, Rating, TextField, Tooltip} from "@mui/material";
import {Context} from "../../../index";
import {fetchAlLOrders, updateOrder} from "../../../http/orderAPI";
import SelectorSize from "../../orderPageComponents/SelectorSize";
import SelectorCity from "../../SelectorCity";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import ruLocale from "date-fns/locale/ru";
import {DatePicker, TimePicker} from "@mui/lab";
import {fetchMastersForOrder} from "../../../http/masterAPI";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
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
                                orderToEdit
                            }) => {
    let {cities, size, masters, orders} = useContext(Context)
    const [error, setError] = useState(false)
    const [errorTimePicker, setErrorTimePicker] = useState(false)
    const [errorDatePicket, setErrorDatePicker] = useState(false)
    const [name, setName] = useState(orderToEdit.name);
    const [email, setEmail] = useState(orderToEdit.user.email);
    const [date, setDate] = useState(dateToEdit);
    const [time, setTime] = useState(timeToEdit);
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
    const getMasters = () => {
        setLoading(true)
        fetchMastersForOrder(cityChosen, date, time, sizeClock, masters.page, 3).then(
            (res) => {
                if (res.status === 204) {
                    setFreeMasters([])
                    return
                }
                setFreeMasters(res.data.rows)
                masters.setMasters(res.data.rows);
                masters.setTotalCount(res.data.count);
            },
            () => {
                masters.setIsEmpty(true);
            }
        ).finally(() => setLoading(false));

    }
    useEffect(() => {
        size.setSelectedSize(size.size.find(clock => clock.id == orderToEdit.sizeClockId))
    }, [])
    useEffect(() => {

        if (openList == true) {
            getMasters()
        }
    }, [masters.page, openList])


    const changeOrder = () => {
        if (checkInfo) {
            alertMessage('???? ?????????????? ???????????????? ??????????', true)
            return
        }
        if (time.toLocaleTimeString("en-GB") !== timeToEdit.toLocaleTimeString("en-GB") ||
            dateToEdit.toLocaleDateString("ko-KR") !== date.toLocaleDateString()
            || orderToEdit.masterId !== changedMaster
            || orderToEdit.cityId !== cityChosen || orderToEdit.sizeClockId !== sizeClock) {
            setChangedMaster(true)
        }
        updateOrder({
            id: idToEdit,
            name: name.trim(),
            email: email.trim(),
            date: date,
            time: time,
            cityId: cityChosen,
            masterId: chosenMaster,
            sizeClockId: Number(sizeClock),
            changedMaster: changedMaster
        }).then(res => {
            close()
            alertMessage('?????????? ?????????????? ??????????????', false)
            fetchAlLOrders(orders.page, 8).then(res => {
                if (res.status === 204) {
                    orders.setIsEmpty(true)
                    return
                }
                res.data.rows.map(item => {
                    item.date = new Date(item.date).toLocaleDateString()
                })
                orders.setIsEmpty(false)
                orders.setOrders(res.data.rows)
                orders.setTotalCount(res.data.count)
            }, error => orders.setIsEmpty(true))
        }, err => {
            setError(true)
            alertMessage('???? ?????????????? ???????????????? ??????????.???????????? ??????????', true)
            setOpenList(false)
        })
    }
    const choseMaster = (event, master) => {

        event ? setChosenMaster(event.target.value) : setChosenMaster(master);
    };

    function dateChange(newDate) {
        setDate(newDate);
        setOpenList(false)
        setChosenMaster(null)
        setOpenDate(false)
        setChosenMaster(null)
        setChangedMaster(true)
        setFreeMasters([])
    }

    function timeChange(newDate) {
        setTime(newDate);
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
    let reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    let checkInfo = openList == false || !idToEdit || !name || !email
        || !date || !time || !cityChosen
        || !chosenMaster || !sizeClock || reg.test(email) === false
        || name.length < 3 || errorTimePicker || errorDatePicket
    const validName = blurName && name.length < 3
    const validEmail = blurEmail && reg.test(email) === false
    const checkOpenList = freeMasters.length == 0 && openList === true
    const checkButtonList = errorTimePicker || errorDatePicket
    return (
        <div>
            <Modal
                open={open}
                onClose={close}
            >
                <Box sx={style}>
                    <Box sx={{mt: 2}}>
                        <h3 style={{textAlign: "center"}}>?????????????????? ????????????</h3>
                        <TextField
                            required
                            id="Name"
                            label="???????? ??????"
                            helperText={validName ? "?????? ???????????? ???????? ???????????? 3-?? ????????????????" : false}
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
                            helperText={validEmail ? "?????????????? email ??????????????:clock@clock.com " : ""}
                            id="Email"
                            onFocus={() => setBlurEmail(false)}
                            onBlur={() => setBlurEmail(true)}
                            label="?????? Email"
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
                                          }}
                                          sizeToEdit={() => setSizeClock(size.selectedSize.id)}/>
                            <SelectorCity cityChosen={cityChosen}
                                          editOpen={open}
                                          closeList={() => {
                                              setOpenList(false)
                                              setFreeMasters([])
                                              setChangedMaster(true)
                                          }}
                                          cleanMaster={() => setChosenMaster(null)}
                                          cityToEdit={() => setCityChosen(cities.selectedCity)}/>
                        </Box>
                        <LocalizationProvider sx={{cursor: "pointer"}} dateAdapter={AdapterDateFns}
                                              locale={ruLocale}>
                            <DatePicker
                                mask='__.__.____'
                                label="???????? ????????????"
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
                                label="??????-???? ?????????? ???? ????????????"
                                open={openTime}
                                value={time}
                                onChange={(newValue) => timeChange(newValue)}
                                onError={(e) =>
                                    e ? setErrorTimePicker(true) : setErrorTimePicker(false)}
                                ampm={false}
                                views={["hours"]}
                                minTime={date.toLocaleDateString("ko-KR") == new Date().toLocaleDateString("ko-KR") ?
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
                            ?????????????? ????????????:
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
                                    ?? ?????????????? ?????????? ?????? ?????????????? ????????????
                                </Typography>) : (
                                <Box sx={{flexGrow: 1, maxWidth: "1fr", position: "relative"}}>
                                    <Typography sx={{my: 2,}}>
                                        ?????????????????? ??????????????
                                    </Typography>
                                    <List disablePadding>
                                        <ListItem key={1} divider>
                                            <ListItemText sx={{width: 10}} primary="???"/>
                                            <ListItemText sx={{width: 10}} primary="?????? ??????????????"/>
                                            <ListItemText sx={{width: 10,}} primary="??????????????"/>
                                            <ListItemText sx={{width: 10, pr: 5}} primary="??????????"/>
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
                                                                      <Tooltip title={'?????????????? ??????????????'}
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
                                                    ?????????????????? ???????????????? ???????????????? ?? ?????????????? ??????????
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
                                    onClick={changeOrder}> ????????????????</Button>
                            <Button color="error" sx={{flexGrow: 1, ml: 2}} variant="outlined"
                                    onClick={close}> ??????????????</Button>
                        </Box>
                    </Box>

                </Box>
            </Modal>
        </div>
    );
});

export default EditOrder;
