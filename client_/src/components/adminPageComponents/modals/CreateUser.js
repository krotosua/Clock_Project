import React, {useContext, useEffect, useState} from 'react';
import Modal from '@mui/material/Modal';
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {Checkbox, FormControl, FormControlLabel, TextField} from "@mui/material";
import {createMaster, fetchMasters, updateMaster} from "../../../http/masterAPI";
import SelectorCity from "../../SelectorCity"
import {Context} from "../../../index";
import SelectorMasterCity from "./SelectorMasterCity";
import {fetchUsers, registration} from "../../../http/userAPI";


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
const CreateUser = (({open, onClose,  alertMessage,}) => {
    const {cities, user} = useContext(Context)
    const [role, setRole] = useState("USER")
    const [email, setEmail] = useState("")
    const [error, setError] = useState(false)
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [blurPassword, setBlurPassword] = useState(false)
    const [blurEmail, setBlurEmail] = useState(false)


    const createUser = async() => {
         role === "MASTER"?
            await registration(email, password, role, name, cities.selectedCity):
            await registration(email, password, role)

    }

    function close() {
        fetchUsers(user.page, 10).then(res => {
            user.setIsEmpty(false)
            user.setUsersList(res.data.rows)
            user.setTotalCount(res.data.count)
        }, (err) => {
        })
        onClose()
    }

    //--------------------Validation
    let reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    let unlockButton = role == "MASTER" ?
        !email  || reg.test(email) == false||!name||cities.selectedCity.length == 0:
         !email  || reg.test(email) == false
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
                        <FormControl>
                            <TextField
                                error={error || blurEmail && reg.test(email) == false}
                                sx={{mb: 2}}
                                id="Email"
                                label="Email"
                                variant="outlined"
                                type={"email"}
                                value={email}
                                helperText={blurEmail && reg.test(email) == false ?
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
                            <TextField
                                error={error || blurPassword && password.length < 6}
                                id="Password"
                                label="Password"
                                variant="outlined"
                                type={"password"}
                                value={password}
                                sx={{mb: 2}}
                                helperText={blurPassword && password.length < 6 ?
                                    "Длина пароля должна быть не менее 6 символов" : ""}
                                onChange={(e => {
                                    setPassword(e.target.value)
                                    setError(false)
                                })}
                                onFocus={() => setBlurPassword(false)}
                                onBlur={() => setBlurPassword(true)}
                            />
                            {role == "MASTER" ?
                                <Box>
                                    <SelectorMasterCity error={false}/>
                                    <TextField
                                        error={error}
                                        sx={{mt: 2}}
                                        id="name"
                                        label="Укажите имя мастера"
                                        variant="outlined"
                                        value={name}
                                        onChange={(e => {
                                            setName(e.target.value)
                                        })}
                                    />
                                </Box>
                                : null}


                            <Box>
                                <FormControlLabel
                                    label="Зарегестрировать как мастера"
                                    control={<Checkbox onChange={(e) => {
                                        e.target.checked ? setRole("MASTER") : setRole("USER")
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
