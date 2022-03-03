import React, {useContext, useState} from 'react';
import Modal from '@mui/material/Modal';
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {FormControl, TextField} from "@mui/material";
import {createCity, fetchCity,} from "../../../http/cityAPI";
import {Context} from "../../../index";
import {createSize, fetchSize} from "../../../http/sizeAPI";
import Stack from "@mui/material/Stack";


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
    const [value, setValue] = useState("")
    const [time, setTime] = useState("")
    const [error, setError] = useState(false)
    let {size} = useContext(Context)

    const addSize = () => {
        

        createSize({name: value, date: time}).then(res => {
                setValue('')
                onClose()
                size.setIsEmpty(false)
                fetchSize().then(res => size.setSize(res.data.rows))
                alertMessage("Размер часов добавлен", false)
            },
            err => {
                setError(true)
                alertMessage("Не удалось добавить размер часов", true)
            })
    }


    return (
        <div>

            <Modal
                open={open}
                onClose={onClose}
            >
                <Box sx={style}>

                    <Typography align="center" id="modal-modal-title" variant="h6" component="h2">
                        Добавить новые размеры часов
                    </Typography>
                    <Box sx={{display: "flex", flexDirection: "column"}}>
                        <FormControl>
                            <TextField
                                error={error}
                                helperText={error && value == "" ? "Введите название часов" :
                                    error ? "Часы с таким именем уже существуют" : ""}
                                sx={{my: 2}}
                                id="city"
                                label="Введите название часов"
                                variant="outlined"
                                value={value}
                                onChange={e => {
                                    setValue(e.target.value)
                                    setError(false)
                                }}
                            />
                            <Stack component="form" noValidate spacing={3}>

                                <TextField
                                    id="datetime-local"
                                    label="Количество времени для ремонта "
                                    type="time"
                                    open="hours"
                                    views="hours"
                                    defaultValue="01:00"
                                    sx={{width: 250}}

                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onChange={e => {
                                        setTime(e.target.value)
                                    }}
                                />
                            </Stack>
                        </FormControl>
                        <Box
                            sx={{mt: 2, display: "flex", justifyContent: "space-between"}}
                        >
                            <Button color="success" sx={{flexGrow: 1,}} variant="outlined"
                                    onClick={addSize}> Добавить</Button>
                            <Button color="error" sx={{flexGrow: 1, ml: 2}} variant="outlined"
                                    onClick={onClose}> Закрыть</Button>
                        </Box>
                    </Box>

                </Box>
            </Modal>
        </div>
    );
};

export default CreateSize;
