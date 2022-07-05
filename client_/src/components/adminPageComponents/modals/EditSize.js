import React from 'react';
import {Box, Button, FormControl, FormHelperText, Modal, TextField, Typography} from "@mui/material";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {TimePicker} from "@mui/lab";
import {updateSize} from "../../../http/sizeAPI";
import {Controller, useForm} from "react-hook-form";
import ruLocale from "date-fns/locale/ru";


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
    const {register, watch, trigger, control, handleSubmit, setError, setValue, formState: {errors}} = useForm({
        defaultValues: {
            sizeName: sizeToEdit.name,
            time: dateToEdit,
            openTime: false
        }
    });

    const changeSize = async ({sizeName, time}) => {
        const changeInfo = {
            id: idToEdit,
            date: time.toLocaleTimeString(),
            name: sizeName.trim(),
        }
        try {
            await updateSize(changeInfo)
            await getSize()
            close()
            alertMessage('Название изменено успешно', false)
        } catch (e) {
            alertMessage('Не удалось изменить название', true)
        }
    }

    const close = () => {
        onClose()
    }
    return (
        <div>
            <Modal
                open={open}
                onClose={onClose}
            >
                <form onSubmit={handleSubmit(changeSize)}>
                    <Box sx={style}>
                        <Typography align="center" id="modal-modal-title" variant="h6" component="h2">
                            Изменить параметры часов
                        </Typography>
                        <Box sx={{display: "flex", flexDirection: "column"}}>
                            <FormControl>
                                <TextField
                                    {...register("sizeName", {
                                        required: "Введите название часов",
                                        shouldFocusError: false,
                                    })}
                                    sx={{my: 2}}
                                    error={Boolean(errors.sizeName)}
                                    helperText={errors.sizeName?.message}
                                    id="sizeName"
                                    name="sizeName"
                                    label="Введите название часов"
                                    variant="outlined"
                                    onBlur={() => trigger("sizeName")}
                                />
                                <div>
                                    <Controller
                                        name="time"
                                        control={control}
                                        render={({field: {onChange, value}, fieldState: {error}}) => (
                                            <LocalizationProvider dateAdapter={AdapterDateFns} locale={ruLocale}>
                                                <TimePicker
                                                    readOnly
                                                    label="Выберите время"
                                                    value={value || ""}
                                                    open={watch("openTime", false)}
                                                    onChange={(newValue) => {
                                                        onChange(newValue)
                                                        setValue("openTime", false)
                                                    }}
                                                    minTime={new Date(0, 0, 0, 1)}
                                                    onError={() =>
                                                        setError("time", {
                                                            type: "manual",
                                                            message: "Неверное время"
                                                        })}
                                                    onBlur={() => trigger("time")}
                                                    ampm={false}
                                                    views={["hours"]}
                                                    renderInput={(params) =>
                                                        <TextField
                                                            sx={{
                                                                '& .MuiInputBase-input': {
                                                                    cursor: "pointer"
                                                                }
                                                            }}
                                                            onClick={() => {
                                                                setValue("openTime", true)
                                                            }}
                                                            {...params} />}
                                                />
                                            </LocalizationProvider>)}
                                        rules={{
                                            required: 'Укажите время'
                                        }}
                                    />
                                </div>
                                <FormHelperText
                                    sx={{mt: -2}}
                                    error={Boolean(errors.time)}>{errors.time?.message}</FormHelperText>
                            </FormControl>
                            <Box
                                sx={{mt: 2, display: "flex", justifyContent: "space-between"}}
                            >
                                <Button color="success" sx={{flexGrow: 1,}} variant="outlined"
                                        disabled={Object.keys(errors).length !== 0}
                                        type="submit"> Изенить часы</Button>
                                <Button color="error" sx={{flexGrow: 1, ml: 2}} variant="outlined"
                                        onClick={close}> Закрыть</Button>
                            </Box>
                        </Box>

                    </Box>
                </form>
            </Modal>
        </div>
    );
};

export default EditSize;
