import React, {useContext, useState} from "react";
import {
    Box,
    Card,
    CardContent, Checkbox,
    Container,
    FormControl, FormControlLabel, FormHelperText, InputAdornment, OutlinedInput,
    TextField, Typography, Button, IconButton, InputLabel
} from "@mui/material";
import {
    NavLink,
    useLocation,
    useNavigate
} from "react-router-dom";
import {
    ADMIN_ROUTE,
    LOGIN_ROUTE,
    REGISTRATION_ROUTE, USER_ORDER_ROUTE,
} from "../utils/consts";
import {login, registration} from "../http/userAPI";
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import SelectorMasterCity from "../components/adminPageComponents/modals/SelectorMasterCity";
import MyAlert from "../components/adminPageComponents/MyAlert";
import {Visibility, VisibilityOff} from "@mui/icons-material";


const Auth = observer(() => {
    const {user, cities} = useContext(Context)
    const location = useLocation();
    const navigate = useNavigate()
    const isLogin = location.pathname === LOGIN_ROUTE;
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordCheck, setPasswordCheck] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showPasswordCheck, setShowPasswordCheck] = useState(false)
    const [error, setError] = useState(false)
    const [blurPassword, setBlurPassword] = useState(false)
    const [blurPasswordCheck, setBlurPasswordCheck] = useState(false)
    const [blurEmail, setBlurEmail] = useState(false)
    const [agree, setAgree] = useState(false)
    const [isMaster, setIsMaster] = useState(false)
    const [name, setName] = useState('')
    const [open, setOpen] = useState(false)
    const [isError, setIsError] = useState(false)
    const [message, setMessage] = useState("")

    const alertMessage = (message, bool) => {
        setOpen(true)
        setMessage(message)
        setIsError(bool)
    }
    const singIn = async () => {
        try {
            let customerData,masterData,dataUser
            isMaster ?
                masterData={
                    email,password,isMaster, name, cityId: cities.selectedCity
                }:
            customerData={
                email,password,isMaster, name
            }
            
            if (isLogin && password.length >= 6 && reg.test(email) !== false) {
                dataUser = await login(email, password)
            } else if (password.length >= 6 && reg.test(email) !== false) {
                isMaster ?
                    await registration(masterData) :
                    await registration(customerData)
                alertMessage("Письмо для подтверждения Email отправлено на почту", false)
                return
            } else {
                setError(true)
                return
            }

            if (dataUser.isActivated === false && dataUser.role !== "ADMIN") {
                alertMessage("Требуется подтвердить Email", true)
                return
            }
            user.setUser(dataUser)
            user.setIsAuth(true)
            user.setUserRole(dataUser.role)

            dataUser.role === "USER" && dataUser.isActivated === true ?
                navigate(`${USER_ORDER_ROUTE}/${user.user.id}`) :
                navigate(ADMIN_ROUTE)
        } catch (e) {
            setError(true)
        }
    }
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
    };
    //////////////
    const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    const disableButton = isMaster === true ?
        !agree || !email || password.length < 6 || reg.test(email) === false || !name || cities.selectedCity.length === 0 || password !== passwordCheck :
        !agree || !email || password.length < 6 || reg.test(email) === false || !name|| password !== passwordCheck

    return (
        <Container
            maxWidth="xl"
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: window.innerHeight - 60,
            }}
            onKeyDown={(e) => e.keyCode == 13 ? singIn() : null}
        >
            <Card sx={{width: 800, p: 1}}>
                {isLogin ?
                    (<CardContent>
                            <Typography align="center" variant="h5">
                                Авторизация
                            </Typography>
                            <Box
                                sx={{
                                    width: 700,
                                    mt: 3,
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                }}
                            >
                                <FormControl error={true}>
                                    <TextField
                                        error={error || blurEmail && reg.test(email) == false}
                                        sx={{mb: 2}}
                                        id="Email"
                                        label="Email"
                                        variant="outlined"
                                        type={"email"}
                                        value={email}
                                        helperText={blurEmail && reg.test(email) == false ?
                                            "Введите email формата: clock@clock.com" :
                                            error && !isLogin ? "Пользователь с таким email уже существует" : error ? "Неверный email или пароль" : ""
                                        }
                                        onFocus={() => setBlurEmail(false)}
                                        onBlur={() => setBlurEmail(true)}
                                        onChange={(e => {
                                            setEmail(e.target.value)
                                            setError(null)
                                        })}
                                    />


                                    <FormControl variant="outlined">
                                        <InputLabel htmlFor="Password">Пароль</InputLabel>
                                        <OutlinedInput
                                            error={error || blurPassword && password.length < 6 || blurPasswordCheck ? !isLogin && password !== passwordCheck : false}
                                            id="Password"
                                            label="Пароль"
                                            type={showPassword ? 'text' : 'password'}

                                            value={password}
                                            onChange={(e => {
                                                setPassword(e.target.value)
                                                setError(false)
                                            })}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickShowPassword}
                                                        edge="end"
                                                    >
                                                        {showPassword ? <VisibilityOff/> : <Visibility/>}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            onFocus={() => setBlurPassword(false)}
                                            onBlur={() => setBlurPassword(true)}
                                        />
                                        <FormHelperText>{blurPassword && password.length < 6 ?
                                            "Длина пароля должна быть не менее 6 символов"
                                            : ""}</FormHelperText>
                                    </FormControl>

                                    <Box
                                        sx={{mt: 2, display: "flex", justifyContent: "space-between"}}
                                    >
                                        <div>
                                            Нет аккаунта?
                                            <NavLink to={REGISTRATION_ROUTE}
                                                     onClick={() => setError(false)}> Зарегистрируйтесь.</NavLink>
                                        </div>
                                        <Button type="submit" variant="outlined"
                                                color={"warning"} onClick={singIn}
                                                disabled={!email || password.length < 6 || reg.test(email) == false}>
                                            Войти
                                        </Button>
                                    </Box>

                                </FormControl>
                            </Box>
                        </CardContent>
                    )
                    :
                    (<CardContent>
                        <Typography align="center" variant="h5">
                            Регистрация
                        </Typography>
                        <Box
                            sx={{
                                width: 700,
                                mt: 3,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                            }}
                        >
                            <TextField
                                error={error}
                                sx={{mb:2}}
                                id="name"
                                label="Укажите Ваше имя"
                                variant="outlined"
                                value={name}
                                onChange={(e => {
                                    setName(e.target.value)
                                })}
                            />
                            <FormControl error={true}>
                                <TextField
                                    error={error || blurEmail && reg.test(email) == false}
                                    sx={{mb: 2}}
                                    id="Email"
                                    label="Email"
                                    variant="outlined"
                                    type={"email"}
                                    value={email}
                                    helperText={blurEmail && reg.test(email) == false ?
                                        "Введите email формата: clock@clock.com" :
                                        error ? "Пользователь с таким email уже существует" : ""
                                    }
                                    onFocus={() => setBlurEmail(false)}
                                    onBlur={() => setBlurEmail(true)}
                                    onChange={(e => {
                                        setEmail(e.target.value)
                                        setError(null)
                                    })}
                                />


                                <FormControl variant="outlined">
                                    <InputLabel htmlFor="Password">Пароль</InputLabel>
                                    <OutlinedInput
                                        error={error || blurPassword && password.length < 6 || blurPasswordCheck ? password !== passwordCheck : false}
                                        id="Password"
                                        label="Пароль"
                                        type={showPassword ? 'text' : 'password'}

                                        value={password}
                                        onChange={(e => {
                                            setPassword(e.target.value)
                                            setError(false)
                                        })}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff/> : <Visibility/>}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        onFocus={() => setBlurPassword(false)}
                                        onBlur={() => setBlurPassword(true)}
                                    />
                                    <FormHelperText>{blurPassword && password.length < 6 ?
                                        "Длина пароля должна быть не менее 6 символов"
                                        : ""}</FormHelperText>
                                </FormControl>
                                <FormControl sx={{my: 2}} variant="outlined">
                                    <InputLabel htmlFor="Check Password">Подтвердить пароль</InputLabel>
                                    <OutlinedInput
                                        error={error || blurPasswordCheck && password !== passwordCheck}
                                        id="Check Password"
                                        label="Подтвердить пароль"
                                        type={showPasswordCheck ? 'text' : 'password'}
                                        value={passwordCheck}
                                        onChange={(e => {
                                            setPasswordCheck(e.target.value)
                                            setError(false)
                                        })}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={() => setShowPasswordCheck(!showPasswordCheck)}
                                                    edge="end"
                                                >
                                                    {showPasswordCheck ? <VisibilityOff/> : <Visibility/>}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        onFocus={() => setBlurPasswordCheck(false)}
                                        onBlur={() => setBlurPasswordCheck(true)}
                                    />
                                    <FormHelperText
                                        error={true}>{blurPasswordCheck && password !== passwordCheck ? "Пароли не совпадают" : ""}</FormHelperText>

                                </FormControl>


                                {isMaster ?
                                    <Box>
                                        <SelectorMasterCity error={false}/>

                                    </Box>
                                    : null}

                                <Box>
                                    <Box>
                                        <FormControlLabel
                                            label="Cо всем согласен"
                                            control={
                                                <Checkbox onChange={(e) => setAgree(e.target.checked)}/>}

                                        />
                                    </Box>
                                    <Box>
                                        <FormControlLabel
                                            label="Зарегестрироваться как мастер"
                                            control={<Checkbox onChange={(e) => {
                                                setError(false)
                                                e.target.checked ? setIsMaster(true) : setIsMaster(false)
                                            }}/>}
                                        />
                                    </Box>
                                </Box>

                                <Box
                                    sx={{mt: 2, display: "flex", justifyContent: "space-between"}}
                                >

                                    <div>
                                        Есть аккаунта? <NavLink to={LOGIN_ROUTE}
                                                                onClick={() => {
                                                                    setAgree(false)
                                                                    setIsMaster(false)
                                                                    setError(false)
                                                                }}>Войти.</NavLink>
                                    </div>

                                    <Button type="submit" variant="outlined"
                                            color={"warning"} onClick={singIn}
                                            disabled={disableButton}>
                                        Регистрация
                                    </Button>
                                </Box>

                            </FormControl>
                        </Box>
                    </CardContent>)}
            </Card>
            <MyAlert open={open}
                     onClose={() => setOpen(false)}
                     message={message}
                     isError={isError}/>
        </Container>

    )
});

export default Auth;
