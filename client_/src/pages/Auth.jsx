import React, {useState} from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    Container,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grow,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    TextField,
    Typography
} from "@mui/material";
import {NavLink, useLocation, useNavigate} from "react-router-dom";
import {CONGRATULATION_ROUTE, LOGIN_ROUTE,} from "../utils/consts";
import {registration} from "../http/userAPI";
import SelectorMultipleCity from "../components/adminPageComponents/modals/SelectorMultipleCity";
import MyAlert from "../components/adminPageComponents/MyAlert";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import Login from "../components/authPageComponents/Login";
import {FormProvider, useForm} from "react-hook-form";
import {ERROR_400} from "../utils/constErrors";


const Auth = () => {
    const location = useLocation();
    const navigate = useNavigate()
    const isLogin = location.pathname === LOGIN_ROUTE;
    const [showPassword, setShowPassword] = useState(false)
    const [showPasswordCheck, setShowPasswordCheck] = useState(false)
    const [open, setOpen] = useState(false)
    const [isError, setIsError] = useState(false)
    const [message, setMessage] = useState("")

    const {
        register,
        handleSubmit,
        trigger,
        setValue,
        clearErrors,
        getValues, watch, setError,
        formState: {errors, dirtyFields}
    } = useForm();
    const isAgree = watch("isAgree", false);
    const isMaster = watch("isMaster", false)
    const alertMessage = (message, bool) => {
        setOpen(true)
        setMessage(message)
        setIsError(bool)
    }

    const singIn = async ({email, password, name, cityList, isMaster}) => {
        try {
            const dataUser = {
                email,
                password,
                isMaster: isMaster ?? false,
                name,
                cityId: isMaster ? cityList.map(city => city.id) : undefined
            }
            await registration(dataUser)
            navigate(CONGRATULATION_ROUTE)
            alertMessage("Письмо для подтверждения Email отправлено на почту", false)
        } catch (e) {
            if (e.message === ERROR_400) {
                setError("email", {
                    type: "manual",
                    message: "Такой email уже занят"
                })
            }
        }
    }
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
    };
    return (
        isLogin ?
            <Login alertMessage={alertMessage}/> :
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
                            Регистрация
                        </Typography>
                        <FormProvider register={register} getValues={getValues} errors={errors} trigger={trigger}
                                      setValue={setValue}>
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

                                    <FormControl error={true}>
                                        <TextField
                                            {...register("name", {
                                                required: "Введите Ваше имя",
                                                shouldFocusError: false,
                                            })}
                                            error={Boolean(errors.name)}
                                            helperText={errors.name?.message}
                                            sx={{my: 1}}
                                            id="name"
                                            label={`Укажите имя`}
                                            variant="outlined"
                                            required
                                            onBlur={() => trigger("name")}
                                        />
                                        <TextField
                                            {...register("email", {
                                                required: "Введите email",
                                                shouldFocusError: false,
                                                pattern: {
                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                    message: "Введите email формата: clock@clock.com"
                                                }
                                            })}
                                            error={Boolean(errors.email)}
                                            sx={{mb: 1}}
                                            id="Email"
                                            label="Email"
                                            variant="outlined"
                                            helperText={errors.email?.message}
                                            type={"email"}
                                            name={"email"}
                                            required
                                            onBlur={() => trigger("email")}
                                        />
                                        <FormControl
                                            error={Boolean(errors.password || errors.passwordCheck?.type === "isSame")}
                                            variant="outlined">
                                            <InputLabel required htmlFor="password">Пароль</InputLabel>
                                            <OutlinedInput
                                                {...register("password", {
                                                    required: "Введите пароль",
                                                    minLength: {
                                                        value: 6,
                                                        message: "Пароль должен вмещать 6 и более символов"
                                                    },
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
                                                onBlur={() => {
                                                    trigger("password")
                                                    trigger("passwordCheck")
                                                }}
                                            />
                                            <FormHelperText>{errors.password?.message}</FormHelperText>
                                        </FormControl>
                                        <FormControl sx={{my: 1}} error={Boolean(errors.passwordCheck)}
                                                     variant="outlined">
                                            <InputLabel required htmlFor="passwordCheck">Повторите
                                                пароль</InputLabel>
                                            <OutlinedInput
                                                {...register("passwordCheck", {
                                                    required: "Повторите пароль",
                                                    minLength: {
                                                        value: 6,
                                                        message: "Пароль должен вмещать 6 и более символов"
                                                    },
                                                    validate: {
                                                        isSame: value => dirtyFields?.passwordCheck && dirtyFields?.password ? value === getValues("password") || "Пароли не одинаковые" : null
                                                    }
                                                })}
                                                defaultValue=""
                                                autoComplete="new-password"
                                                id="passwordCheck"
                                                label="Повторите пароль"
                                                type={showPasswordCheck ? 'text' : 'password'}
                                                name="passwordCheck"
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
                                                onBlur={() => {
                                                    trigger("passwordCheck")
                                                    trigger("password")
                                                }}
                                            />
                                            <FormHelperText>{errors.passwordCheck?.message}</FormHelperText>
                                        </FormControl>


                                        {isMaster &&
                                            <Grow in={isMaster}>
                                                <Box>
                                                    <SelectorMultipleCity/>
                                                </Box>
                                            </Grow>}

                                        <Box>
                                            <Box>
                                                <FormControl error={Boolean(errors.isAgree)}>
                                                    <FormControlLabel
                                                        label="Cо всем согласен"
                                                        control={
                                                            <Checkbox
                                                                required
                                                                {...register("isAgree")}
                                                            />}/>
                                                    <FormHelperText>{errors.isAgree?.message}</FormHelperText>
                                                </FormControl>
                                            </Box>
                                            <Box>
                                                <FormControlLabel
                                                    label="Зарегестрироваться как мастер"
                                                    control={
                                                        <Checkbox  {...register("isMaster")}
                                                                   onClick={() => {
                                                                       clearErrors("cityList")
                                                                       setValue("cityList", null)
                                                                   }}/>}
                                                />

                                            </Box>
                                        </Box>

                                        <Box
                                            sx={{mt: 2, display: "flex", justifyContent: "space-between"}}
                                        >

                                            <div>
                                                Есть аккаунт? <NavLink to={LOGIN_ROUTE}>Войти.</NavLink>
                                            </div>

                                            <Button type="submit" variant="outlined"
                                                    color={"warning"}
                                                    disabled={Object.keys(errors).length !== 0}>
                                                Регистрация
                                            </Button>
                                        </Box>

                                    </FormControl>

                                </Box>
                            </form>
                        </FormProvider>
                    </CardContent>
                </Card>
                <MyAlert open={open}
                         onClose={() => setOpen(false)}
                         message={message}
                         isError={isError}/>
            </Container>
    )
};

export default Auth;
