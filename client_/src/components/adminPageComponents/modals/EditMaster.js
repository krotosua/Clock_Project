import React, {useEffect} from 'react';
import Modal from '@mui/material/Modal';
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {FormControl, TextField} from "@mui/material";
import {updateMaster} from "../../../http/masterAPI";
import SelectorMasterCity from "./SelectorMasterCity";
import {FormProvider, useForm} from "react-hook-form";


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
const EditMaster = (({open, onClose, idToEdit, alertMessage, nameToEdit, ratingToEdit, cityChosen, getMasters}) => {

    const {register, handleSubmit, trigger, setValue, getValues, formState: {errors}} = useForm();
    useEffect(() => {
        setValue("cityList", cityChosen)
    }, [])
    const changeMaster = async ({masterName, rating, cityList}) => {
        const changeInfo = {
            id: idToEdit,
            name: masterName.trim(),
            rating,
            cityId: cityList.map(city => city.id)
        }
        console.log(changeInfo)
        return
        try {
            await updateMaster(changeInfo)
            await getMasters()
            close()
            alertMessage('Данные мастера успешно изменены', false)
        } catch (e) {
            alertMessage('Не удалось изменить данные мастера', true)
        }
    }

    const close = () => {
        onClose()
    }

    return (
        <Modal
            open={open}
            onClose={close}
        >
            <div>
                <FormProvider register={register} errors={errors} trigger={trigger} setValue={setValue}>
                    <form onSubmit={handleSubmit(changeMaster)}>
                        <Box sx={style}>
                            <Typography align="center" id="modal-modal-title" variant="h6" component="h2">
                                Добавить мастера
                            </Typography>
                            <Box sx={{display: "flex", flexDirection: "column"}}>
                                <FormControl>
                                    <TextField
                                        {...register("masterName", {
                                            required: "Введите имя мастера",
                                            shouldFocusError: false,
                                        })}
                                        error={Boolean(errors.masterName)}
                                        helperText={errors.masterName?.message}
                                        sx={{my: 1}}
                                        id="masterName"
                                        defaultValue={nameToEdit}
                                        label={`Укажите имя мастера`}
                                        variant="outlined"
                                        required
                                        onBlur={() => trigger("masterName")}
                                    />
                                    <TextField
                                        {...register("rating", {
                                            validate: {
                                                positive: value => parseInt(value) >= 0 || 'Рейтинг должен быть больше не меньше 0',
                                                lessThanSix: value => parseInt(value) < 6 || 'Рейтинг должен быть не больше 5',
                                            }
                                        })}
                                        sx={{mb: 1}}
                                        id="rating"
                                        error={Boolean(errors.rating)}
                                        helperText={errors.rating?.message}
                                        label={`Укажите рейтинг от 0 до 5`}
                                        variant="outlined"
                                        defaultValue={ratingToEdit}
                                        name="rating"
                                        type="number"
                                        InputProps={{
                                            inputProps: {
                                                max: 5, min: 0
                                            }
                                        }}
                                        onBlur={() => trigger("rating")}
                                    />
                                    <SelectorMasterCity cityChosen={cityChosen}/>
                                </FormControl>
                                <Box
                                    sx={{mt: 2, display: "flex", justifyContent: "space-between"}}
                                >
                                    <Button color="success" sx={{flexGrow: 1,}}
                                            variant="outlined"
                                            type="submit"
                                            disabled={Object.keys(errors).length !== 0}>
                                        Добавить
                                    </Button>
                                    <Button color="error" sx={{flexGrow: 1, ml: 2}} variant="outlined"
                                            onClick={close}> Закрыть</Button>
                                </Box>
                            </Box>
                        </Box>
                    </form>
                </FormProvider>
            </div>
        </Modal>
    );
});

export default EditMaster;
