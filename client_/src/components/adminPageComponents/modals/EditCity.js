import React, {useContext, useState} from 'react';
import Modal from '@mui/material/Modal';
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {FormControl, TextField} from "@mui/material";
import {updateCity} from "../../../http/cityAPI";
import {Context} from "../../../index";


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
const EditCity = ({open, onClose, idToEdit, alertMessage, getValue}) => {
    const [nameCity, setNameCity] = useState("")
    const [error, setError] = useState(false)
    let {cities} = useContext(Context)

    const changeCity = () => {
        updateCity({id: idToEdit, name: nameCity}).then(res => {
            change("name", nameCity)
            setNameCity("")
            onClose()
            alertMessage('Название изменено успешно', false)
        }, err => {
            setError(true)
            alertMessage('Не удалось изменить название', true)
        })
    }


    function change(prop, value) { // изменение input поля
        cities.setCities(cities.cities.map(obj =>
            obj.id == idToEdit ? {...obj, [prop]: value} : obj
        ));
    }

    return (
        <div>
            <Modal
                open={open}
                onClose={onClose}
            >
                <Box sx={style}>

                    <Typography align="center" id="modal-modal-title" variant="h6" component="h2">
                        Изменить название города {getValue('name', cities.cities, idToEdit)}
                    </Typography>
                    <Box sx={{display: "flex", flexDirection: "column"}}>
                        <FormControl>
                            <TextField
                                error={error}
                                helperText={error && nameCity == "" ? "Введите название города" :
                                    error ? "Город с таким названием уже существует" : ""}
                                sx={{mt: 1}}
                                id="city"
                                label="Введите город"
                                variant="outlined"
                                value={nameCity}
                                onChange={e => {
                                    setNameCity(e.target.value)
                                    setError(false)
                                }}
                            />
                        </FormControl>
                        <Box
                            sx={{mt: 2, display: "flex", justifyContent: "space-between"}}
                        >
                            <Button color="success" sx={{flexGrow: 1,}} variant="outlined"
                                    onClick={changeCity}> Изменить</Button>
                            <Button color="error" sx={{flexGrow: 1, ml: 2}} variant="outlined"
                                    onClick={onClose}> Закрыть</Button>
                        </Box>
                    </Box>

                </Box>
            </Modal>
        </div>
    );
};

export default EditCity;
