import React, {useContext, useEffect, useState} from 'react';
import Modal from '@mui/material/Modal';
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {FormControl, TextField} from "@mui/material";
import {createMaster, fetchMasters, updateMaster} from "../../../http/masterAPI";
import SelectorCity from "../../SelectorCity"
import {Context} from "../../../index";
import SelectorMasterCity from "./SelectorMasterCity";
import {fetchUsers} from "../../../http/userAPI";


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
    const [masterName, setMasterName] = useState("")
    const [userRole, setUserRole] = useState(userToEdit.role)
    const [userEmail, setUserEmail] = useState(userToEdit.email)
    const [blurMasterName, setBlurMasterName] = useState(false)
    const [errMaster, setErrMaster] = useState(false)


    const changeMaster = () => {
        const changeInfo = {}
    }

    function close() {
        fetchUsers(user.page, 10).then(res => {
            user.setIsEmpty(false)
            user.setUsersList(res.data.rows)
            user.setTotalCount(res.data.count)
        }, (err) => {
        })
        setErrMaster(false)
        onClose()
    }

    //--------------------Validation

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
                                label="Изменить email пользователя"
                                sx={{mt: 1}}
                                id="masterName"
                                variant="outlined"
                                value={userEmail}
                                required
                                onFocus={() => setBlurMasterName(false)}
                                onBlur={() => setBlurMasterName(true)}
                                onChange={e => setUserEmail(e.target.value)}

                            />

                        </FormControl>
                        <Box
                            sx={{mt: 2, display: "flex", justifyContent: "space-between"}}
                        >
                            <Button color="success" sx={{flexGrow: 1,}} variant="outlined"
                                    onClick={changeMaster}>
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
