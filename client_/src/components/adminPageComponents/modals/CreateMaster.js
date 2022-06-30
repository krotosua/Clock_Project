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
import {useDispatch, useSelector} from "react-redux";
import {setSelectedCityAction} from "../../../store/CityStore";
import {useForm} from "react-hook-form";

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
    const cities = useSelector(state => state.cities)
    const dispatch = useDispatch()
    const [masterName, setMasterName] = useState("")
    const [masterRating, setMasterRating] = useState("")
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordCheck, setPasswordCheck] = useState('')
    const [blurMasterName, setBlurMasterName] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showPasswordCheck, setShowPasswordCheck] = useState(false)
    const [blurPassword, setBlurPassword] = useState(false)
    const [blurPasswordCheck, setBlurPasswordCheck] = useState(false)
    const [blurEmail, setBlurEmail] = useState(false)
    const [errMaster, setErrMaster] = useState(false)
    const {register, handleSubmit, trigger, setError, getValues, formState: {errors}} = useForm();
    const check = data => console.log(data)
    const addMaster = async () => {
        const masterData = {
            email,
            password,
            isMaster: true,
            name: masterName,
            cityId: cities.selectedCity
        }
        try {
            await registrationFromAdmin(masterData)
            close()
            await getMasters()
            alertMessage("Мастер успешно добавлен", false)
        } catch (e) {
            setErrMaster(true)
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
    console.log(errors)
    //--------------------Validation
    const validButton = masterRating > 5 || masterRating < 0 || !masterName || cities.selectedCity.length === 0
    const validName = blurMasterName && masterName.length === 0
    const validRating = masterRating > 5 || masterRating < 0
    const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    return (<div>

        <Modal
            open={open}
            onClose={close}
        >
            <form onSubmit={handleSubmit(check)}>
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
                                sx={{mb: 2}}
                                id="Email"
                                label="Email"
                                variant="outlined"
                                helperText={errors.email?.message}
                                type={"email"}
                                name={"email"}
                                onBlur={() => trigger("email")}
                            />
                            <FormControl error={getValues("password") !== getValues("passwordCheck")}
                                         variant="outlined">
                                <InputLabel htmlFor="password">Пароль</InputLabel>
                                <OutlinedInput
                                    {...register("password", {
                                        required: "Введите пароль",
                                        minLength: {
                                            value: 6,
                                            message: "Пароль должен вмещать 6 и более символов"
                                        },
                                        validate: {
                                            isValid: value => value !== getValues("passwordCheck")
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
                            <FormControl error={Boolean(errors.passwordCheck)} variant="outlined">
                                <InputLabel htmlFor="passwordCheck">Пароль</InputLabel>
                                <OutlinedInput
                                    {...register("passwordCheck", {
                                        required: "Введите пароль",
                                        minLength: {
                                            value: 6,
                                            message: "Пароль должен вмещать 6 и более символов"
                                        }
                                    })}
                                    autoComplete="new-password"
                                    id="passwordCheck"
                                    label="Пароль"
                                    type={showPassword ? 'text' : 'password'}
                                    name="passwordCheck"
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
                                    onBlur={() => trigger("passwordCheck")}
                                />
                                <FormHelperText>{errors.passwordCheck?.message}</FormHelperText>
                            </FormControl>
                            <TextField
                                sx={{mb: 1}}
                                id="masterRating"
                                helperText={validRating ? 'Введите рейтинг от 0 до 5' : false}
                                label={`Укажите рейтинг от 0 до 5`}
                                variant="outlined"
                                value={masterRating}
                                type="number"
                                InputProps={{
                                    inputProps: {
                                        max: 5, min: 0
                                    }
                                }}
                                onChange={e => setMasterRating(Number(e.target.value))}
                            />
                            <SelectorMasterCity open={open} error={errMaster}/>

                        </FormControl>
                        <Box
                            sx={{mt: 2, display: "flex", justifyContent: "space-between"}}
                        >
                            <Button color="success" sx={{flexGrow: 1,}}
                                    variant="outlined"
                                    onClick={addMaster}
                                    disabled={validButton}>
                                Добавить
                            </Button>
                            <Button color="error" sx={{flexGrow: 1, ml: 2}} variant="outlined"
                                    onClick={close}> Закрыть</Button>
                        </Box>
                    </Box>
                </Box>
            </form>
        </Modal>
    </div>);
}

export default CreateMaster;
