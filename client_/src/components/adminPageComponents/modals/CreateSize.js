import React, {useContext, useState} from 'react';
import Modal from '@mui/material/Modal';
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {FormControl, InputAdornment, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import {Context} from "../../../index";
import {createSize, fetchSize} from "../../../http/sizeAPI";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {TimePicker} from "@mui/lab";
import Brightness5Icon from "@mui/icons-material/Brightness5";
import OutlinedInput from "@mui/material/OutlinedInput";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";


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
const CreateSize = ({open, onClose, alertMessage}) => {
    const [sizeName, setSizeName] = useState("")
    const [sizeTime, setSizeTime] = useState(null)
    const [errSize, setErrSize] = useState(false)
    const [openTime, setOpenTime] = useState(false)
    const [blurSizeName, setBlurSizeName] = useState(false)
    const [priceList, setPriceList] = useState([])
    let {size, cities} = useContext(Context)

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

    const addSize = () => {
        if (!sizeName || !sizeTime) {
            setErrSize(true)
            return
        }
        if (priceList.findIndex(price => !price.price || !price.cityId) >= 0) {
            alertMessage('Заполните все поля', true)
            return
        }
        const infoSize = {
            name: sizeName.trim(),
            date: sizeTime.toLocaleTimeString(),
            priceList
        }
        createSize(infoSize).then(res => {
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
                                        changePrice('price', Number(e.target.value), i.number)}
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
