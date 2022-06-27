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
    const cities = useSelector(state => state.city)
    const dispatch = useDispatch()
    const [masterName, setMasterName] = useState("")
    const [masterRating, setMasterRating] = useState("")
    const [blurMasterName, setBlurMasterName] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordCheck, setPasswordCheck] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showPasswordCheck, setShowPasswordCheck] = useState(false)
    const [error, setError] = useState(false)
    const [blurPassword, setBlurPassword] = useState(false)
    const [blurPasswordCheck, setBlurPasswordCheck] = useState(false)
    const [blurEmail, setBlurEmail] = useState(false)
    const [errMaster, setErrMaster] = useState(false)
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
            <Box sx={style}>

                <Typography align="center" id="modal-modal-title" variant="h6" component="h2">
                    Добавить мастера
                </Typography>
                <Box sx={{display: "flex", flexDirection: "column"}}>
                    <FormControl>
                        <TextField
                            error={validName}
                            helperText={validName ? "Введите имя мастера" : ""}
                            sx={{my: 1}}
                            id="masterName"
                            label={`Укажите имя мастера`}
                            variant="outlined"
                            value={masterName}
                            required
                            onFocus={() => setBlurMasterName(false)}
                            onBlur={() => setBlurMasterName(true)}
                            onChange={e => setMasterName(e.target.value)}
                        />
                        <TextField
                            error={error || blurEmail && reg.test(email) === false}
                            sx={{mb: 1}}
                            id="Email"
                            label="Email"
                            variant="outlined"
                            type={"email"}
                            value={email}
                            helperText={blurEmail && reg.test(email) === false ? "Введите email формата: clock@clock.com" : error ? "Пользователь с таким email уже существует" : error ? "Неверный email или пароль" : ""}
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
                                endAdornment={<InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff/> : <Visibility/>}
                                    </IconButton>
                                </InputAdornment>}
                                onFocus={() => setBlurPassword(false)}
                                onBlur={() => setBlurPassword(true)}
                            />
                            <FormHelperText>{blurPassword && password.length < 6 ? "Длина пароля должна быть не менее 6 символов" : ""}</FormHelperText>
                        </FormControl>
                        <FormControl sx={{my: 1}} variant="outlined">
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
                                endAdornment={<InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowPasswordCheck(!showPasswordCheck)}
                                        edge="end"
                                    >
                                        {showPasswordCheck ? <VisibilityOff/> : <Visibility/>}
                                    </IconButton>
                                </InputAdornment>}
                                onFocus={() => setBlurPasswordCheck(false)}
                                onBlur={() => setBlurPasswordCheck(true)}
                            />
                            <FormHelperText
                                error={true}>{blurPasswordCheck && password !== passwordCheck ? "Пароли не совпадают" : ""}</FormHelperText>

                        </FormControl>
                        <TextField
                            sx={{mb: 1}}
                            id="masterRating"
                            error={validRating}
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
        </Modal>
    </div>);
}

export default CreateMaster;
