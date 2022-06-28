import React, {useEffect, useState} from 'react';
import Modal from '@mui/material/Modal';
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {FormControl, TextField} from "@mui/material";
import {updateMaster} from "../../../http/masterAPI";
import SelectorMasterCity from "./SelectorMasterCity";
import {useDispatch, useSelector} from "react-redux";
import {setSelectedCityAction} from "../../../store/CityStore";


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

    const cities = useSelector(state => state.city)
    const dispatch = useDispatch()
    const [masterName, setMasterName] = useState(nameToEdit)
    const [masterRating, setMasterRating] = useState(ratingToEdit)
    const [blurMasterName, setBlurMasterName] = useState(false)
    const [errMaster, setErrMaster] = useState(false)

    useEffect(() => {
        dispatch(setSelectedCityAction(cityChosen.map(city => city.id)))
    }, [])
    const changeMaster = async () => {
        const changeInfo = {
            id: idToEdit,
            name: masterName.trim(),
            rating: masterRating,
            cityId: cities.selectedCity
        }
        try {
            await updateMaster(changeInfo)
            await getMasters()
            close()
            alertMessage('Данные мастера успешно изменены', false)
        } catch (e) {
            setErrMaster(true)
            alertMessage('Не удалось изменить данные мастера', true)
        }
    }

    const close = () => {
        setErrMaster(false)
        onClose()
    }
    //--------------------Validation
    const validButton = masterRating > 5 || masterRating < 0 || !masterName
    const validName = errMaster || blurMasterName && masterName.length === 0
    const validRating = masterRating > 5 || masterRating < 0
    return (
        <div>
            <Modal
                open={open}
                onClose={close}
            >
                <Box sx={style}>
                    <Typography align="center" id="modal-modal-title" variant="h6" component="h2">
                        ИЗМЕНИТЬ ДАННЫЕ МАСТЕРА
                    </Typography>
                    <Box sx={{display: "flex", flexDirection: "column"}}>
                        <FormControl>
                            <TextField
                                error={validName}
                                helperText={validName ? "Введите имя мастера" : ""}
                                sx={{mt: 1}}
                                id="masterName"
                                label={`Текущуее имя мастера: ${nameToEdit}`}
                                variant="outlined"
                                value={masterName}
                                required
                                onFocus={() => setBlurMasterName(false)}
                                onBlur={() => setBlurMasterName(true)}
                                onChange={e => setMasterName(e.target.value)}
                            />
                            <TextField
                                sx={{my: 2}}
                                id="masterRating"
                                error={validRating}
                                helperText='Введите рейтинг от 0 до 5'
                                label={`Текущуее рейтинг мастера: ${ratingToEdit}`}
                                variant="outlined"
                                value={masterRating}
                                type="number"
                                InputProps={{
                                    inputProps: {
                                        max: 5, min: 0
                                    }, inputMode: 'numeric', pattern: '[0-9]*'
                                }}
                                onChange={e => setMasterRating(Number(e.target.value))}
                            />
                            <SelectorMasterCity open={open} cityChosen={cityChosen} error={errMaster}/>
                        </FormControl>
                        <Box
                            sx={{mt: 2, display: "flex", justifyContent: "space-between"}}
                        >
                            <Button color="success" sx={{flexGrow: 1,}} variant="outlined"
                                    onClick={changeMaster}
                                    disabled={validButton}>
                                Изменить
                            </Button>
                            <Button color="error" sx={{flexGrow: 1, ml: 2}} variant="outlined"
                                    onClick={close}> Закрыть</Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
});

export default EditMaster;
