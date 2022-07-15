import React from 'react';
import {Box, Button, FormControl, FormHelperText, Modal, TextField, Typography} from "@mui/material";
import {createSize} from "../../../http/sizeAPI";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {TimePicker} from "@mui/lab";
import {Controller, useForm} from "react-hook-form";
import ruLocale from "date-fns/locale/ru";
import {ERROR_400} from "../../../utils/constErrors";


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
    const {
        register,
        watch,
        trigger,
        control,
        handleSubmit,
        setError,
        setValue,
        formState: {errors}
    } = useForm({
        defaultValues: {
            time: new Date(new Date().setHours(1, 0, 0)),
            openTime: false
        }
    });

    const addSize = async ({sizeName, time}) => {
        const infoSize = {
            name: sizeName.trim(),
            date: time.toLocaleTimeString(),
        }
        try {
            await createSize(infoSize)
            alertMessage("Размер часов добавлен", false)
            getSize()
            close()
        } catch (e) {
            if (e.message === ERROR_400) {
                setError("sizeName", {
                    type: "manual",
                    message: "Имя уже занято"
                })
            }
            alertMessage("Не удалось добавить размер часов", true)
        }
    }
    const close = () => {
        onClose()
    }
    return (
        <div>
            <Modal
                open={open}
                onClose={close}
            >
                <form onSubmit={handleSubmit(addSize)}>
                    <Box sx={style}>
                        <Typography align="center" id="modal-modal-title" variant="h6" component="h2">
                            Добавить новые размеры часов
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
                                <Button color="success"
                                        sx={{flexGrow: 1}}
                                        variant="outlined"
                                        type="submit"
                                        disabled={Object.keys(errors).length !== 0}
                                > Добавить</Button>
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

export default CreateSize;
