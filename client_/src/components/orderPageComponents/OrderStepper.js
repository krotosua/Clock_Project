import * as React from "react";
import {
    Box,
    Stepper,
    Step,
    StepLabel,
    Button,
    Typography,
    CircularProgress,
    FormControlLabel,
    Radio,
    RadioGroup,
    Rating,
    TextField,
    Tooltip,
    List,
    ListItem,
    ListItemText,
    Divider,
    Popover

} from "@mui/material";
import {useContext, useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {fetchMastersForOrder} from "../../http/masterAPI";
import {observer} from "mobx-react-lite";
import {createOrder} from "../../http/orderAPI";
import {checkEmail} from "../../http/userAPI";
import {CUSTOMER_ORDER_ROUTE, START_ROUTE} from "../../utils/consts";
import SelectorSize from "./SelectorSize";
import SelectorCity from "../SelectorCity";
import {Context} from "../../index";
import {LocalizationProvider, DatePicker, TimePicker} from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import ruLocale from 'date-fns/locale/ru'
import PagesOrder from "./Pages";
import Login from "../authPageComponents/Login";

const steps = ["Заполните форму заказа", "Выбор мастера", "Отправка заказа"];

const OrderStepper = observer(({alertMessage}) => {
    const {cities, size, masters, user} = useContext(Context);
    const [activeStep, setActiveStep] = useState(0);
    const [name, setName] = useState("");
    const [changeName, setChangeName] = useState(null)
    const [email, setEmail] = useState("");
    const [emailExists, setEmailExists] = useState(false)
    const [regCustomer, setRegCustomer] = useState(null)
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date(new Date().setUTCHours(new Date().getUTCHours() + 1, 0, 0)));
    const [chosenMaster, setChosenMaster] = useState(null);
    const [sizeClock, setSizeClock] = useState(null);
    const [cityChosen, setCityChosen] = useState(null);
    const [freeMasters, setFreeMasters] = useState([]);
    const [error, setError] = useState(false)
    const [errorTimePicker, setErrorTimePicker] = useState(false)
    const [errorDatePicket, setErrorDatePicker] = useState(false)
    const [blurName, setBlurName] = useState(false)
    const [blurEmail, setBlurEmail] = useState(false)
    const [loading, setLoading] = useState(false)
    const [openDate, setOpenDate] = useState(false)
    const [openTime, setOpenTime] = useState(false)
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [isAuth, setIsAuth] = useState(false)
    const navigate = useNavigate();


    const handleClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const getMasters = async () => {
        setLoading(true)
        try {
            const res = await fetchMastersForOrder(cities.selectedCity, new Date(new Date(date).setHours(time.getHours(), 0, 0)),
                size.selectedSize.id, masters.page, 3)
            if (res.status === 204) {
                setFreeMasters([])
                return
            }
            setFreeMasters(res.data.rows)
            masters.setMasters(res.data.rows);
            masters.setTotalCount(res.data.count);
        } catch (e) {
            return masters.setIsEmpty(true);
        }
        setLoading(false)
    }

    const handleNext = (event) => {
        if (user.isAuth || regCustomer !== null) {
            if (user.userName !== name && changeName === null) {
                setEmailExists(false)
                setRegCustomer(false)
                setAnchorEl(event.currentTarget)
                return
            }
            if (activeStep === 0) {
                getMasters()
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
            } else if (activeStep === 1 && chosenMaster) {
                setChosenMaster(Number(chosenMaster))
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
            } else {

                const orderInfo = {
                    name,
                    time: new Date(new Date(date).setHours(time.getHours(), 0, 0)),
                    email,
                    changeName,
                    cityId: cityChosen,
                    masterId: chosenMaster,
                    sizeClockId: size.selectedSize.id,
                    regCustomer,
                    price: size.selectedSize.date.slice(0, 2) * cities.cities
                        .find(city => city.id === cities.selectedCity).price
                }
                createOrder(orderInfo).then(res => {
                    cities.setSelectedCity(null)
                    size.setSelectedSize({date: "00:00:00"})
                    masters.setMasters([])
                    if (changeName) {
                        user.setUserName(name)
                    }
                    setActiveStep((prevActiveStep) => prevActiveStep + 1);
                }, err => {
                    alertMessage('Мастер занят', true)
                    setActiveStep(1)
                    setLoading(true)
                    getMasters()
                })

            }
        } else {
            setLoading(true)
            checkEmail(email).then(res => {
                if (res.status === 204) {
                    setEmailExists(false)
                } else if (res.status === 200) {
                    setEmailExists(true)
                }
            }).finally(() => setLoading(false))
            setAnchorEl(event.currentTarget)
        }
    };

    const handleBack = () => {
        setAnchorEl(null)
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
    const choseMaster = (event, master) => {
        event ? setChosenMaster(event.target.value) : setChosenMaster(master);
    };

    const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    const checkInfo = !name || !email
        || !date || !time || !cities.selectedCity
        || !size.selectedSize.id || reg.test(email) === false
        || name.length < 3 || errorTimePicker || errorDatePicket

    useEffect(() => {
        if (user.isAuth) {
            user.userRole !== "ADMIN" ? setName(user.userName) : setName("")
            setEmail(user.user.email)
        }

    }, [])

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
    }, [masters.page])


    return (
        isAuth ?
            <Box>
                <Login
                    orderEmail={email}
                    getMasters={() => getMasters()}
                    nextPage={() => {
                        setActiveStep(0)
                        setIsAuth(false)
                    }}/>
            </Box>
            :

            <Box sx={{width: "100%"}}>
                <Stepper activeStep={activeStep}>
                    {steps.map((label) => {
                        return (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
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
                            error={blurEmail && reg.test(email) === false}
                            helperText={blurEmail && reg.test(email) === false ? "Введите email формата:clock@clock.com " : ""}
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
                            <SelectorCity cityChosen={cityChosen}
                                          cleanMaster={() => setChosenMaster(null)}
                                          setCityChosen={() => setCityChosen(cities.selectedCity)}
                            />
                            <SelectorSize sizeClock={sizeClock}
                                          cleanMaster={() => setChosenMaster(null)}
                                          setSizeClock={() => setSizeClock(size.selectedSize.id)}/>
                        </Box>
                        <Box sx={{my: 2}}>Стоимость
                            услуги: <b>{size.selectedSize.date !== "00:00:00" && cities.selectedCity ? size.selectedSize.date.slice(0, 2) * cities.cities
                                .find(city => city.id === cities.selectedCity).price + " грн" : null} </b></Box>
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
                                    setTime(new Date(new Date().setUTCHours(newValue.getUTCHours(), 0, 0)));
                                    setOpenTime(false)
                                    setChosenMaster(null)
                                }}
                                onError={(e) =>
                                    e ? setErrorTimePicker(true) : setErrorTimePicker(false)}
                                ampm={false}
                                views={["hours"]}
                                minTime={date.toLocaleDateString('uk-UA') === new Date().toLocaleDateString('uk-UA') ?
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
                            <Popover
                                id={id}
                                open={open}
                                anchorEl={anchorEl}
                                onClose={handleClose}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'center',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'center',
                                }}
                            >
                                {loading ?
                                    <Box sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}>
                                        <CircularProgress/>
                                    </Box> :
                                    emailExists ?
                                        <Box sx={{display: 'flex', flexDirection: "column", mb: 1}}>
                                            <Typography sx={{p: 2}}>
                                                Прежде чем продолжить - авторизируйтесь
                                            </Typography>
                                            <Button onClick={() => {
                                                setIsAuth(true)
                                                setAnchorEl(null)
                                            }}>
                                                Авторизироваться
                                            </Button>
                                        </Box>
                                        : user.isAuth && user.userName !== name && changeName === null ?
                                            <Box sx={{display: 'flex', flexDirection: "column", mb: 1}}>
                                                <Typography sx={{p: 2}}>
                                                    Сменить Ваши персональные данные?
                                                </Typography>
                                                <Button onClick={() => {
                                                    setAnchorEl(null)
                                                    setChangeName(true)
                                                    getMasters()
                                                    setActiveStep((prevActiveStep) => prevActiveStep + 1)

                                                }}>
                                                    Да
                                                </Button>
                                                <Button onClick={() => {
                                                    setAnchorEl(null)
                                                    setChangeName(false)
                                                    getMasters()
                                                    setActiveStep((prevActiveStep) => prevActiveStep + 1)
                                                }}>
                                                    Нет
                                                </Button>
                                            </Box> : <Box sx={{display: 'flex', flexDirection: "column", mb: 1}}>
                                                <Typography sx={{p: 2}}>
                                                    Хотите зарегестрироваться?
                                                </Typography>
                                                <Button onClick={() => {
                                                    setRegCustomer(true)
                                                    setAnchorEl(null)
                                                    setChangeName(true)
                                                    getMasters()
                                                    setActiveStep((prevActiveStep) => prevActiveStep + 1)
                                                }}>
                                                    Да
                                                </Button>
                                                <Button onClick={() => {
                                                    setRegCustomer(false)
                                                    setAnchorEl(null)
                                                    setChangeName(false)
                                                    getMasters()
                                                    setActiveStep((prevActiveStep) => prevActiveStep + 1)
                                                }}>
                                                    Нет
                                                </Button>

                                            </Box>
                                }
                            </Popover>

                        </Box>
                    </Box>
                ) : activeStep === steps.length - 1 ? (
                        <Box aria-describedby={id} sx={{mt: 2}}>

                            <Box sx={{ml: 4}}>
                                <Box sx={{mb: 1}}> Ваше имя: <b>{name}</b> </Box>
                                <Box sx={{mb: 1}}> Ваш email:<b>{email}</b> </Box>
                                <Box sx={{mb: 1}}>Выбранный размер часов:<b>{size.selectedSize.name}</b></Box>
                                <Box sx={{mb: 1}}> Город где сделан
                                    заказ: <b>{cities.cities.find(city => city.id === cityChosen).name}</b></Box>
                                <Box sx={{mb: 1}}> Дата заказа и время
                                    заказа: <b>{date.toLocaleDateString("uk-UA")} </b></Box>
                                <Box sx={{mb: 1}}> Время заказа: <b>{time.toLocaleTimeString("uk-UA")}</b></Box>
                                <Box> Имя мастера: <b>{freeMasters.find(item => item.id == chosenMaster).name}</b></Box>
                                <Box sx={{my: 2}}>Стоимость
                                    услуги: <b>{size.selectedSize.date !== "00:00:00" && cities.selectedCity ? size.selectedSize.date.slice(0, 2) * cities.cities
                                        .find(city => city.id === cities.selectedCity).price + " грн" : null} </b></Box>

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


                            <Popover
                                id={id}
                                open={open}
                                onClose={() => {
                                    setChangeName(false)
                                    setAnchorEl(null)
                                }}
                                anchorOrigin={{
                                    vertical: 'center',
                                    horizontal: 'center',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'center',
                                }}

                            >
                                <Box sx={{display: 'flex', flexDirection: "column", mb: 1}}>
                                    <Typography sx={{p: 2}}>
                                        Сменить Ваши данные?
                                    </Typography>
                                    <Button onClick={() => {
                                        setChangeName(true)
                                        setAnchorEl(null)
                                    }}>
                                        Да
                                    </Button>
                                    <Button onClick={() => {
                                        setAnchorEl(null)
                                        setChangeName(false)
                                    }}>
                                        Нет
                                    </Button>
                                </Box>
                            </Popover>
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
                                                                                               size="small"
                                                                                               precision={0.2}
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
                                {user.isAuth ?
                                    <Link to={`${CUSTOMER_ORDER_ROUTE}/${user.user.id}`}
                                          style={{textDecoration: 'none', color: 'white'}}>
                                        <Button variant="outlined"
                                                fullWidth
                                                navigate={`${CUSTOMER_ORDER_ROUTE}/${user.user.id}`}>
                                            К заказам</Button>
                                    </Link> :
                                    <Link to={START_ROUTE}
                                          style={{textDecoration: 'none', color: 'white'}}>
                                        <Button variant="outlined" fullWidth navigate={START_ROUTE}>На главную</Button>
                                    </Link>
                                }
                            </Box>
                        </Box>

                    )}
            </Box>
    );
});
export default OrderStepper;
