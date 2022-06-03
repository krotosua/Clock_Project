import React, {useContext, useState} from "react";
import {
    Box,
    Card,
    CardContent, Checkbox,
    Container,
    FormControl, FormControlLabel,
    TextField,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {
    NavLink,
    useLocation,
    useNavigate
} from "react-router-dom";
import {
    ADMIN_ROUTE,
    LOGIN_ROUTE,
    REGISTRATION_ROUTE, START_ROUTE, USER_ORDER_ROUTE,
} from "../utils/consts";
import {login, registration} from "../http/userAPI";
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import SelectorMasterCity from "../components/adminPageComponents/modals/SelectorMasterCity";
import MyAlert from "../components/adminPageComponents/MyAlert";


const Auth = observer(() => {
    const {user, cities} = useContext(Context)
    const location = useLocation();
    const navigate = useNavigate()
    const isLogin = location.pathname === LOGIN_ROUTE;
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(false)
    const [blurPassword, setBlurPassword] = useState(false)
    const [blurEmail, setBlurEmail] = useState(false)
    const [agree, setAgree] = useState(false)
    const [role, setRole] = useState("USER")
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
            let dataUser;
            if (isLogin && password.length >= 6 && reg.test(email) !== false) {
                dataUser = await login(email, password)
            } else if (password.length >= 6 && reg.test(email) !== false) {
                if (role === "MASTER") {
                    dataUser = await registration(email, password, role, name, cities.selectedCity)
                } else {
                    dataUser = await registration(email, password, role, null, null)
                }
                alertMessage("Письмо для подтверждения Email отправлено на почту", false)
                return
            } else {
                setError(true)
                return
            }

            if (dataUser.isActivated == false&&dataUser.role !=="ADMIN") {
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
    //////////////
    let reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    let unlockButton = !isLogin && !agree || !email || password.length < 6 || reg.test(email) == false

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
                <CardContent>
                    <Typography align="center" variant="h5">
                        {isLogin ? "Авторизация" : "Регистрация"}
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

                            <TextField
                                error={error || blurPassword && password.length < 6}
                                id="Password"
                                label="Password"
                                variant="outlined"
                                type={"password"}
                                value={password}
                                sx={{mb: 2}}
                                helperText={blurPassword && password.length < 6 ?
                                    "Длина пароля должна быть не менее 6 символов" : ""}
                                onChange={(e => {
                                    setPassword(e.target.value)
                                    setError(false)
                                })}
                                onFocus={() => setBlurPassword(false)}
                                onBlur={() => setBlurPassword(true)}
                            />

                            {role == "MASTER" ?
                                <Box>
                                    <SelectorMasterCity error={false}/>
                                    <TextField
                                        error={error || blurEmail && reg.test(email) == false}
                                        sx={{mt: 2}}
                                        id="name"
                                        label="Укажите Ваше имя"
                                        variant="outlined"
                                        value={name}
                                        onChange={(e => {
                                            setName(e.target.value)
                                        })}
                                    />
                                </Box>
                                : null}
                            {isLogin ? null :
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
                                                e.target.checked ? setRole("MASTER") : setRole("USER")
                                            }}/>}
                                        />
                                    </Box>


                                </Box>
                            }
                            <Box
                                sx={{mt: 2, display: "flex", justifyContent: "space-between"}}
                            >
                                {isLogin ? (
                                    <div>
                                        Нет аккаунта?
                                        <NavLink to={REGISTRATION_ROUTE}
                                                 onClick={() => setError(false)}> Зарегистрируйтесь.</NavLink>
                                    </div>
                                ) : (
                                    <div>
                                        Есть аккаунта? <NavLink to={LOGIN_ROUTE}
                                                                onClick={() => setError(false)}>Войти.</NavLink>
                                    </div>
                                )}
                                <Button type="submit" variant="outlined"
                                        color={"warning"} onClick={singIn}
                                        disabled={unlockButton}>
                                    {isLogin ? "Войти" : "Регистрация"}
                                </Button>
                            </Box>

                        </FormControl>
                    </Box>
                </CardContent>
            </Card>
            <MyAlert open={open}
                     onClose={() => setOpen(false)}
                     message={message}
                     isError={isError}/>
        </Container>

    )
});

export default Auth;
