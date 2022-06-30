import React from 'react';
import {Box, Button, FormControl, InputAdornment, Modal, TextField, Typography} from "@mui/material";
import {createCity,} from "../../../http/cityAPI";
import {useForm} from "react-hook-form";


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
const CreateCity = ({open, onClose, alertMessage, getCities}) => {
    const {register, handleSubmit, trigger, setError, formState: {errors}} = useForm();
    const addCity = async ({nameCity, price}) => {
        const cityInfo = {
            name: nameCity,
            price: price
        }
        try {
            await createCity(cityInfo)
            alertMessage("Город успешно создан", false)
            await getCities()
            close()
        } catch (e) {
            setError("nameCity", {
                type: "manual",
                message: "Город с таким названием существует"
            })
            alertMessage("Не удалось создать город", true)
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
                <form onSubmit={handleSubmit(addCity)}>
                    <Box sx={style}>
                        <Typography align="center" id="modal-modal-title" variant="h6" component="h2">
                            Добавить название города
                        </Typography>
                        <Box sx={{display: "flex", flexDirection: "column"}}>
                            <FormControl>
                                <TextField
                                    {...register("nameCity", {
                                        required: "Введите имя Города",
                                        shouldFocusError: false,
                                    })}
                                    error={Boolean(errors.nameCity)}
                                    helperText={errors.nameCity?.message}
                                    sx={{mt: 1}}
                                    id="nameCity"
                                    name='nameCity'
                                    label="Введите город"
                                    variant="outlined"
                                    onBlur={() => trigger("nameCity")}
                                />
                                <TextField
                                    {...register("price", {
                                        required: "Укажите цену",
                                        shouldFocusError: false,
                                        min: {
                                            value: 1,
                                            message: "Минимальная цена 1"
                                        }
                                    })}
                                    sx={{mt: 1}}
                                    error={Boolean(errors.price)}
                                    type="number"
                                    id="price"
                                    helperText={errors.price?.message}
                                    label="Цена за час работы мастера"
                                    variant="outlined"
                                    onBlur={() => trigger("price")}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">Грн</InputAdornment>,
                                    }}
                                />
                            </FormControl>
                            <Box
                                sx={{mt: 2, display: "flex", justifyContent: "space-between"}}
                            >
                                <Button color="success"
                                        type="submit"
                                        disabled={Object.keys(errors).length !== 0}
                                        sx={{flexGrow: 1,}}
                                        variant="outlined"
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

export default CreateCity;
