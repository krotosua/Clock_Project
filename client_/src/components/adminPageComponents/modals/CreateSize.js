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
    const [sizeName, setSizeName] = useState("")
    const [sizeTime, setSizeTime] = useState(null)
    const [errSize, setErrSize] = useState(false)
    const [openTime, setOpenTime] = useState(false)
    const [blurSizeName, setBlurSizeName] = useState(false)
    let {size} = useContext(Context)

    const addSize = () => {
        if (!sizeName || !sizeTime) {
            setErrSize(true)
            return
        }
        createSize({name: sizeName.trim(), date: sizeTime.toLocaleTimeString()}).then(res => {
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
                setErrSize(true)
                alertMessage("Не удалось добавить размер часов", true)
            })
    }
    const close = () => {
        setErrSize(false)
        setSizeName("")
        setSizeTime(null)
        setOpenTime(false)
        setBlurSizeName(false)
        onClose()
    }
    //--------------------Validation
    const validName = blurSizeName && sizeName.length == 0
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
