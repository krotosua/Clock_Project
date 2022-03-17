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
import {useContext, useEffect, useState} from "react";
import {Context} from "../../index";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";

import {observer} from "mobx-react-lite";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import {fetchMaster} from "../../http/masterAPI";
import IconButton from "@mui/material/IconButton";

import {createOrder} from "../../http/orderAPI";
import {DatePicker, TimePicker} from "@mui/lab";
import {START_ROUTE} from "../../utils/consts";

const steps = ["Заолните форму заказа", "Выбор мастера", "Отправка заказа"];

const HorizontalLinearStepper = observer(() => {


    const [activeStep, setActiveStep] = useState(0);
    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);
    const {cities, size, masters} = useContext(Context);
    const [date, setDate] = useState(null);
    const [time, setTime] = useState(null);
    const [endTime, setEndTime] = useState(null)
    const [chosenMaster, setMaster] = useState(null);
    const [sizeClock, setSizeClock] = useState(null);
    const [cityChosen, setCityChosen] = useState(null);
    const navigate = useNavigate();


    let correctTime = size.size.find(size => size.id == 1)
    const handleNext = () => {
        if (activeStep === 0) {
            setSizeClock(size.selectedSize)
            setCityChosen(cities.selectedCity)
            if (name.length < 3 ||
                !date ||
                !time && !email ||
                size.selectedSize.date === "00:00:00" ||
                !cities.selectedCity) {
                console.log(size.selectedSize)
                return
            }
            let endHour = Number(time.getHours()) + Number(size.selectedSize.date.slice(0, 2))
            setEndTime(new Date(new Date(time).setHours(endHour, 0, 0)))

            fetchMaster(cities.selectedCity, date).then(
                (res) => {
                    console.log(res.data.rows)
                    if (res.status === 204) {
                        return masters.setIsEmpty(true);
                    }
                    masters.setIsEmpty(false)
                    return masters.setMasters(res.data.rows);
                },
                (err) => {
                    return masters.setIsEmpty(true);
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
            createOrder(order).then(res => {
                cities.setSelectedCity({})
                size.selectedSize({})
            })
            navigate(START_ROUTE);

        }
    };
    const handleBack = () => {

        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const choseMaster = (event) => {
        setMaster(event.target.value);
    };


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
            {activeStep === steps.length - 1 ? (
                <React.Fragment>
                    <Typography sx={{mt: 2, mb: 1}}> <Typography sx={{mt: 2, mb: 1}}>
                        <Box component="form">
                            <TextField
                                required
                                id="Name"
                                label="Ваше имя"
                                variant="outlined"
                                value={name}
                                fullWidth
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                            <TextField
                                required
                                sx={{mt: 2}}
                                id="Email"
                                label="Ващ Email"
                                type="email"
                                variant="outlined"
                                value={email}
                                fullWidth
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(2, 1fr)",
                                    my: 2
                                }}
                            >
                                <SelectorSize sizeClock={sizeClock} readOnly={true}/>
                                <SelectorCity cityChosen={cityChosen} readOnly={true}/>
                            </Box>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Выбранный  день заказа"
                                    value={date}
                                    readOnly
                                    renderInput={(params) => <TextField sx={{mr: 2}} {...params} />}
                                />
                            </LocalizationProvider>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <TimePicker
                                    label="Выбранное время"
                                    value={time}
                                    readOnly
                                    ampm={false}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>

                        </Box>
                    </Typography>
                        <Box sx={{display: "flex", flexDirection: "row", pt: 2}}>
                            <Button
                                color="inherit"
                                disabled={activeStep === 0}
                                onClick={handleBack}
                                sx={{mr: 1}}
                            >
                                Назад
                            </Button>
                            <Box sx={{flex: "1 1 auto"}}/>

                            <Button onClick={handleNext}>
                                {activeStep === steps.length - 1 ? "Отправить заказ" : "Дальше"}
                            </Button>
                        </Box></Typography>
                </React.Fragment>
            ) : activeStep === 0 ? (
                    <React.Fragment>
                        <Typography sx={{mt: 2, mb: 1}}> <Box component="form">
                            <TextField
                                required
                                id="Name"
                                label="Ваше имя"
                                variant="outlined"
                                value={name}
                                fullWidth
                                onChange={(e) => setName(e.target.value)}
                            />
                            <TextField
                                required
                                sx={{mt: 2}}
                                id="Email"
                                label="Ващ Email"
                                type="email"
                                variant="outlined"
                                value={email}
                                fullWidth
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <Box
                                sx={{display: "grid", gridTemplateColumns: "repeat(2, 1fr)", my: 2}}
                            >
                                <SelectorSize sizeClock={sizeClock}/>
                                <SelectorCity cityChosen={cityChosen}/>
                            </Box>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Выберите день заказа"
                                    value={date}
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

                                    ampm={false}
                                    views={["hours"]}
                                    minTime={new Date(0, 0, 0, 8)}
                                    maxTime={new Date(0, 0, 0, 22 - Number(size.selectedSize.date.slice(0, 2)))}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>

                        </Box>
                        </Typography>
                        <Box sx={{display: "flex", flexDirection: "row", pt: 2}}>
                            <Button
                                color="inherit"
                                disabled={activeStep === 0}
                                onClick={handleBack}
                                sx={{mr: 1}}
                            >
                                Назад
                            </Button>
                            <Box sx={{flex: "1 1 auto"}}/>

                            <Button onClick={handleNext}>
                                {activeStep === steps.length - 1 ? "Отправить заказ" : "Дальше"}
                            </Button>
                        </Box>
                    </React.Fragment>
                ) :
                ///////////////////////////////////////////////////////////////////////////////////////////////////
                (
                    <React.Fragment>
                        <Typography sx={{mt: 2, mb: 1}}>
                            <Box sx={{flexGrow: 1, maxWidth: "1fr"}}>
                                <Typography sx={{mt: 4, mb: 2}} variant="h6" component="div">
                                    Свободные мастера
                                </Typography>
                                <List disablePadding>
                                    <ListItem key={1} divider
                                              secondaryAction={

                                                  <IconButton sx={{width: 20}}>
                                                  </IconButton>
                                              }>

                                        <ListItemText sx={{width: 10}} primary="№"/>
                                        <ListItemText sx={{width: 10}} primary="Имя мастера"/>
                                        <ListItemText sx={{width: 10}} primary="Рейтинг"/>
                                        <ListItemText sx={{width: 10}} primary="Город"/>
                                    </ListItem>

                                    <Divider orientation="vertical"/>
                                    <RadioGroup
                                        aria-labelledby="demo-controlled-radio-buttons-group"
                                        name="controlled-radio-buttons-group"
                                        value={chosenMaster}
                                        onChange={choseMaster}
                                    >
                                        {masters.IsEmpty ? (
                                            <h1>Список пуст</h1>
                                        ) : (
                                            masters.masters.map((master, index) => {
                                                let correctTime = size.size.find(size => size.id == master.orders)
                                                console.log(master.orders)
                                                let isFree = true
                                                for (let key in master.orders) {
                                                    if (master.orders[key].time >= time.toLocaleTimeString() &&
                                                        master.orders[key].time < endTime.toLocaleTimeString()) {
                                                        isFree = false
                                                    }
                                                }
                                                return (

                                                    <ListItem key={master.id}
                                                              divider
                                                              secondaryAction={
                                                                  isFree ?
                                                                      <Tooltip title={'Выбрать мастера'}
                                                                               placement="right"
                                                                               arrow>
                                                                          <FormControlLabel value={master.id}
                                                                                            control={<Radio/>}
                                                                                            label=""/>
                                                                      </Tooltip> : "Занят"
                                                              }
                                                    >

                                                        <ListItemText sx={{width: 10}} primary={index + 1}/>
                                                        <ListItemText sx={{width: 10}} primary={master.name}/>
                                                        <ListItemText sx={{width: 10}} primary={master.rating}/>
                                                        <ListItemText sx={{width: 10}} primary={master.city.name}/>
                                                    </ListItem>
                                                );
                                            })
                                        )}
                                    </RadioGroup>
                                </List>
                            </Box>
                        </Typography>
                        <Box sx={{display: "flex", flexDirection: "row", pt: 2}}>
                            <Button
                                color="inherit"
                                disabled={activeStep === 0}
                                onClick={handleBack}
                                sx={{mr: 1}}
                            >
                                Назад
                            </Button>
                            <Box sx={{flex: "1 1 auto"}}/>

                            <Button onClick={handleNext}>
                                {activeStep === steps.length - 1 ? "0" : "Дальше"}
                            </Button>
                        </Box>
                    </React.Fragment>
                )}
        </Box>
    );
});
export default HorizontalLinearStepper;
