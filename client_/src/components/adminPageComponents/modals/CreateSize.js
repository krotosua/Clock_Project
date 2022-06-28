import React, {useState} from 'react';
import {Box, Button, FormControl, Modal, TextField, Typography} from "@mui/material";
import {createSize} from "../../../http/sizeAPI";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {TimePicker} from "@mui/lab";


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 900,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};
const CreateSize = ({open, onClose, alertMessage, getSize}) => {
    const [sizeName, setSizeName] = useState("")
    const [sizeTime, setSizeTime] = useState(null)
    const [errSize, setErrSize] = useState(false)
    const [openTime, setOpenTime] = useState(false)
    const [blurSizeName, setBlurSizeName] = useState(false)

    const addSize = async () => {
        if (!sizeName || !sizeTime) {
            setErrSize(true)
            return
        }
        const infoSize = {
            name: sizeName.trim(),
            date: sizeTime.toLocaleTimeString(),
        }
        try {
            await createSize(infoSize)
            alertMessage("Размер часов добавлен", false)
            getSize()
            close()
        } catch (e) {
            setErrSize(true)
            alertMessage("Не удалось добавить размер часов", true)
        }
    }
    const close = () => {
        onClose()
    }
    //--------------------Validation
    const validName = blurSizeName && sizeName.length === 0
    const validButton = errSize || sizeName.length === 0 || !sizeTime
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
                                error={errSize || validName}
                                helperText={validName ? "Введите название часов" :
                                    errSize ? "Часы с таким именем уже существуют" : ""}
                                sx={{mt: 2}}
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
                                <LocalizationProvider sx={{my: 2}} dateAdapter={AdapterDateFns}>
                                    <TimePicker
                                        readOnly

                                        label="Кол-во часов на ремонт"
                                        open={openTime}
                                        value={sizeTime}
                                        minTime={new Date(0, 0, 0, 1)}
                                        ampm={false}
                                        views={["hours"]}
                                        onChange={(newValue) => {
                                            setSizeTime(newValue);
                                            setOpenTime(false)
                                        }}
                                        renderInput={(params) =>
                                            <TextField onClick={() => setOpenTime(true)}
                                                       sx={{
                                                           my: 2,
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
