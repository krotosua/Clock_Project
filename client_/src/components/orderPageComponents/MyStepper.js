import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {useNavigate} from "react-router-dom";
import {FormControlLabel, Radio, RadioGroup, TextField, Tooltip} from "@mui/material";
import SelectorSize from "./SelectorSize";
import SelectorCity from "../SelectorCity";
import {useContext, useState} from "react";
import {Context} from "../../index";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {observer} from "mobx-react-lite";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import {fetchMaster} from "../../http/masterAPI";
import {createOrder, sendMessage} from "../../http/orderAPI";
import {DatePicker, TimePicker} from "@mui/lab";
import {START_ROUTE} from "../../utils/consts";
import ruLocale from 'date-fns/locale/ru'

const steps = ["Заполните форму заказа", "Выбор мастера", "Отправка заказа"];

const MyStepper = observer(() => {
    const {cities, size, masters} = useContext(Context);
    const [activeStep, setActiveStep] = useState(0);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date(0, 0, 0, new Date().getHours() + 1));
    const [minTime, setMinTime] = useState(null)
    const [chosenMaster, setMaster] = useState(null);
    const [sizeClock, setSizeClock] = useState(null);
    const [cityChosen, setCityChosen] = useState(null);
    const [freeMasters, setFreeMasters] = useState([]);
    const [busyMasters, setBusyMasters] = useState([]);
    const [error, setError] = useState(false)
    const navigate = useNavigate();
    const handleNext = () => {
        if (activeStep === 0) {
            setSizeClock(size.selectedSize.id)
            setCityChosen(cities.selectedCity)
            fetchMaster(cities.selectedCity, date).then(
                (res) => {
                    if (res.status === 204) {
                        setFreeMasters([])
                        setBusyMasters([])
                        return
                    }
                    let freeMasters = []
                    let busyMasters = []
                    res.data.rows.map((master,) => {
                        let isFree = busyMaster(master)

                        if (isFree) {
                            return freeMasters.push(master)
                        }
                        return busyMasters.push(master)
                    })
                    setFreeMasters(freeMasters)
                    setBusyMasters(busyMasters)
                    masters.setMasters(res.data.rows);
                },
                (err) => {
                    masters.setIsEmpty(true);
                }
            );

            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        } else if (activeStep === 1 && chosenMaster) {

            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        } else {
            let order = {
                name: name,
                date: date,
                time: time.toLocaleTimeString(),
                email: email,
                cityId: cities.selectedCity,
                masterId: chosenMaster,
                sizeClockId: size.selectedSize.id
            }
            let message = {
                name: name,
                date: date.toLocaleDateString(),
                time: time.toLocaleTimeString(),
                email: email,
                size: size.selectedSize.name,
                masterName: masters.masters.find(master => master.id == chosenMaster).name,
                cityName: cities.cities.find(city => city.id === cityChosen).name
            }
            createOrder(order).then(res => {
                sendMessage(message).then(res => console.log("done"),
                    err => {
                        return setActiveStep(0)
                    })
                cities.setSelectedCity(null)
                size.setSelectedSize({date: "00:00:00"})
                navigate(START_ROUTE)
            }, err => {

                setError(true)
                setMaster(null)
                return setActiveStep(0)
            })

        }
    };
    const handleBack = () => {
        setMaster(null)

        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const choseMaster = (event) => {
        setMaster(event.target.value);
    };

    function busyMaster(master) {
        let isFree = true
        let endHour = Number(time.getHours()) + Number(size.selectedSize.date.slice(0, 2))
        let endTime = (new Date(new Date(time).setHours(endHour, 0, 0)))
        for (let i = 0; i < master.orders.length; i++) {
            let order = master.orders[i];
            let sizeOrder = order.sizeClockId
            let startTimeOrder = order.time
            let rangeTime = size.size
                .find(size => size.id === sizeOrder)
                .date.slice(0, 2)
            let endTimeOrder = new Date(new Date()
                .setHours(+rangeTime + +startTimeOrder.slice(0, 2), 0, 0))
                .toLocaleTimeString()
            if (time.toLocaleTimeString() >= startTimeOrder &&
                time.toLocaleTimeString() < endTimeOrder ||
                endTime.toLocaleTimeString() > startTimeOrder &&
                endTime.toLocaleTimeString() <= endTimeOrder) {
                isFree = false
                break
            }
        }
        return isFree
    }

    return (
        <Box sx={{width: "100%"}}>
            <Stepper activeStep={activeStep}>
                {steps.map((label) => {
                    const stepProps = {};
                    const labelProps = {};
                    return (
                        <Step key={label} {...stepProps}>
                            <StepLabel {...labelProps}>{label}</StepLabel>
                        </Step>
                    );
                })}
            </Stepper>

            {activeStep === 0 || activeStep === steps.length - 1 ? (

                    <Box sx={{mt: 2}}>
                        <TextField
                            required
                            readOnly={activeStep === steps.length - 1}
                            id="Name"
                            label="Ваше имя"
                            helperText="Имя должно быть больше 3-х символов"
                            variant="outlined"
                            value={name}
                            fullWidth
                            onChange={(e) => setName(e.target.value)}
                        />
                        <TextField
                            required
                            sx={{mt: 1}}
                            readOnly={activeStep === steps.length - 1}
                            error={error}
                            helperText={error ? "Email не подходящий" : ""}
                            id="Email"
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
                            <SelectorSize sizeClock={sizeClock} readOnly={activeStep === steps.length - 1}/>
                            <SelectorCity cityChosen={cityChosen} readOnly={activeStep === steps.length - 1}/>
                        </Box>
                        <LocalizationProvider dateAdapter={AdapterDateFns} locale={ruLocale}>
                            <DatePicker
                                mask='__.__.____'
                                label="Выберите день заказа"
                                value={date}
                                readOnly={activeStep === steps.length - 1}
                                onChange={(newDate) => {
                                    setDate(newDate);
                                }}
                                minDate={new Date()}
                                renderInput={(params) => <TextField sx={{mr: 2}} {...params} />}
                            />
                        </LocalizationProvider>

                        <LocalizationProvider dateAdapter={AdapterDateFns}>

                            <TimePicker
                                label="Выберите время"
                                value={time}
                                onChange={(newValue) => {
                                    setTime(newValue);
                                }}
                                readOnly={activeStep === steps.length - 1}
                                ampm={false}
                                views={["hours"]}
                                minTime={date.toLocaleDateString() == new Date().toLocaleDateString() ?
                                    new Date(0, 0, 0, new Date().getHours() + 1) :
                                    new Date(0, 0, 0, 8)}
                                maxTime={new Date(0, 0, 0, 22)}
                                renderInput={(params) =>
                                    <TextField helperText="Заказы принимаются с 8:00 до 22:00"  {...params} />}
                            />
                        </LocalizationProvider>


                        <Box sx={{display: "flex", flexDirection: "row", justifyContent: "space-between", pt: 2}}>
                            {activeStep === 0 ? <Button
                                    color="inherit"
                                    onClick={() => navigate(START_ROUTE)}
                                    sx={{mr: 1}}
                                >
                                    На начальную страницу
                                </Button> :
                                <Button
                                    color="inherit"
                                    disabled={activeStep === 0}
                                    onClick={handleBack}
                                    sx={{mr: 1}}
                                >
                                    Назад
                                </Button>}
                            <Button onClick={handleNext}
                                    disabled={name.length < 3 ||
                                        !date ||
                                        !time && !email ||
                                        size.selectedSize.date === "00:00:00" ||
                                        !cities.selectedCity}>

                                {activeStep === steps.length - 1 ? "Отправить заказ" : "Дальше"}
                            </Button>
                        </Box>
                    </Box>
                ) :
                ///////////////////////////////////////////////////////////////////////////////////////////////////
                (
                    <Box sx={{mt: 2}}>
                        <Box sx={{flexGrow: 1, maxWidth: "1fr"}}>
                            <Typography sx={{my: 4,}}>
                                Свободные мастера
                            </Typography>
                            <List disablePadding>
                                <ListItem key={1} divider
                                >
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
                                    {freeMasters.length == 0 ? (
                                        <Typography sx={{mb: 2}}>
                                            Список пуст
                                        </Typography>
                                    ) : (
                                        freeMasters.map((master, index) => {
                                            let isFree = true
                                            return (
                                                <ListItem key={master.id}
                                                          divider
                                                          secondaryAction={
                                                              isFree ?
                                                                  <Tooltip title={'Выбрать мастера'}
                                                                           placement="right"
                                                                           arrow>
                                                                      <FormControlLabel
                                                                          value={master.id}
                                                                          control={<Radio/>}
                                                                          label=""/>
                                                                  </Tooltip> : "Занят"
                                                          }
                                                >
                                                    <ListItemText sx={{width: 10}}
                                                                  primary={index + 1}/>
                                                    <ListItemText sx={{width: 10}}
                                                                  primary={master.name}/>
                                                    <ListItemText sx={{width: 10}}
                                                                  primary={master.rating}/>
                                                    <ListItemText sx={{width: 10}}
                                                                  primary={master.city.name}/>
                                                </ListItem>
                                            );
                                        })

                                    )}
                                    <Typography sx={{mt: 4, mb: 2}}>
                                        Занятые мастера
                                    </Typography>
                                    {busyMasters.length == 0 ? (
                                        <Typography sx={{mb: 2}}>
                                            Список пуст
                                        </Typography>
                                    ) : (
                                        busyMasters.map((master, index) => {
                                            let isFree = false
                                            return (
                                                <ListItem key={master.id}
                                                          divider
                                                          secondaryAction={
                                                              isFree ?
                                                                  <Tooltip title={'Выбрать мастера'}
                                                                           placement="right"
                                                                           arrow>
                                                                      <FormControlLabel
                                                                          value={master.id}
                                                                          control={<Radio/>}
                                                                          label=""/>
                                                                  </Tooltip> : "Занят"
                                                          }
                                                >
                                                    <ListItemText sx={{width: 10}}
                                                                  primary={index + 1}/>
                                                    <ListItemText sx={{width: 10}}
                                                                  primary={master.name}/>
                                                    <ListItemText sx={{width: 10}}
                                                                  primary={master.rating}/>
                                                    <ListItemText sx={{width: 10}}
                                                                  primary={master.city.name}/>
                                                </ListItem>
                                            )
                                        }))}
                                </RadioGroup>
                            </List>
                        </Box>

                        <Box sx={{display: "flex", flexDirection: "row", justifyContent: "space-between", pt: 2}}>
                            <Button
                                color="inherit"
                                onClick={handleBack}
                                sx={{mr: 1}}
                            >
                                Назад
                            </Button>
                            <Button onClick={handleNext}
                                    disabled={!chosenMaster}>
                                Дальше
                            </Button>
                        </Box>
                    </Box>
                )}
        </Box>
    );
});
export default MyStepper;
