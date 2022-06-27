import React, {useState} from 'react';
import Modal from '@mui/material/Modal';
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {FormControl, InputAdornment, TextField} from "@mui/material";
import {updateCity} from "../../../http/cityAPI";
import {useDispatch, useSelector} from "react-redux";
import {setChangeCityAction} from "../../../store/CityStore";


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
const EditCity = ({open, onClose, cityToEdit, alertMessage,}) => {
    const dispatch = useDispatch()
    const cities = useSelector(state => state.city)
    const [cityName, setCityName] = useState(cityToEdit.name)
    const [errCity, setErrCity] = useState(false)
    const [blurCityName, setBlurCityName] = useState(false)
    const [blurPrice, setBlurPrice] = useState(false)
    const [price, setPrice] = useState(cityToEdit.price)

    const changeCity = async () => {
        const cityInfo = {
            id: cityToEdit.id,
            name: cityName.trim(),
            price: price
        }
        try {
            await updateCity(cityInfo)
            dispatch(setChangeCityAction(cityInfo))
            close()
            alertMessage('Название изменено успешно', false)
        } catch (e) {
            setErrCity(true)
            alertMessage('Не удалось изменить название', true)
        }
    }
    const close = () => {
        setErrCity(false)
        setBlurCityName(false)
        setCityName("")
        onClose()
    }

    //--------------------Validation
    const validName = blurCityName && cityName.length === 0
    return (
        <div>
            <Modal
                open={open}
                onClose={close}
            >
                <Box sx={style}>
                    <Typography align="center" id="modal-modal-title" variant="h6" component="h2">
                        Изменить название города {cityToEdit.name}
                    </Typography>
                    <Box sx={{display: "flex", flexDirection: "column"}}>
                        <FormControl>
                            <TextField
                                error={errCity || validName}
                                helperText={validName ? "Введите название города" :
                                    errCity ? "Город с таким именем уже существует" : false}
                                sx={{mt: 1}}
                                id="city"
                                label="Введите город"
                                variant="outlined"
                                value={cityName}
                                onFocus={() => setBlurCityName(false)}
                                onBlur={() => setBlurCityName(true)}
                                onChange={e => {
                                    setCityName(e.target.value)
                                    setErrCity(false)
                                }}
                            />
                            <TextField
                                error={errCity || blurPrice && price <= 0}
                                type="number"
                                sx={{mt: 1}}
                                id="city"
                                label="Цена за час работы мастера"
                                variant="outlined"
                                value={price}
                                onFocus={() => setBlurPrice(false)}
                                onBlur={() => setBlurPrice(true)}
                                onChange={e => {
                                    setPrice(Number(e.target.value))
                                }}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">Грн</InputAdornment>,
                                }}
                            />
                        </FormControl>
                        <Box
                            sx={{mt: 2, display: "flex", justifyContent: "space-between"}}
                        >
                            <Button color="success" sx={{flexGrow: 1,}}
                                    disabled={!cityName || errCity || !price}
                                    variant="outlined"
                                    onClick={changeCity}> Изменить</Button>
                            <Button color="error" sx={{flexGrow: 1, ml: 2}} variant="outlined"
                                    onClick={close}> Закрыть</Button>
                        </Box>
                    </Box>

                </Box>
            </Modal>
        </div>
    );
};

export default EditCity;
