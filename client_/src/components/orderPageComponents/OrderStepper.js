import * as React from "react";
import {useContext, useEffect, useState} from "react";
import {
    Box,
    Button,
    CircularProgress,
    Divider,
    FormControlLabel,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Popover,
    Radio,
    RadioGroup,
    Rating,
    Step,
    StepLabel,
    Stepper,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import {fetchMastersForOrder} from "../../http/masterAPI";
import {observer} from "mobx-react-lite";
import {createOrder} from "../../http/orderAPI";
import {checkEmail} from "../../http/userAPI";
import {CUSTOMER_ORDER_ROUTE, START_ROUTE} from "../../utils/consts";
import SelectorSize from "./SelectorSize";
import SelectorCity from "../SelectorCity";
import {Context} from "../../index";
import {DatePicker, LocalizationProvider, TimePicker} from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import ruLocale from 'date-fns/locale/ru'
import PagesOrder from "./Pages";
import Login from "../authPageComponents/Login";
import ReviewsIcon from "@mui/icons-material/Reviews";
import ReviewModal from "../ReviewModal";
import {addHours, getHours, isToday, set} from 'date-fns'

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
    const [time, setTime] = useState(addHours(set(new Date(), {minutes: 0, seconds: 0}), 1));
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
    const [openReview, setOpenReview] = useState(false)
    const [masterId, setMasterId] = useState(null)
    const navigate = useNavigate();

    const handleClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const getMasters = async () => {
        setLoading(true)
        try {
            const res = await fetchMastersForOrder(cities.selectedCity, set(new Date(date), {
                    hours: getHours(time),
                    minutes: 0,
                    seconds: 0
                }),
                size.selectedSize.id, masters.page, 3)
            if (res.status === 204) {
                setFreeMasters([])
                setLoading(false)
                return
            }
            setFreeMasters(res.data.rows)
            masters.setMasters(res.data.rows);
            masters.setTotalCount(res.data.count);
            setLoading(false)
        } catch (e) {
            return masters.setIsEmpty(true);
        } finally {
            setLoading(false)
        }

    }

    const handleNext = async (event) => {
        if (user.isAuth || regCustomer !== null) {
            if (user.userName !== name && changeName === null) {
                setEmailExists(false)
                setRegCustomer(false)
                setAnchorEl(event.currentTarget)
                return
            }
            if (activeStep === 0) {
                await getMasters()
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
            } else if (activeStep === 1 && chosenMaster) {
                setChosenMaster(Number(chosenMaster))
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
            } else {

                const orderInfo = {
                    name,
                    time: set(new Date(date), {hours: getHours(time), minutes: 0, seconds: 0}),
                    email,
                    changeName,
                    cityId: cityChosen,
                    masterId: chosenMaster,
                    sizeClockId: size.selectedSize.id,
                    regCustomer,
                    price: size.selectedSize.date.slice(0, 2) * cities.cities
                        .find(city => city.id === cities.selectedCity).price
                }
                try {
                    await createOrder(orderInfo)
                    cities.setSelectedCity(null)
                    size.setSelectedSize({date: "00:00:00"})
                    masters.setMasters([])
                    if (changeName) {
                        user.setUserName(name)
                    }
                    setActiveStep((prevActiveStep) => prevActiveStep + 1);
                } catch (e) {
                    alertMessage('Мастер занят', true)
                    setActiveStep(1)
                    setLoading(true)
                    getMasters()
                }
            }
        } else {
            setLoading(true)
            try {
                const res = checkEmail(email)
                if (res.status === 204) {
                    setEmailExists(false)
                } else if (res.status === 200) {
                    setEmailExists(true)
                }
            } finally {
                setLoading(false)
            }
            setAnchorEl(event.currentTarget)
        }
    };
    const getReviews = (id) => {
        setMasterId(id)
        setOpenReview(true)
    }

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

    useEffect(async () => {
        if (activeStep === 1) {
            setLoading(true)
            try {
                const res = await fetchMastersForOrder(cities.selectedCity,
                    set(new Date(date), {
                        hours: getHours(time),
                        minutes: 0,
                        seconds: 0
                    }),
                    size.selectedSize.id,
                    masters.page, 3)
                if (res.status === 204) {
                    setFreeMasters([])
                    return
                }
                setFreeMasters(res.data.rows)
                masters.setMasters(res.data.rows);
                masters.setTotalCount(res.data.count);
            } catch {
                masters.setIsEmpty(true);
            } finally {
                setLoading(false)
            }
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
                                    setTime(set(new Date(), {hours: getHours(newValue), minutes: 0, seconds: 0}));
                                    setOpenTime(false)
                                    setChosenMaster(null)
                                }}
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
                                                <div style={{textAlign: "center"}}>
                                                    {user.isAuth && user.userName !== name ?
                                                        <b>Имя</b> : null}</div>
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
                                <Box> Имя мастера: <b>{freeMasters.find(item => item.id === chosenMaster).name}</b></Box>
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
                                : freeMasters.length === 0 ? (
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
                                                <ListItemText sx={{width: 10, textAlign: "center"}} primary="№"/>
                                                <ListItemText sx={{width: 10, textAlign: "center"}}
                                                              primary="Имя мастера"/>
                                                <ListItemText sx={{width: 10, textAlign: "center"}} primary="Рейтинг"/>
                                                <ListItemText sx={{width: 10, textAlign: "center"}} primary="Город"/>
                                                <ListItemText sx={{width: 10, textAlign: "center", mr: 5}}
                                                              primary="Комментарии"/>

                                            </ListItem>

                                            <Divider orientation="vertical"/>
                                            <RadioGroup
                                                aria-labelledby="demo-controlled-radio-buttons-group"
                                                name="controlled-radio-buttons-group"
                                                value={chosenMaster}
                                                onChange={choseMaster}
                                            >
                                                {freeMasters.length === 0 ? (
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
                                                                <ListItemText sx={{width: 10, textAlign: "center"}}
                                                                              primary={index + 1}/>
                                                                <ListItemText sx={{width: 10, textAlign: "center"}}
                                                                              primary={master.name}/>
                                                                <ListItemText sx={{width: 10, textAlign: "center"}}
                                                                              primary={<Rating name="read-only"
                                                                                               size="small"
                                                                                               precision={0.2}
                                                                                               value={master.rating}
                                                                                               readOnly/>}/>
                                                                <ListItemText sx={{width: 10, textAlign: "center"}}
                                                                              primary={master.cities[0].name}/>
                                                                <ListItemText
                                                                    sx={{width: 10, textAlign: "center"}}
                                                                    primary={
                                                                        <IconButton sx={{width: 5}}
                                                                                    aria-label="Reviews"
                                                                                    onClick={() => getReviews(master.id)}
                                                                        >
                                                                            <ReviewsIcon/>
                                                                        </IconButton>
                                                                    }/>
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
                                <Typography variant="h6" sx={{my: 2}}>Детали заказа отправлены на почту</Typography>
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
                {openReview ? <ReviewModal open={openReview}
                                           masterId={masterId}
                                           onClose={() => setOpenReview(false)}/> : null}
            </Box>
    );
});
export default OrderStepper;
