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
import {createMaster, fetchMasters, updateMaster} from "../../../http/masterAPI";
import SelectorCity from "../../SelectorCity"
import {Context} from "../../../index";
import SelectorMasterCity from "./SelectorMasterCity";
import {fetchUsers, updateUser} from "../../../http/userAPI";
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
const EditUser = (({open, onClose, userToEdit, alertMessage,}) => {
    const {cities, user} = useContext(Context)
    const [userEmail, setUserEmail] = useState(userToEdit.email)
const [blurEmail, setBlurEmail] = useState(false)
const [editPassword, setEditPassword] = useState(false)
    const [password, setPassword] = useState('')
    const [passwordCheck, setPasswordCheck] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showPasswordCheck, setShowPasswordCheck] = useState(false)
    const [error, setError] = useState(false)
    const [blurPassword, setBlurPassword] = useState(false)
    const [blurPasswordCheck, setBlurPasswordCheck] = useState(false)
    const changeUser = () => {
        const changeInfo = {
            email:userEmail
        }
        if(editPassword){
            changeInfo.password = password
        }
        updateUser(userToEdit.id,changeInfo).then(
            res=>{
                close()
                alertMessage("Успешно измененно",false)
            },err=>{
                console.log(err)
                alertMessage("Не удалось изменить ",true)
            }
        )
    }

    const close = () =>{
        fetchUsers(user.page, 10).then(res => {
            user.setIsEmpty(false)
            user.setUsersList(res.data.rows)
            user.setTotalCount(res.data.count)
        }, (err) => {
        })
        onClose()
    }
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
    };

    //--------------------Validation
    const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

    return (
        <div>
            <Modal
                open={open}
                onClose={close}
            >
                <Box sx={style}>

                    <Typography align="center" id="modal-modal-title" variant="h6" component="h2">
                        Изменить данные пользователя
                    </Typography>
                    <Box sx={{display: "flex", flexDirection: "column"}}>
                        <FormControl>
                            <TextField
                                error={blurEmail && reg.test(userEmail) == false}
                                label="Изменить email пользователя"
                                sx={{mt: 1}}
                                id="masterName"
                                variant="outlined"
                                value={userEmail}
                                required
                                onFocus={() => setBlurEmail(false)}
                                onBlur={() => setBlurEmail(true)}
                                onChange={e => setUserEmail(e.target.value)}

                            />

                        </FormControl>
                        {editPassword?

                                <FormControl sx={{my: 1}}  variant="outlined">
                                <InputLabel htmlFor="Password">Пароль</InputLabel>
                                <OutlinedInput
                                    error={error || blurPassword && password.length < 6 || blurPasswordCheck ? password !== passwordCheck : false}
                                    id="Password"
                                    label="Новый пароль"
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
                            </FormControl>:null}

                        {editPassword?
                            <FormControl variant="outlined">
                                <InputLabel htmlFor="Check Password">Подтвердить пароль</InputLabel>
                                <OutlinedInput
                                    error={error || blurPasswordCheck && password !== passwordCheck}
                                    id="Check Password"
                                    label="Подтвердить новый пароль"
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

                            </FormControl>:null}


                        <Box>
                            <FormControlLabel
                                label="Сменить пароль"
                                control={
                                    <Checkbox onChange={(e) => setEditPassword(e.target.checked)}/>}

                            />
                        </Box>
                        <Box
                            sx={{mt: 2, display: "flex", justifyContent: "space-between"}}
                        >
                            <Button color="success" sx={{flexGrow: 1,}} variant="outlined"
                                    disabled={blurEmail && reg.test(userEmail) == false}
                                    onClick={changeUser}>
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

export default EditUser;
