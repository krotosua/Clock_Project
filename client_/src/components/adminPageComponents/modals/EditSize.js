import React, {useContext, useState} from 'react';
import Modal from '@mui/material/Modal';
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {FormControl, TextField} from "@mui/material";

import {Context} from "../../../index";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {TimePicker} from "@mui/lab";
import {updateSize} from "../../../http/sizeAPI";


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
const EditCity = ({open, onClose, idToEdit, alertMessage, nameToEdit}) => {
    const [nameSize, setNameSize] = useState(null)
    const [time, setTime] = useState(null)
    const [error, setError] = useState(false)
    let {size} = useContext(Context)

    const changeSize = () => {
        const changeInfo = {
            id: idToEdit
        }
        if (nameSize) {
            changeInfo.name = nameSize
            change("name", nameSize)
        }
        if (time) {
            changeInfo.date = time.toLocaleTimeString()
            change("date", time.toLocaleTimeString())
        }


        updateSize(changeInfo).then(res => {

            close()
            alertMessage('Название изменено успешно', false)
        }, err => {
            setError(true)
            alertMessage('Не удалось изменить название', true)
        })
    }

    function change(prop, value) { // изменение input поля
        size.setSize(size.size.map(obj =>
            obj.id == idToEdit ? {...obj, [prop]: value} : obj
        ));
    }

    const close = () => {
        setError(false)
        setNameSize(null)
        setTime(null)
        onClose()
    }

    return (
        <div>
            <Modal
                open={open}
                onClose={onClose}
            >
                <Box sx={style}>
                    <Typography align="center" id="modal-modal-title" variant="h6" component="h2">
                        Изменить параметры часов
                    </Typography>
                    <Box sx={{display: "flex", flexDirection: "column"}}>
                        <FormControl>
                            <TextField
                                error={error}
                                helperText={error && nameSize === "" ? "Введите название часов" :
                                    error ? "Часы с таким именем уже существуют" : ""}
                                sx={{my: 2}}
                                id="city"
                                label="Введите название часов"
                                variant="outlined"
                                defaultValue={nameToEdit}
                                onChange={e => {
                                    setNameSize(e.target.value)
                                    setError(false)
                                }}
                            />
                            <div>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <TimePicker
                                        label="Кол-во часов на ремонт"
                                        value={time}
                                        onChange={(newValue) => {
                                            setTime(newValue);
                                        }}
                                        ampm={false}
                                        views={["hours"]}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </LocalizationProvider>
                            </div>

                        </FormControl>
                        <Box
                            sx={{mt: 2, display: "flex", justifyContent: "space-between"}}
                        >
                            <Button color="success" sx={{flexGrow: 1,}} variant="outlined"
                                    onClick={changeSize}> Изенить часы</Button>
                            <Button color="error" sx={{flexGrow: 1, ml: 2}} variant="outlined"
                                    onClick={close}> Закрыть</Button>
                        </Box>
                    </Box>

                </Box>
            </Modal>
        </div>
    );
};

export default EditCity;
