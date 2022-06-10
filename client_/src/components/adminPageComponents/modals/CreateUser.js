import React, {useContext, useEffect, useState} from 'react';
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
import {Context} from "../../../index";
import SelectorMasterCity from "./SelectorMasterCity";
import {fetchUsers, registrationFromAdmin} from "../../../http/userAPI";
import InputLabel from "@mui/material/InputLabel";
import IconButton from "@mui/material/IconButton";
import {Visibility, VisibilityOff} from "@mui/icons-material";


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
const CreateUser = (({open, onClose, alertMessage,}) => {
    const {cities, user} = useContext(Context)
    const [email, setEmail] = useState("")
    const [error, setError] = useState(false)
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [blurPassword, setBlurPassword] = useState(false)
    const [blurEmail, setBlurEmail] = useState(false)


    const [passwordCheck, setPasswordCheck] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showPasswordCheck, setShowPasswordCheck] = useState(false)
    const [blurPasswordCheck, setBlurPasswordCheck] = useState(false)
    const [isMaster, setIsMaster] = useState(false)

    const createUser = () => {
let masterData,customerData
        isMaster ?
            masterData={
                email,password,isMaster,isActivated:true, name, cityId: cities.selectedCity
            }:
            customerData={
                email,password,isMaster,isActivated:true, name,
            }
        isMaster ?
            registrationFromAdmin(masterData)
                .then(res => {
                    close()

                    alertMessage("Пользователь успешно добавлен", false)
                    fetchUsers(user.page, 10).then(res => {
                        if (res.status === 204) {
                            return user.setIsEmpty(true)

                        }
                        user.setIsEmpty(false)
                        user.setUsersList(res.data.rows)
                        user.setTotalCount(res.data.count)
                    }, error => user.setIsEmpty(true))
                }, (err) => {
                    alertMessage("Не удалось добавить пользователя", true)

                })
            :
            registrationFromAdmin(customerData)
                .then(res => {
                    close()
                    alertMessage("Пользователь успешно добавлен", false)
                    fetchUsers(user.page, 10).then(res => {
                        if (res.status === 204) {
                            return user.setIsEmpty(true)

                        }
                        user.setIsEmpty(false)
                        user.setUsersList(res.data.rows)
                        user.setTotalCount(res.data.count)
                    }, error => user.setIsEmpty(true))
                }, err => {

                    alertMessage("Не удалось добавить пользователя", true)

                })

    }
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
    };
    const close = () => {
        fetchUsers(user.page, 10).then(res => {
            user.setIsEmpty(false)
            user.setUsersList(res.data.rows)
            user.setTotalCount(res.data.count)
        }, (err) => {
        })
        onClose()
    }

    //--------------------Validation
    const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    const unlockButton = isMaster ?
        !email || reg.test(email) === false || !name || cities.selectedCity.length === 0 :
        !email || reg.test(email) === false || !name
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
                    <Box sx={{display: "flex", flexDirection: "column"}}>
                        <TextField
                            error={error}
                            sx={{my: 2}}
                            id="name"
                            label="Укажите имя"
                            variant="outlined"
                            value={name}
                            onChange={(e => {
                                setName(e.target.value)
                            })}
                        />
                        <FormControl>
                            <TextField
                                error={error || blurEmail && reg.test(email) === false}
                                sx={{mb: 2}}
                                id="Email"
                                label="Email"
                                variant="outlined"
                                type={"email"}
                                value={email}
                                helperText={blurEmail && reg.test(email) === false ?
                                    "Введите email формата: clock@clock.com" :
                                    error ? "Пользователь с таким email уже существует" : error ? "Неверный email или пароль" : ""
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
                                    autocomplete="new-password"
                                    error={error || blurPassword && password.length < 6 || blurPasswordCheck ? password !== passwordCheck : false}
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
                            <FormControl sx={{my: 2}} variant="outlined">
                                <InputLabel htmlFor="Check Password">Подтвердить пароль</InputLabel>
                                <OutlinedInput
                                    autocomplete="new-password"
                                    error={error || blurPasswordCheck && password !== passwordCheck}
                                    id="Check Password"
                                    label="Подтвердить пароль"
                                    type={showPasswordCheck ? 'text' : 'password'}
                                    value={passwordCheck}
                                    onChange={(e => {
                                        setPasswordCheck(e.target.value)
                                        setError(false)
                                    })}
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
                                    onFocus={() => setBlurPasswordCheck(false)}
                                    onBlur={() => setBlurPasswordCheck(true)}
                                />
                                <FormHelperText
                                    error={true}>{blurPasswordCheck && password !== passwordCheck ? "Пароли не совпадают" : ""}</FormHelperText>

                            </FormControl>
                            {isMaster ?
                                <Box>
                                    <SelectorMasterCity error={false}/>
                                </Box>
                                : null}


                            <Box>
                                <FormControlLabel
                                    label="Зарегестрировать как мастера"
                                    control={<Checkbox onChange={(e) => {
                                        setIsMaster(!isMaster)
                                    }}/>}
                                />
                            </Box>

                        </FormControl>
                        <Box
                            sx={{mt: 2, display: "flex", justifyContent: "space-between"}}
                        >
                            <Button color="success" sx={{flexGrow: 1,}} variant="outlined"
                                    disabled={unlockButton}
                                    onClick={createUser}>
                                Изменить
                            </Button>
                            <Button color="error" sx={{flexGrow: 1, ml: 2}} variant="outlined"
                                    onClick={close}> Закрыть</Button>
                        </Box>
                    </Box>

                </Box>
            </Modal>
        </div>
    );
});

export default CreateUser;
