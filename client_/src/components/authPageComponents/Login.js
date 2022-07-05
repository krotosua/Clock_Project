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
import {Controller, useForm} from "react-hook-form";
import warning from "react-redux/es/utils/warning";
import {ERROR_401, ERROR_404} from "../../utils/constErrors";


const Login = ({alertMessage, nextPage, getMasters, orderEmail}) => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)
    const location = useLocation()
    const isOrder = location.pathname === ORDER_ROUTE;
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()
    const {register, handleSubmit, trigger, setError, control, formState: {errors}} = useForm({mode: 'onTouched'});
    const singIn = async (data) => {
        try {
            const {email, password} = data
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
                    dataUser.role === ROLE_LIST.MASTER && dataUser.isActivated === true ?
                        navigate(`${MASTER_ORDER_ROUTE}/${dataUser.id}`) : navigate(ADMIN_ROUTE)
            }
        } catch (e) {
            if (e.message === ERROR_401) {
                setError("password", {
                    type: "manual",
                    message: "Неверный пароль"
                })
            } else if (e.message === ERROR_404) {
                setError("email", {
                    type: "manual",
                    message: "Такого email не существует"
                })
            }
        }
    }
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
    };
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
                        Авторизация
                    </Typography>
                    <form onSubmit={handleSubmit(singIn)}>
                        <Box
                            sx={{
                                width: 700,
                                mt: 3,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                            }}
                        >
                            <Controller
                                name={"email"}
                                rules={{
                                    required: "Введите email",
                                    shouldFocusError: false,
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Введите email формата: clock@clock.com"
                                    }
                                }}
                                defaultValue={orderEmail ?? ""}
                                render={({field: {onChange, value, onBlur}, fieldState: {error}}) => {
                                    return (
                                        <TextField
                                            error={!!error}
                                            sx={{mb: 2}}
                                            id="Email"
                                            label="Email"
                                            variant="outlined"
                                            helperText={error?.message}
                                            onChange={onChange}
                                            value={value}
                                            type={"email"}
                                            onBlur={() => trigger("email")}
                                        />
                                    );
                                }}
                                control={control}
                            />
                            <FormControl error={Boolean(errors.password)} variant="outlined">
                                <InputLabel htmlFor="password">Пароль</InputLabel>
                                <OutlinedInput
                                    {...register("password", {
                                        required: "Введите пароль",
                                        minLength: {
                                            value: 6,
                                            message: "Пароль должен вмещать 6 и более символов"
                                        }
                                    })}
                                    autoComplete="new-password"
                                    id="password"
                                    label="Пароль"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
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
                                    onBlur={() => trigger("password")}
                                />
                                <FormHelperText>{errors.password?.message}</FormHelperText>
                            </FormControl>
                            <Box
                                sx={{mt: 2, display: "flex", justifyContent: "space-between"}}
                            >
                                {!isOrder ?
                                    <div>
                                        Нет аккаунта?
                                        <NavLink to={REGISTRATION_ROUTE}> Зарегистрируйтесь.</NavLink>
                                    </div> : <div></div>}
                                <Button type="submit"
                                        variant="outlined"
                                        color={"warning"}
                                        disabled={Object.keys(errors).length !== 0}
                                >
                                    Войти
                                </Button>
                            </Box>
                        </Box>


                    </form>
                </CardContent>
            </Card>
        </Container>)
}

export default Login;