import React, {useState} from 'react';
import Modal from '@mui/material/Modal';
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
    Checkbox,
    FormControl,
    FormControlLabel,
    FormHelperText,
    InputAdornment,
    OutlinedInput,
    TextField
} from "@mui/material";
import SelectorMasterCity from "./SelectorMasterCity";
import {registrationFromAdmin} from "../../../http/userAPI";
import InputLabel from "@mui/material/InputLabel";
import IconButton from "@mui/material/IconButton";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {Controller, FormProvider, useForm} from "react-hook-form";
import {ERROR_400} from "../../../utils/constErrors";


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};
const CreateUser = (({open, onClose, alertMessage, getUsers}) => {
    const [showPassword, setShowPassword] = useState(false)
    const [showPasswordCheck, setShowPasswordCheck] = useState(false)
    const {
        register,
        handleSubmit,
        trigger,
        setValue,
        control,
        clearErrors,
        getValues,
        formState: {errors, dirtyFields}
    } = useForm();
    const createUser = async ({email, password, name, cityList, setError, isMaster}) => {
        const userData = {
            email,
            password,
            isMaster: isMaster ?? false,
            name,
            isActivated: true,
            cityId: cityList?.map(city => city.id) ?? undefined
        }
        try {
            await registrationFromAdmin(userData)
            close()
            alertMessage("Пользователь успешно добавлен", false)
            getUsers()
        } catch (e) {
            if (e.message === ERROR_400) {
                setError("email", {
                    type: "manual",
                    message: "Такой email уже занят"
                })
            }
            alertMessage("Не удалось добавить пользователя", true)
        }
    }
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
    };
    const close = () => {
        onClose()
    }
    return (
        <div>
            <Modal
                open={open}
                onClose={close}
            >
                <Box sx={style}>
                    <Typography align="center" variant="h5">
                        Регистрация нового пользователя
                    </Typography>
                    <FormProvider register={register} errors={errors} trigger={trigger} setValue={setValue}>
                        <form onSubmit={handleSubmit(createUser)}>
                            <Box sx={{display: "flex", flexDirection: "column"}}>
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
                                            required: dirtyFields?.password ? "Введите пароль" : null,
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
                                            required: dirtyFields?.passwordCheck ? "Повторите пароль" : null,
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
                                {getValues("isMaster") ?
                                    <Box>
                                        <SelectorMasterCity/>
                                    </Box>
                                    : null}

                                <Box>
                                    <FormControlLabel
                                        label="Зарегестрироваться как мастер"
                                        control={
                                            <Controller
                                                name={"isMaster"}
                                                render={({}) => {
                                                    return (
                                                        <Checkbox onChange={(e) => {
                                                            setValue("isMaster", e.target.checked)
                                                            setValue('cityList', null)
                                                            clearErrors("cityList")
                                                        }}/>
                                                    );
                                                }}
                                                control={control}
                                            />
                                        }
                                    />
                                </Box>


                                <Box
                                    sx={{mt: 2, display: "flex", justifyContent: "space-between"}}
                                >
                                    <Button color="success"
                                            type="submit"
                                            sx={{flexGrow: 1,}} variant="outlined"
                                            disabled={Object.keys(errors).length !== 0}>
                                        Зарегестрировать
                                    </Button>
                                    <Button color="error" sx={{flexGrow: 1, ml: 2}} variant="outlined"
                                            onClick={close}> Закрыть</Button>
                                </Box>
                            </Box>
                        </form>
                    </FormProvider>
                </Box>
            </Modal>
        </div>
    );
});

export default CreateUser;
