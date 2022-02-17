import React, {useContext, useState} from "react";
import {
    Box,
    Card,
    CardContent,
    Container,
    FormControl,
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
    REGISTRATION_ROUTE, START_ROUTE,
} from "../utils/consts";
import {login, registration} from "../http/userAPI";
import {observer} from "mobx-react-lite";
import {Context} from "../index";


const Auth = observer(() => {
    const {user} = useContext(Context)
    const location = useLocation();
    const navigate = useNavigate()
    const isLogin = location.pathname === LOGIN_ROUTE;

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)

    const singIn = async () => {
        try {
            let dataUser;
            if (isLogin) {
                dataUser = await login(email, password)
            } else {
                if (password.length >= 6) {
                    dataUser = await registration(email, password)
                } else {
                    setError(401)
                    return
                }

            }
            user.setUser(user)
            user.setIsAuth(true)
            user.setUserRole(dataUser.role)

            dataUser.role === "USER" ?
                navigate(START_ROUTE) :
                navigate(ADMIN_ROUTE)
        } catch (e) {

            setError(e.response.status)

        }
    }

    return (


        <Container
            maxWidth="xl"
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: window.innerHeight - 60,
            }}
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


                        <FormControl>

                            <TextField
                                error={error == 404 || error == 400}
                                sx={{mb: 2}}
                                id="Email"
                                label="Email"
                                variant="outlined"
                                type={"email"}
                                value={email}
                                helperText={error == 404 ?
                                    "Пользователя с таким email не найден" :
                                    error == 400 ? "Введите email формата: clock@clock.com" : ""
                                }

                                onChange={(e => {
                                    setEmail(e.target.value)
                                    setError(null)
                                })}
                            />

                            <TextField
                                error={error == 401}
                                id="Password"
                                label="Password"
                                variant="outlined"
                                type={"password"}
                                value={password}
                                helperText={isLogin ?
                                    error ? "Неправильный пароль" : ""
                                    : "Длина пароля должна быть не менее 6 символов"}
                                onChange={(e => {
                                    setPassword(e.target.value)
                                    setError(null)
                                })}
                            />

                            <Box
                                sx={{mt: 2, display: "flex", justifyContent: "space-between"}}
                            >
                                {isLogin ? (
                                    <div>
                                        Нет аккаунта? <NavLink to={REGISTRATION_ROUTE}
                                                               onClick={() => setError("")}>Зарегистрируйся!</NavLink>
                                    </div>
                                ) : (
                                    <div>
                                        Есть аккаунта? <NavLink to={LOGIN_ROUTE}
                                                                onClick={() => setError("")}>Войди!</NavLink>
                                    </div>
                                )}
                                <Button type="submit" variant="outlined"
                                        color={"warning"} onClick={singIn}>
                                    {isLogin ? "Войти" : "Регистрация"}
                                </Button>
                            </Box>

                        </FormControl>
                    </Box>
                </CardContent>
            </Card>
        </Container>

    )
});

export default Auth;
