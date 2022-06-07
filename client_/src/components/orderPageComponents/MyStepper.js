import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {Link, useNavigate} from "react-router-dom";
import {CircularProgress, FormControlLabel, Radio, RadioGroup, Rating, TextField, Tooltip} from "@mui/material";
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
import {fetchMastersForOrder} from "../../http/masterAPI";
import {createOrder,} from "../../http/orderAPI";
import {DatePicker, TimePicker} from "@mui/lab";
import {START_ROUTE} from "../../utils/consts";
import ruLocale from 'date-fns/locale/ru'
import PagesOrder from "./Pages";

const steps = ["Заполните форму заказа", "Выбор мастера", "Отправка заказа"];

const MyStepper = observer(({alertMessage}) => {
    const {cities, size, masters} = useContext(Context);
    const [activeStep, setActiveStep] = useState(0);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date(0, 0, 0, new Date().getHours() + 1));
    const [chosenMaster, setChosenMaster] = useState(null);
    const [sizeClock, setSizeClock] = useState(null);
    const [cityChosen, setCityChosen] = useState(null);
    const [freeMasters, setFreeMasters] = useState([]);
    const [blurName, setBlurName] = useState(false)
    const [blurEmail, setBlurEmail] = useState(false)
    const [error, setError] = useState(false)
    const [errorTimePicker, setErrorTimePicker] = useState(false)
    const [errorDatePicket, setErrorDatePicker] = useState(false)
    const [loading, setLoading] = useState(true)
    const [openDate, setOpenDate] = useState(false)
    const [openTime, setOpenTime] = useState(false)
    const navigate = useNavigate();
    const handleNext = () => {
        if (activeStep === 0) {
            setLoading(true)
            fetchMastersForOrder(cities.selectedCity, date, time, size.selectedSize.id, masters.page, 3).then(
                (res) => {
                    if (res.status === 204) {
                        setFreeMasters([])
                        return
                    }
                    setFreeMasters(res.data.rows)
                    masters.setMasters(res.data.rows);
                    masters.setTotalCount(res.data.count);
                },
                (err) => {
                    masters.setIsEmpty(true);
                }
            ).finally(() => setLoading(false));
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        } else if (activeStep === 1 && chosenMaster) {
            setChosenMaster(Number(chosenMaster))
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        } else {
            let body = {
                name: name,
                date: date,
                time: time,
                email: email,
                cityId: cityChosen,
                masterId: chosenMaster,
                sizeClockId: size.selectedSize.id
            }
            createOrder(body).then(res => {
                cities.setSelectedCity(null)
                size.setSelectedSize({date: "00:00:00"})
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
            }, err => {
                alertMessage('Мастер занят', true)
                setActiveStep(1)
                setLoading(true)
                fetchMastersForOrder(cities.selectedCity, date, time, size.selectedSize.id).then(
                    (res) => {
                        if (res.status === 204) {
                            setFreeMasters([])
                            return
                        }
                        setFreeMasters(res.data.rows)
                        masters.setMasters(res.data.rows);

                    },
                    (err) => {
                        masters.setIsEmpty(true);
                    }
                ).finally(() => setLoading(false));
            })

        }
    };
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
    const choseMaster = (event, master) => {
        event ? setChosenMaster(event.target.value) : setChosenMaster(master);
    };

    let reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    let checkInfo = !name || !email
        || !date || !time || !cities.selectedCity
        || !size.selectedSize.id || reg.test(email) === false
        || name.length < 3 || errorTimePicker || errorDatePicket


    useEffect(() => {
            if (activeStep === 1) {
                setLoading(true)
                fetchMastersForOrder(cities.selectedCity, date, time.toLocaleTimeString(), size.selectedSize.id, masters.page, 3).then(
                    (res) => {
                        if (res.status === 204) {
                            setFreeMasters([])
                            return
                        }
                        setFreeMasters(res.data.rows)
                        masters.setMasters(res.data.rows);
                        masters.setTotalCount(res.data.count);
                    },
                    (err) => {
                        masters.setIsEmpty(true);
                    }
                ).finally(() => setLoading(false));
            }
        }, [masters.page]
    )


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
            {activeStep === 0 ? (

                <Box sx={{mt: 2}}>

                    <TextField
                        required
                        id="Name"
                        label="Ваше имя"
                        helperText={blurName && name.length < 3 ? "Имя должно быть больше 3-х символов" : ""}
                        variant="outlined"
                        value={name}
                        error={blurName && name.length < 3}
                        onFocus={() => setBlurName(false)}
                        onBlur={() => setBlurName(true)}
                        fullWidth
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        required
                        sx={{mt: 1}}
                        error={blurEmail && reg.test(email) == false}
                        helperText={blurEmail && reg.test(email) == false ? "Введите email формата:clock@clock.com " : ""}
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
                                      cleanMaster={() => setChosenMaster(null)}
                                      setSizeClock={() => setSizeClock(size.selectedSize.id)}/>
                        <SelectorCity cityChosen={cityChosen}
                                      cleanMaster={() => setChosenMaster(null)}
                                      setCityChosen={() => setCityChosen(cities.selectedCity)}
                        />
                    </Box>
                    <LocalizationProvider dateAdapter={AdapterDateFns} locale={ruLocale}>
                        <DatePicker
                            mask='__.__.____'
                            label="Выберите день заказа"
                            disableHighlightToday
                            value={date}
                            open={openDate}
                            onChange={(newDate) => {

                                setDate(newDate);
                                setOpenDate(false)
                                setChosenMaster(null)
                            }}
                            onError={(e) =>
                                e ? setErrorDatePicker(true) : setErrorDatePicker(false)}
                            minDate={new Date()}
                            renderInput={(params) => <TextField onClick={() => setOpenDate(true)}
                                                                sx={{
                                                                    mr: 2,
                                                                    '& .MuiInputBase-input': {
                                                                        cursor: "pointer",
                                                                    }
                                                                }}
                                                                {...params} />}
                        />
                    </LocalizationProvider>

                    <LocalizationProvider dateAdapter={AdapterDateFns} locale={ruLocale}>
                        <TimePicker
                            readOnly
                            label="Выберите время"
                            value={time}
                            open={openTime}
                            onChange={(newValue) => {
                                setTime(new Date(new Date().setUTCHours(newValue.getUTCHours(),0,0)));
                                setOpenTime(false)
                                setChosenMaster(null)
                            }}
                            onError={(e) =>
                                e ? setErrorTimePicker(true) : setErrorTimePicker(false)}
                            ampm={false}
                            views={["hours"]}
                            minTime={date.toLocaleDateString('uk-UA') == new Date().toLocaleDateString('uk-UA') ?
                                new Date(0, 0, 0, new Date().getHours() + 1) :
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
                    <Box sx={{display: "flex", flexDirection: "row", justifyContent: "space-between", pt: 2}}>
                        {activeStep === 0 ?
                            <Link to={START_ROUTE}
                                  style={{textDecoration: 'none', color: 'black'}}>
                                <Button
                                    color="inherit"
                                    onClick={() => {
                                        navigate(START_ROUTE)
                                    }}
                                    sx={{mr: 1}}
                                >
                                    На начальную страницу
                                </Button>
                            </Link>
                            :
                            <Button
                                color="inherit"
                                disabled={activeStep === 0}
                                onClick={handleBack}
                                sx={{mr: 1}}
                            >
                                Назад
                            </Button>}
                        <Button onClick={handleNext}
                                disabled={checkInfo}>
                            {activeStep === steps.length - 1 ? "Отправить заказ" : "Дальше"}
                        </Button>
                    </Box>
                </Box>
            ) : activeStep === steps.length - 1 ? (
                    <Box sx={{mt: 2}}>
                        <Box sx={{ml: 4}}>
                            <Box sx={{mb: 1}}> Ваше имя: <b>{name}</b> </Box>
                            <Box sx={{mb: 1}}> Ваш email:<b>{email}</b> </Box>
                            <Box sx={{mb: 1}}>Выбранный размер часов:<b>{size.selectedSize.name}</b></Box>
                            <Box sx={{mb: 1}}> Город где сделан
                                заказ: <b>{cities.cities.find(city => city.id === cityChosen).name}</b></Box>
                            <Box sx={{mb: 1}}> Дата заказа и время заказа: <b>{date.toLocaleDateString("uk-UA")} </b></Box>
                            <Box sx={{mb: 1}}> Время заказа: <b>{time.toLocaleTimeString("uk-UA")}</b></Box>
                            <Box> Имя мастера: <b>{freeMasters.find(item => item.id == chosenMaster).name}</b></Box>
                        </Box>

                        <Box sx={{display: "flex", flexDirection: "row", justifyContent: "space-between", pt: 2}}>
                            {activeStep === 0 ?
                                <Link to={START_ROUTE}
                                      style={{textDecoration: 'none', color: 'black'}}>
                                    <Button
                                        color="inherit"
                                        onClick={() => {
                                            navigate(START_ROUTE)
                                        }}
                                        sx={{mr: 1}}
                                    >
                                        На начальную страницу
                                    </Button>
                                </Link>
                                :
                                <Button
                                    color="inherit"
                                    disabled={activeStep === 0}
                                    onClick={handleBack}
                                    sx={{mr: 1}}
                                >
                                    Назад
                                </Button>}
                            <Button onClick={handleNext}
                                    disabled={checkInfo || !chosenMaster}>
                                Отправить заказ
                            </Button>
                        </Box>
                    </Box>) :
                ///////////////////////////////////////////////////////////////////////////////////////////////////
                activeStep === steps.length - 2 ? (
                    <Box sx={{mt: 2, position: "relative"}}>
                        {loading ?
                            (
                                <Box sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}>
                                    <CircularProgress/>
                                </Box>
                            )
                            : freeMasters.length == 0 ? (
                                <Typography variant="h4" sx={{my: 2, textAlign: "center"}}>
                                    Все мастера заняты
                                </Typography>) : (
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
                                                    Все мастера заняты
                                                </Typography>
                                            ) : (
                                                freeMasters.map((master, index) => {
                                                    let isFree = true
                                                    return (
                                                        <ListItem key={master.id}
                                                                  divider
                                                                  style={{cursor: 'pointer'}}
                                                                  selected={chosenMaster == master.id}
                                                                  onClick={() => choseMaster(null, master.id)}
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
                                                                          primary={<Rating name="read-only"
                                                                                           value={master.rating}
                                                                                           readOnly/>}/>
                                                            <ListItemText sx={{width: 10}}
                                                                          primary={master.cities[0].name}/>
                                                        </ListItem>
                                                    );
                                                })
                                            )}
                                        </RadioGroup>
                                    </List>
                                    <Box sx={{display: "flex", justifyContent: "center"}}>
                                        <PagesOrder context={masters}/>

                                    </Box>
                                    {loading ? <CircularProgress size={30}
                                                                 sx={{
                                                                     position: "absolute",
                                                                     right: 5,
                                                                     bottom: 85
                                                                 }}/> : ""}
                                </Box>)
                        }

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
                ) : (
                    <Box sx={{display: 'flex', justifyContent: "center", mt: 2}}>
                        <Box><Typography variant="h4" sx={{my: 2}}>Заказ успешно создан</Typography>
                            <Link to={START_ROUTE}
                                  style={{textDecoration: 'none', color: 'white'}}>
                                <Button variant="outlined" fullWidth navigate={START_ROUTE}>На главную</Button>
                            </Link>
                        </Box>
                    </Box>

                )}
        </Box>
    );
});
export default MyStepper;
