import React, {useState} from 'react';
import {Box, Button, FormControl, Modal, TextField, Typography} from "@mui/material";
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
const EditSize = ({open, onClose, idToEdit, alertMessage, sizeToEdit, dateToEdit, getSize}) => {

    const [sizeName, setSizeName] = useState(sizeToEdit.name)
    const [sizeTime, setSizeTime] = useState(dateToEdit)
    const [errSize, setErrSize] = useState(false)
    const [openTime, setOpenTime] = useState(false)
    const [blurSizeName, setBlurSizeName] = useState(false)


    const changeSize = async () => {
        const changeInfo = {
            id: idToEdit,
            date: sizeTime.toLocaleTimeString(),
            name: sizeName.trim()
        }
        try {
            await updateSize(changeInfo)
            getSize()
            close()
            alertMessage('Название изменено успешно', false)
        } catch (e) {
            setErrSize(true)
            alertMessage('Не удалось изменить название', true)
        }
    }


    const close = () => {
        setErrSize(false)
        setSizeName("")
        setSizeTime(null)
        setOpenTime(false)
        onClose()
    }
    //--------------------Validation
    const validName = blurSizeName && sizeName.length === 0
    const validButton = errSize || sizeName.length === 0 || !sizeTime
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
                                error={errSize || validName}
                                helperText={validName ? "Введите название часов" :
                                    errSize ? "Часы с таким именем уже существуют" : ""}
                                sx={{my: 2}}
                                id="city"
                                label="Введите название часов"
                                variant="outlined"
                                value={sizeName}
                                onFocus={() => setBlurSizeName(false)}
                                onBlur={() => setBlurSizeName(true)}
                                onChange={e => {
                                    setSizeName(e.target.value)
                                    setErrSize(false)
                                }}

                            />
                            <div>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <TimePicker
                                        readOnly
                                        label="Кол-во часов на ремонт"
                                        open={openTime}
                                        value={sizeTime}
                                        onChange={(newValue) => {
                                            setSizeTime(newValue);
                                            setOpenTime(false)
                                        }}
                                        minTime={new Date(0, 0, 0, 1)}
                                        ampm={false}
                                        views={["hours"]}
                                        renderInput={(params) =>
                                            <TextField onClick={() => setOpenTime(true)}
                                                       sx={{
                                                           '& .MuiInputBase-input': {
                                                               cursor: "pointer"
                                                           }
                                                       }}
                                                       {...params} />}
                                    />
                                </LocalizationProvider>
                            </div>

                        </FormControl>
                        <Box
                            sx={{mt: 2, display: "flex", justifyContent: "space-between"}}
                        >
                            <Button color="success" sx={{flexGrow: 1,}} variant="outlined"
                                    disabled={validButton}
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

export default EditSize;
