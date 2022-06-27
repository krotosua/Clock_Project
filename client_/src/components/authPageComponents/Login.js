import {
    Box,
    Card,
    CardContent,
    Container,
    FormControl,
    FormHelperText,
    InputAdornment,
    OutlinedInput,
    TextField
} from "@mui/material";
import {NavLink, useLocation, useNavigate} from "react-router-dom";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import IconButton from "@mui/material/IconButton";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {
    ADMIN_ROUTE,
    CUSTOMER_ORDER_ROUTE,
    MASTER_ORDER_ROUTE,
    ORDER_ROUTE,
    REGISTRATION_ROUTE,
} from "../../utils/consts";
import Button from "@mui/material/Button";
import React, {useState} from "react";
import {ROLE_LIST} from "../../store/UserStore";
import {useDispatch, useSelector} from "react-redux";
import {loginUser} from "../../asyncActions/users";


const Login = ({alertMessage, nextPage, getMasters, orderEmail}) => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)
    const location = useLocation()
    const isOrder = location.pathname === ORDER_ROUTE;
    const [email, setEmail] = useState(orderEmail || '')
    const [blurEmail, setBlurEmail] = useState(false)
    const [blurPassword, setBlurPassword] = useState(false)
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState(false)
    const navigate = useNavigate()
    const singIn = async () => {
        try {
            if (password.length < 6 && reg.test(email) === false) {
                setError(true)
                return
            }
            const dataUser = await dispatch(loginUser(email, password))
            if (user.isActivated === false && dataUser.role !== ROLE_LIST.ADMIN) {
                alertMessage("Требуется подтвердить Email", true)
                return
            }
            if (isOrder) {
                getMasters()
                nextPage()
            } else {
                dataUser.role === ROLE_LIST.CUSTOMER && dataUser.isActivated === true ?
                    navigate(`${CUSTOMER_ORDER_ROUTE}/${dataUser.id}`) :
                    user.userRole === ROLE_LIST.MASTER && dataUser.isActivated === true ?
                        navigate(`${MASTER_ORDER_ROUTE}/${dataUser.id}`) : navigate(ADMIN_ROUTE)
            }
        } catch (e) {
            setError(true)
        }
    }
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
    };
    //////////////
    const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    return (
        <Container
            maxWidth="xl"
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: window.innerHeight - 60,
            }}
            onKeyDown={(e) => e.keyCode === 13 ? singIn() : null}
        >
            <Card sx={{width: 800, p: 1}}>
                <CardContent>
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
                                error={error || blurEmail && reg.test(email) === false}
                                sx={{mb: 2}}
                                id="Email"
                                label="Email"
                                variant="outlined"
                                type={"email"}
                                value={email}
                                helperText={blurEmail && reg.test(email) === false ?
                                    "Введите email формата: clock@clock.com" : error ? "Неверный email или пароль" : ""
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
                                    autoComplete="new-password"
                                    error={error || blurPassword && password.length < 6}
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
                                {!isOrder ?
                                    <div>
                                        Нет аккаунта?
                                        <NavLink to={REGISTRATION_ROUTE}
                                                 onClick={() => setError(false)}> Зарегистрируйтесь.</NavLink>
                                    </div> : <div></div>}
                                <Button type="submit" variant="outlined"
                                        color={"warning"} onClick={singIn}
                                        disabled={!email || password.length < 6 || reg.test(email) === false}>
                                    Войти
                                </Button>
                            </Box>

                        </FormControl>
                    </Box>
                </CardContent>
            </Card>
        </Container>)
}

export default Login;