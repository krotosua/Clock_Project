import React, {useContext, useState} from 'react';
import Modal from '@mui/material/Modal';
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {FormControl, TextField} from "@mui/material";
import {Context} from "../../../index";
import {createSize, fetchSize} from "../../../http/sizeAPI";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {TimePicker} from "@mui/lab";


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
const CreateSize = ({open, onClose, alertMessage}) => {
    const [nameSize, setNameSize] = useState("")
    const [time, setTime] = useState(null)
    const [error, setError] = useState(false)
    let {size} = useContext(Context)

    const addSize = () => {
        if (!nameSize || !time) {
            setError(true)
            return
        }
        createSize({name: nameSize, date: time.toLocaleTimeString()}).then(res => {
                size.setIsEmpty(false)
                fetchSize(size.page, 10).then(res => {
                    size.setIsEmpty(false)
                    size.setSize(res.data.rows)
                    size.setTotalCount(res.data.count)
                }, (err) => {
                    size.setIsEmpty(true)
                })
                alertMessage("Размер часов добавлен", false)
                close()
            },
            err => {

                setError(err.response.status)
                alertMessage("Не удалось добавить размер часов", true)
            })
    }
    const close = () => {
        setError(false)
        setNameSize("")
        setTime(null)
        onClose()
    }

    return (
        <div>

            <Modal
                open={open}
                onClose={close}
            >
                <Box sx={style}>
                    <Typography align="center" id="modal-modal-title" variant="h6" component="h2">
                        Добавить новые размеры часов
                    </Typography>
                    <Box sx={{display: "flex", flexDirection: "column"}}>
                        <FormControl>
                            <TextField
                                error={error && nameSize == "" || error ? true : false}
                                helperText={error && nameSize === "" ? "Введите название часов" :
                                    error == 400 ? "Такое имя уже существует" : ""}
                                sx={{my: 2}}
                                id="city"
                                label="Введите название часов"
                                variant="outlined"

                                value={nameSize}
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
                                            setError(false)
                                        }}
                                        ampm={false}
                                        views={["hours"]}
                                        renderInput={(params) => <TextField
                                            helperText={error ? "Введите кол-во часов" : ""}
                                            {...params} />}

                                    />
                                </LocalizationProvider>
                            </div>

                        </FormControl>
                        <Box
                            sx={{mt: 2, display: "flex", justifyContent: "space-between"}}
                        >
                            <Button color="success" sx={{flexGrow: 1,}} variant="outlined"
                                    onClick={addSize}> Добавить</Button>
                            <Button color="error" sx={{flexGrow: 1, ml: 2}} variant="outlined"
                                    onClick={close}> Закрыть</Button>
                        </Box>
                    </Box>

                </Box>
            </Modal>
        </div>
    );
};

export default CreateSize;
