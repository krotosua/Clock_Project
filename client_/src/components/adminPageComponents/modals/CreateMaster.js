import React, {useState} from 'react';
import Modal from '@mui/material/Modal';
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {FormControl, FormHelperText, InputAdornment, OutlinedInput, TextField} from "@mui/material";
import SelectorMasterCity from "./SelectorMasterCity";
import InputLabel from "@mui/material/InputLabel";
import IconButton from "@mui/material/IconButton";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {registrationFromAdmin} from "../../../http/userAPI";
import {useDispatch} from "react-redux";
import {setSelectedCityAction} from "../../../store/CityStore";
import {FormProvider, useForm} from "react-hook-form";
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
const CreateMaster = ({open, onClose, alertMessage, getMasters}) => {
    const dispatch = useDispatch()
    const [showPassword, setShowPassword] = useState(false)
    const [showPasswordCheck, setShowPasswordCheck] = useState(false)
    const {
        register,
        handleSubmit,
        trigger,
        setValue,
        setError,
        getValues,
        formState: {errors, dirtyFields}
    } = useForm();
    const addMaster = async ({email, password, masterName, rating, cityList}) => {
        const masterData = {
            email,
            password,
            isMaster: true,
            name: masterName,
            rating: Number(rating),
            cityId: cityList.map(city => city.id)
        }
        try {
            await registrationFromAdmin(masterData)
            await getMasters()
            close()
            alertMessage("Мастер успешно добавлен", false)
        } catch (e) {
            if (e.message === ERROR_400) {
                setError("email", {
                    type: "manual",
                    message: "Такой email уже занят"
                })
            }
            alertMessage("Не удалось добавить мастера", true)
        }
    }
    const close = () => {
        dispatch(setSelectedCityAction([]))
        onClose()
    }
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
    };
    return (
        <Modal
            open={open}
            onClose={close}
        >
            <div>
                <FormProvider register={register} errors={errors} trigger={trigger} setValue={setValue}>
                    <form onSubmit={handleSubmit(addMaster)}>
                        <Box sx={style}>
                            <Typography align="center" id="modal-modal-title" variant="h6" component="h2">
                                Добавить мастера
                            </Typography>
                            <Box sx={{display: "flex", flexDirection: "column"}}>
                                <FormControl>
                                    <TextField
                                        {...register("masterName", {
                                            required: "Введите имя мастера",
                                            shouldFocusError: false,
                                        })}
                                        error={Boolean(errors.masterName)}
                                        helperText={errors.masterName?.message}
                                        sx={{my: 1}}
                                        id="masterName"
                                        label={`Укажите имя мастера`}
                                        variant="outlined"
                                        required
                                        onBlur={() => trigger("masterName")}
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
                                    <TextField
                                        {...register("rating", {
                                            validate: {
                                                positive: value => parseInt(value) >= 0 || 'Рейтинг должен быть больше не меньше 0',
                                                lessThanSix: value => parseInt(value) < 6 || 'Рейтинг должен быть не больше 5',
                                            }
                                        })}
                                        sx={{mb: 1}}
                                        id="rating"
                                        error={Boolean(errors.rating)}
                                        helperText={errors.rating?.message}
                                        label={`Укажите рейтинг от 0 до 5`}
                                        variant="outlined"
                                        defaultValue={0}
                                        name="rating"
                                        type="number"
                                        InputProps={{
                                            inputProps: {
                                                max: 5, min: 0
                                            }
                                        }}
                                        onBlur={() => trigger("rating")}
                                    />
                                    <SelectorMasterCity/>
                                </FormControl>
                                <Box
                                    sx={{mt: 2, display: "flex", justifyContent: "space-between"}}
                                >
                                    <Button color="success" sx={{flexGrow: 1,}}
                                            variant="outlined"
                                            type="submit"
                                            disabled={Object.keys(errors).length !== 0}>
                                        Добавить
                                    </Button>
                                    <Button color="error" sx={{flexGrow: 1, ml: 2}} variant="outlined"
                                            onClick={close}> Закрыть</Button>
                                </Box>
                            </Box>
                        </Box>
                    </form>
                </FormProvider>
            </div>
        </Modal>
    );
}

export default CreateMaster;
