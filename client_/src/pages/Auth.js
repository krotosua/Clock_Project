import React, {useContext, useState} from "react";
import {
    Box,
    Card,
    CardContent,
    Container,
    FormControl, FormGroup,
    TextField,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {NavLink, useLocation, useNavigate} from "react-router-dom";
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

    const [error, setError] = useState()
    let errorEmail = false
    let errorPassword = false
    if (error === 500) {
        errorPassword = true
    } else if (error === 404) {
        errorEmail = true
    }

    const [message, setMassage] = useState('')
    const singIn = async () => {
        try {
            let dataUser
            if (isLogin) {
                dataUser = await login(email, password)
            } else {
                dataUser = await registration(email, password)

            }


            user.setUser(user)
            user.setIsAuth(true)
            dataUser.role === "USER" ?
                navigate(START_ROUTE) :
                navigate(ADMIN_ROUTE)
        } catch (e) {
            setMassage(e.response.data.message)
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
                            <FormGroup>
                                <TextField
                                    error={errorEmail}
                                    sx={{mb: 2}}
                                    id="Email"
                                    label="Email"
                                    variant="outlined"
                                    type={"email"}
                                    value={email}
                                    helperText={errorEmail ? `${message}` : ""}
                                    onChange={(e => {
                                        setEmail(e.target.value)
                                        setError(false)
                                    })}
                                />

                                <TextField
                                    error={errorPassword}
                                    id="Password"
                                    label="Password"
                                    variant="outlined"
                                    type={"password"}
                                    value={password}
                                    helperText={errorPassword ? `${message}` : ""}
                                    onChange={(e => {
                                        setPassword(e.target.value)
                                        setError(false)
                                    })}
                                />
                            </FormGroup>
                        </FormControl>
                        <Box
                            sx={{mt: 2, display: "flex", justifyContent: "space-between"}}
                        >
                            {isLogin ? (
                                <div>
                                    Нет аккаунта?{" "}
                                    <NavLink to={REGISTRATION_ROUTE}>Зарегистрируйся!</NavLink>
                                </div>
                            ) : (
                                <div>
                                    Есть аккаунта? <NavLink to={LOGIN_ROUTE}>Войди!</NavLink>
                                </div>
                            )}
                            <Button disabled={errorEmail || errorPassword} type="submit" variant="outlined"
                                    color={"warning"} onClick={singIn}>
                                {isLogin ? "Войти" : "Регистрация"}
                            </Button>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </Container>

    )
});

export default Auth;
