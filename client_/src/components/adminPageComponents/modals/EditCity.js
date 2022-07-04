import React from 'react';
import Modal from '@mui/material/Modal';
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {FormControl, InputAdornment, TextField} from "@mui/material";
import {updateCity} from "../../../http/cityAPI";
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
const EditCity = ({open, onClose, cityToEdit, alertMessage, getCities}) => {
    const {register, handleSubmit, trigger, setError, formState: {errors}} = useForm();
    const changeCity = async ({nameCity, price}) => {
        const cityInfo = {
            id: cityToEdit.id,
            name: nameCity.trim(),
            price: price
        }
        try {
            await updateCity(cityInfo)
            await getCities()
            alertMessage('Название изменено успешно', false)
            close()
        } catch (e) {
            setError("nameCity", {
                type: "manual",
                message: "Город с таким названием существует"
            })
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
                onClose={close}
            >

                <form onSubmit={handleSubmit(changeCity)}>
                    <Box sx={style}>
                        <Typography align="center" id="modal-modal-title" variant="h6" component="h2">
                            Добавить название города
                        </Typography>
                        <Box sx={{display: "flex", flexDirection: "column"}}>
                            <FormControl>
                                <TextField
                                    {...register("nameCity", {
                                        required: "Введите название города",
                                        shouldFocusError: false,
                                    })}
                                    error={Boolean(errors.nameCity)}
                                    helperText={errors.nameCity?.message}
                                    sx={{mt: 1}}
                                    defaultValue={cityToEdit.name}
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
                                    defaultValue={cityToEdit.price}
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
                                <Button color="success" type="submit" sx={{flexGrow: 1,}} variant="outlined"
                                        disabled={Object.keys(errors).length !== 0}
                                > Изменить</Button>
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

export default EditCity;
