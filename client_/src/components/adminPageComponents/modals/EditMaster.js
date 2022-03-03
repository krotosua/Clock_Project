import React, {useContext, useEffect, useState} from 'react';
import Modal from '@mui/material/Modal';
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {FormControl, TextField} from "@mui/material";
import {createMaster, fetchMaster, updateMaster} from "../../../http/masterAPI";
import SelectorCity from "../../SelectorCity"
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
const EditMaster = (({open, onClose, idToEdit, alertMessage}) => {
    const {cities, masters} = useContext(Context)
    const [masterName, setName] = useState(getValue('name'))
    const [masterRating, setRating] = useState(getValue('rating'))
    const [error, setError] = useState(false)


    const changeMaster = () => {

        const changeInfo = {
            id: idToEdit,
            name: masterName,
            rating: masterRating,
            cityId: cities.selectedCity
        }

        console.log(changeInfo)
        updateMaster(changeInfo)
            .then(res => {
                change("name", masterName)
                change("rating", masterRating)
                change("cityId", cities.selectedCity)
                setName("")
                setRating(0)
                onClose()
                alertMessage('Данные мастера успешно изменены', false)
            }, err => {
                setError(true)
                alertMessage('Не удалось изменить данные мастера', true)
            })
    }

    function getValue(prop) { // получение значения свойства
        return masters.masters.reduce(
            (res, obj) => obj.id == idToEdit ? obj[prop] : res
            , '');


    }

    function change(prop, value) { // изменение input поля
        masters.setMasters(masters.masters.map(obj =>
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
                        ИЗМЕНИТЬ ДАННЫЕ МАСТЕРА
                    </Typography>
                    <Box sx={{display: "flex", flexDirection: "column"}}>
                        <FormControl>
                            <TextField
                                sx={{mt: 1}}
                                id="masterName"
                                label={`Текущуее имя мастера: ${getValue('name')}`}
                                variant="outlined"
                                value={masterName}
                                required
                                onChange={e => setName(e.target.value)}
                            />
                            <TextField
                                sx={{my: 2}}
                                id="masterRating"
                                label={`Текущуее рейтинг мастера: ${getValue('rating')}`}
                                variant="outlined"
                                value={masterRating || getValue('rating')}
                                type="number"
                                InputProps={{
                                    inputProps: {
                                        max: 5, min: 0
                                    }
                                }}
                                required
                                onChange={e => setRating(e.target.value)}
                            />
                            <SelectorCity Edit={getValue("cityId")}/>
                        </FormControl>
                        <Box
                            sx={{mt: 2, display: "flex", justifyContent: "space-between"}}
                        >
                            <Button color="success" sx={{flexGrow: 1,}} variant="outlined"
                                    onClick={changeMaster}> Добавить</Button>
                            <Button color="error" sx={{flexGrow: 1, ml: 2}} variant="outlined"
                                    onClick={onClose}> Закрыть</Button>
                        </Box>
                    </Box>

                </Box>
            </Modal>
        </div>
    );
});

export default EditMaster;
