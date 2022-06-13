import React, {useContext, useEffect, useState} from 'react';
import {
    Modal,
    Button,
    Box,
    Typography,
    FormControl,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    TextField
} from "@mui/material";
import {Context} from "../../../index";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {TimePicker, LocalizationProvider} from "@mui/lab";
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
const EditCity = ({open, onClose, idToEdit, alertMessage, sizeToEdit, dateToEdit, getSize}) => {
    let {size, cities} = useContext(Context)
    const [sizeName, setSizeName] = useState(sizeToEdit.name)
    const [sizeTime, setSizeTime] = useState(dateToEdit)
    const [errSize, setErrSize] = useState(false)
    const [openTime, setOpenTime] = useState(false)
    const [blurSizeName, setBlurSizeName] = useState(false)
    const [priceList, setPriceList] = useState([])

    useEffect(() => {
        setPriceList(sizeToEdit.prices.map((item, obj) => obj = {
            id: item.id,
            price: item.price,
            cityId: item.cityId,
            number: item.id
        }))
    }, [])
    const changeSize = async () => {
        if (priceList.findIndex(price => !price.price || !price.cityId) >= 0) {
            alertMessage('Заполните все поля', true)
            return
        }
        const changeInfo = {
            id: idToEdit,
            priceList,
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
    const addPrice = () => {
        setPriceList([...priceList, {price: "", cityId: "", number: Date.now()}])
    }
    const deleteCity = (event) => {
        cities.setCities(cities.cities.filter(city => city.id !== event.target.value));
    }
    const changePrice = (key, value, number) => {
        if (key === "cityId" && priceList.findIndex(city => city.cityId === value) >= 0) {
            alertMessage("Город уже выбран", true)
            return
        }
        setPriceList(priceList.map(price => price.number === number ? {...price, [key]: value} : price))
    }
    const removePrice = (number) => {
        setPriceList(priceList.filter(price => price.number !== number))
    }

    const change = (prop, value) => { // изменение input поля
        size.setSize(size.size.map(size =>
            size.id === idToEdit ? {...size, [prop]: value} : size
        ));
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
                            {priceList.map((i, index) =>

                                <Box key={index + 1} sx={{display: 'flex', my: 1,}}>
                                    <FormControl fullWidth>
                                        <InputLabel id="city">Город</InputLabel>
                                        <Select
                                            id="city"
                                            value={i.cityId}
                                            label="Город"
                                            onChange={(e) =>
                                                changePrice('cityId', e.target.value, i.number)}
                                        >
                                            {cities.cities.map(city => {
                                                return (
                                                    <MenuItem
                                                        key={city.id}
                                                        onClick={deleteCity}
                                                        value={city.id}>{city.name}</MenuItem>
                                                )
                                            })}
                                        </Select>

                                    </FormControl>
                                    <TextField
                                        sx={{mx: 4}}
                                        fullWidth
                                        error={errSize || validName}
                                        id="price"
                                        type="number"
                                        label="Цена"
                                        variant="outlined"
                                        value={i.price}
                                        onChange={(e) =>
                                            changePrice('price', e.target.value, i.number)}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">Грн</InputAdornment>,
                                        }}
                                    />
                                    <Button
                                        sx={{width: 200}}
                                        variant="outlined"
                                        color="error"
                                        onClick={() => removePrice(i.number)}
                                    >Удалить</Button>
                                </Box>
                            )}


                            <Button color="warning"
                                    sx={{my: 1}}
                                    variant="outlined"
                                    disabled={priceList.length === cities.cities.length}
                                    onClick={addPrice}>
                                Добавить цену в городе
                            </Button>

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

export default EditCity;
