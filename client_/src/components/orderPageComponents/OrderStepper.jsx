import * as React from "react";
import {useEffect, useState} from "react";
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
import {createOrder} from "../../http/orderAPI";
import {checkEmail} from "../../http/userAPI";
import {CUSTOMER_ORDER_ROUTE, START_ROUTE} from "../../utils/consts";
import SelectorSize from "./SelectorSize";
import SelectorCity from "../SelectorCity";
import {DatePicker, LocalizationProvider, TimePicker} from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import ruLocale from 'date-fns/locale/ru'
import Login from "../authPageComponents/Login";
import ReviewsIcon from "@mui/icons-material/Reviews";
import ReviewModal from "../ReviewModal";
import {setUserNameAction} from "../../store/UserStore";
import {addHours, getHours, isToday, set} from 'date-fns'
import {useDispatch, useSelector} from "react-redux";
import TablsPagination from "../TablsPagination";
import {Controller, FormProvider, useForm} from "react-hook-form";
import PopupState, {bindPopover, bindTrigger} from 'material-ui-popup-state';
import jwt_decode from "jwt-decode";
import ReactPayPal from "./PayPal";


const steps = ["Заполните форму заказа", "Выбор мастера", "Отправка заказа"];

const OrderStepper = ({alertMessage}) => {
    const user = useSelector(state => state.user)
    const {
        register,
        handleSubmit,
        trigger,
        setValue,
        setError,
        clearErrors,
        getValues, watch, control,
        formState: {errors, isValid}
    } = useForm({
        defaultValues: {
            openTime: false,
            openDate: false,
            openPayPal: true,
            date: new Date(),
            time: addHours(set(new Date(), {minutes: 0, seconds: 0}), 1),
            email: user?.user?.email ?? "",
            name: user.userName ?? ""
        }
    });
    const dispatch = useDispatch()
    const name = watch("name")
    const email = watch("email")
    const date = watch("date")
    const time = watch("time")
    const [activeStep, setActiveStep] = useState(0);
    const [changeName, setChangeName] = useState(null)
    const [regCustomer, setRegCustomer] = useState(null)
    const [chosenMaster, setChosenMaster] = useState(null);
    const [chosenCity, setChosenCity] = useState({id: null});
    const [chosenSize, setChosenSize] = useState({id: null});
    const [freeMasters, setFreeMasters] = useState([]);
    const [loading, setLoading] = useState(false)
    const [isAuth, setIsAuth] = useState(false)
    const [openReview, setOpenReview] = useState(false)
    const [masterId, setMasterId] = useState(null)
    const [limit, setLimit] = useState(3)
    const [page, setPage] = useState(1)
    const [totalCount, setTotalCount] = useState(null)
    const navigate = useNavigate();

    const getMasters = async () => {
        setLoading(true)
        try {
            const res = await fetchMastersForOrder(chosenCity.id, set(new Date(date), {
                    hours: getHours(time),
                    minutes: 0,
                    seconds: 0
                }),
                chosenSize.id, page, limit)
            if (res.status === 204) {
                setFreeMasters([])
                setLoading(false)
                return
            }
            setFreeMasters(res.data.rows)
            setTotalCount(res.data.count);
            setLoading(false)
        } catch (e) {
            setFreeMasters([])
        } finally {
            setLoading(false)
        }
    }

    const handleNext = async (e, isPaid) => {
        if (user.isAuth || regCustomer !== null) {
            if (user.userName !== name && changeName === null) {
                setValue("emailExists", false)
                setRegCustomer(false)
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
                    cityId: chosenCity.id,
                    masterId: chosenMaster,
                    sizeClockId: chosenSize.id,
                    regCustomer,
                    price: chosenSize.date.slice(0, 2) * chosenCity.price,
                    isPaid: getValues("isPaid") ?? undefined
                }
                try {
                    const res = await createOrder(orderInfo)
                    if (changeName) {
                        dispatch(setUserNameAction(name))
                        localStorage.setItem('token', res.data)
                        const dataUser = jwt_decode(res.data)
                        dispatch(setUserNameAction(dataUser.name))
                    }
                    setValue("orderId", res.data.orderId)
                    setActiveStep((prevActiveStep) => prevActiveStep + 1);
                } catch (e) {
                    alertMessage('Мастер занят', true)
                    setActiveStep(1)
                    setLoading(true)
                    await getMasters()
                }
            }
        } else {
            setLoading(true)
            try {
                const res = await checkEmail(email)
                if (res.status === 204) {
                    setValue("emailExists", false)
                } else if (res.status === 200) {
                    setValue("emailExists", true)
                }
            } finally {
                setLoading(false)
            }
        }

    };
    const getReviews = (id) => {
        setMasterId(id)
        setOpenReview(true)
    }

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
    const choseMaster = (event, master) => {
        event ? setChosenMaster(event.target.value) : setChosenMaster(master);
    };
    useEffect(async () => {
        if (activeStep === 1) {
            setLoading(true)
            try {
                const res = await fetchMastersForOrder(chosenCity.id,
                    set(new Date(date), {
                        hours: getHours(time),
                        minutes: 0,
                        seconds: 0
                    }),
                    chosenSize.id,
                    page, limit)
                if (res.status === 204) {
                    setFreeMasters([])
                    return
                }
                setFreeMasters(res.data.rows)
            } catch {
                setFreeMasters([])
            } finally {
                setLoading(false)
            }
        }
    }, [page, limit])
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
                <FormProvider register={register} errors={errors} control={control} trigger={trigger}
                              setValue={setValue}>
                    <form onSubmit={handleSubmit(handleNext)}>
                        {activeStep === 0 ? (

                            <Box sx={{mt: 2}}>
                                <Box sx={{display: "flex", flexDirection: "column"}}>
                                    <TextField
                                        {...register("name", {
                                            required: "Введите Ваше имя",
                                            minLength: {
                                                value: 3,
                                                message: "Введите имя длинее 3-ех символов"
                                            }
                                        })}
                                        autoComplete="off"
                                        error={Boolean(errors.name)}
                                        helperText={errors.name?.message}
                                        sx={{my: 1}}
                                        id="name"
                                        label={`Укажите имя`}
                                        variant="outlined"
                                        required
                                        onBlur={() => trigger("name")}
                                    />
                                    <Controller
                                        name={"email"}
                                        rules={{
                                            required: "Введите email",
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: "Введите email формата: clock@clock.com"
                                            }
                                        }}
                                        render={({field: {onChange, value, onBlur}, fieldState: {error}}) => {
                                            return (
                                                <TextField
                                                    error={!!error}
                                                    autoComplete="off"
                                                    id="Email"
                                                    label="Email"
                                                    variant="outlined"
                                                    helperText={error?.message}
                                                    onChange={onChange}
                                                    value={value || ""}
                                                    type={"email"}
                                                    required
                                                    onBlur={() => trigger("email")}
                                                />
                                            );
                                        }}
                                        control={control}
                                    />
                                </Box>
                                <Box
                                    sx={{display: "grid", gridTemplateColumns: "repeat(2, 1fr)", my: 2}}
                                >
                                    <SelectorCity cleanMaster={() => setChosenMaster(null)}
                                                  chosenCity={chosenCity}
                                                  setChosenCity={(city) => setChosenCity(city)}/>
                                    <SelectorSize cleanMaster={() => setChosenMaster(null)}
                                                  chosenSize={chosenSize}
                                                  setChosenSize={(size) => setChosenSize(size)}/>
                                </Box>
                                <Box sx={{my: 2}}>Стоимость
                                    услуги: <b>{chosenSize.id !== null && chosenCity.id !== null ?
                                        chosenSize.date.slice(0, 2) * chosenCity.price + " грн" : null} </b></Box>
                                <Controller
                                    name="date"
                                    control={control}
                                    render={({field: {onChange, value}, fieldState: {error}}) => (
                                        <LocalizationProvider sx={{cursor: "pointer"}} dateAdapter={AdapterDateFns}
                                                              locale={ruLocale}>
                                            <DatePicker
                                                mask='__.__.____'
                                                label="Выберите день заказа"
                                                disableHighlightToday
                                                value={value || ""}
                                                open={watch("openDate", false)}
                                                onChange={(newDate) => {
                                                    onChange(newDate);
                                                    setValue("openDate", false)
                                                    setValue("openList", false)
                                                    clearErrors("date")
                                                }}
                                                onError={(e) =>
                                                    setError("date", {
                                                        type: "manual",
                                                        message: "Неверная дата"
                                                    })}
                                                minDate={new Date()}
                                                renderInput={(params) =>
                                                    <TextField
                                                        onClick={() => setValue("openDate", true)}
                                                        helperText={errors.date?.message}
                                                        sx={{
                                                            mr: 2,
                                                            '& .MuiInputBase-input': {
                                                                cursor: "pointer",
                                                            }
                                                        }}
                                                        {...params} />}
                                            />
                                        </LocalizationProvider>)}
                                    rules={{required: 'Укажите время'}}
                                />
                                <Controller
                                    name="time"
                                    control={control}
                                    render={({field: {onChange, value}, fieldState: {error}}) => (
                                        <LocalizationProvider dateAdapter={AdapterDateFns} locale={ruLocale}>
                                            <TimePicker
                                                readOnly
                                                label="Выберите время"
                                                value={value || ""}
                                                open={watch("openTime", false)}
                                                onChange={(newValue) => {
                                                    onChange(newValue)
                                                    setValue("openTime", false)
                                                    setValue("openList", false)
                                                    clearErrors("time")
                                                }}
                                                onError={() =>
                                                    setError("time", {
                                                        type: "manual",
                                                        message: "Неверное время"
                                                    })}
                                                onBlur={() => trigger("time")}
                                                ampm={false}
                                                views={["hours"]}
                                                minTime={isToday(getValues("date")) ?
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
                                                               onClick={() => {
                                                                   setValue("openTime", true)
                                                               }}
                                                               {...params} />}
                                            />
                                        </LocalizationProvider>)}
                                    rules={{
                                        required: 'Укажите время'
                                    }}
                                />
                                <Box sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    pt: 2
                                }}>
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
                                    <PopupState
                                        variant="popover"
                                        type="submit" popupId="demo-popup-popover">
                                        {(popupState) => (
                                            <div>
                                                <Button
                                                    type='submit'
                                                    {...bindTrigger(popupState)}
                                                    disabled={Object.keys(errors).length !== 0 || !isValid}>
                                                    Дальше
                                                </Button>
                                                {(regCustomer === null && !user.isAuth || user.isAuth && user.userName !== name || changeName === null && user.isAuth) && isValid && !loading ?
                                                    <Popover
                                                        {...bindPopover(popupState)}
                                                        anchorOrigin={{
                                                            vertical: 'bottom',
                                                            horizontal: 'center',
                                                        }}
                                                        transformOrigin={{
                                                            vertical: 'top',
                                                            horizontal: 'center',
                                                        }}
                                                    >{
                                                        getValues("emailExists") ?
                                                            <Box sx={{
                                                                display: 'flex',
                                                                flexDirection: "column",
                                                                mb: 1
                                                            }}>
                                                                <Typography sx={{p: 2}}>
                                                                    Прежде чем продолжить - авторизируйтесь
                                                                </Typography>
                                                                <Button onClick={() => {
                                                                    setIsAuth(true)
                                                                }}>
                                                                    Авторизироваться
                                                                </Button>
                                                            </Box>
                                                            : user.isAuth && user.userName !== name && changeName === null ?
                                                                <Box sx={{
                                                                    display: 'flex',
                                                                    flexDirection: "column",
                                                                    mb: 1
                                                                }}>
                                                                    <Typography sx={{p: 2}}>
                                                                        Сменить Ваши персональные данные?
                                                                    </Typography>
                                                                    <div style={{textAlign: "center"}}>
                                                                        {user.isAuth && user.userName !== name ?
                                                                            <b>Имя</b> : null}</div>
                                                                    <Button onClick={() => {
                                                                        setChangeName(true)
                                                                        getMasters()
                                                                        setActiveStep((prevActiveStep) => prevActiveStep + 1)

                                                                    }}>
                                                                        Да
                                                                    </Button>
                                                                    <Button onClick={() => {
                                                                        setChangeName(false)
                                                                        getMasters()
                                                                        setActiveStep((prevActiveStep) => prevActiveStep + 1)
                                                                    }}>
                                                                        Нет
                                                                    </Button>
                                                                </Box> :
                                                                <Box sx={{
                                                                    display: 'flex',
                                                                    flexDirection: "column",
                                                                    mb: 1
                                                                }}>
                                                                    <Typography sx={{p: 2}}>
                                                                        Хотите зарегестрироваться?
                                                                    </Typography>
                                                                    <Button onClick={() => {
                                                                        setRegCustomer(true)
                                                                        setChangeName(false)
                                                                        getMasters()
                                                                        setActiveStep((prevActiveStep) => prevActiveStep + 1)
                                                                    }}>
                                                                        Да
                                                                    </Button>
                                                                    <Button onClick={() => {
                                                                        setRegCustomer(false)
                                                                        setChangeName(false)
                                                                        getMasters()
                                                                        setActiveStep((prevActiveStep) => prevActiveStep + 1)
                                                                    }}>
                                                                        Нет
                                                                    </Button>

                                                                </Box>
                                                    }
                                                    </Popover> : null}
                                            </div>
                                        )}
                                    </PopupState>

                                </Box>
                            </Box>
                        ) : activeStep === steps.length - 1 ? (
                                <Box sx={{mt: 2}}>
                                    <Box sx={{
                                        mx: "auto",

                                    }}>
                                        <Box sx={{mb: 1}}> Ваше имя: <b>{name}</b> </Box>
                                        <Box sx={{mb: 1}}> Ваш email:<b>{email}</b> </Box>
                                        <Box sx={{mb: 1}}>Выбранный размер часов:<b>{chosenSize.name}</b></Box>
                                        <Box sx={{mb: 1}}> Город где сделан
                                            заказ: <b>{chosenCity.name}</b></Box>
                                        <Box sx={{mb: 1}}> Дата заказа и время
                                            заказа: <b>{date.toLocaleDateString("uk-UA")} </b></Box>
                                        <Box sx={{mb: 1}}> Время заказа: <b>{time.toLocaleTimeString("uk-UA")}</b></Box>
                                        <Box> Имя мастера: <b>{freeMasters.find(item => item.id === chosenMaster).name}</b></Box>
                                        <Box sx={{my: 1}}>Стоимость
                                            услуги: <b>{chosenSize.id !== null && chosenCity.id !== null ? chosenSize.date.slice(0, 2) * chosenCity.price + " грн" : null} </b>
                                        </Box>
                                        <Box sx={{width: 400}}>

                                        </Box>
                                    </Box>
                                    <Box sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        pt: 2
                                    }}>
                                        <Button
                                            color="inherit"
                                            disabled={activeStep === 0}
                                            onClick={handleBack}
                                            sx={{mr: 1}}
                                        >
                                            Назад
                                        </Button>
                                        <Button
                                            type={"submit"}
                                            disabled={!chosenMaster}>
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
                                        : totalCount === 0 ? (
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
                                                        <ListItemText sx={{width: 10, textAlign: "center"}}
                                                                      primary="№"/>
                                                        <ListItemText sx={{width: 10, textAlign: "center"}}
                                                                      primary="Имя мастера"/>
                                                        <ListItemText sx={{width: 10, textAlign: "center"}}
                                                                      primary="Рейтинг"/>
                                                        <ListItemText sx={{width: 10, textAlign: "center"}}
                                                                      primary="Город"/>
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
                                                                              }
                                                                    >
                                                                        <ListItemText
                                                                            sx={{width: 10, textAlign: "center"}}
                                                                            primary={index + 1}/>
                                                                        <ListItemText
                                                                            sx={{width: 10, textAlign: "center"}}
                                                                            primary={master.name}/>
                                                                        <ListItemText
                                                                            sx={{width: 10, textAlign: "center"}}
                                                                            primary={<Rating name="read-only"
                                                                                             size="small"
                                                                                             precision={0.2}
                                                                                             value={master.rating}
                                                                                             readOnly/>}/>
                                                                        <ListItemText
                                                                            sx={{width: 10, textAlign: "center"}}
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
                                                    <TablsPagination page={page} totalCount={totalCount} limit={limit}
                                                                     pagesFunction={(page) => setPage(page)}/>
                                                </Box>
                                                {loading ? <CircularProgress size={30}
                                                                             sx={{
                                                                                 position: "absolute",
                                                                                 right: 5,
                                                                                 bottom: 85
                                                                             }}/> : ""}
                                            </Box>)
                                    }

                                    <Box sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        pt: 2
                                    }}>
                                        <Button
                                            color="inherit"
                                            onClick={handleBack}
                                            sx={{mr: 1}}
                                        >
                                            Назад
                                        </Button>
                                        <Button type="submit"
                                                disabled={!chosenMaster}>
                                            Дальше
                                        </Button>
                                    </Box>
                                </Box>
                            ) : (
                                <Box sx={{display: 'flex', justifyContent: "center", mt: 2}}>
                                    <Box>
                                        <Typography variant="h4" sx={{my: 2, textAlign: "center"}}>Заказ успешно
                                            создан</Typography>
                                        <Typography variant="h6" sx={{my: 2, textAlign: "center"}}>Детали заказа
                                            отправлены на
                                            почту</Typography>
                                        <Box>
                                            <ReactPayPal orderId={getValues("orderId")}
                                                         isAuth={user.isAuth}
                                                         userLink={`${CUSTOMER_ORDER_ROUTE}/${user.user.id}`}
                                                         value={chosenSize.date.slice(0, 2) * chosenCity.price}/>
                                            {getValues("errorPayPal") && "Произошла ошибка при оплате"}
                                        </Box>

                                    </Box>
                                </Box>

                            )}
                        {openReview ? <ReviewModal open={openReview}
                                                   masterId={masterId}
                                                   onClose={() => setOpenReview(false)}/> : null}
                    </form>
                </FormProvider>
            </Box>
    );
}
export default OrderStepper;
