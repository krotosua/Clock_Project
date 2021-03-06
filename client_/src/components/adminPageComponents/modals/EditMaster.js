import React, {useContext, useEffect, useState} from 'react';
import Modal from '@mui/material/Modal';
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {FormControl, TextField} from "@mui/material";
import {createMaster, fetchMasters, updateMaster} from "../../../http/masterAPI";
import SelectorCity from "../../SelectorCity"
import {Context} from "../../../index";
import SelectorMasterCity from "./SelectorMasterCity";


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
const EditMaster = (({open, onClose, idToEdit, alertMessage, nameToEdit, ratingToEdit, cityChosen}) => {
    const {cities, masters} = useContext(Context)
    const [masterName, setMasterName] = useState(nameToEdit)
    const [masterRating, setMasterRating] = useState(ratingToEdit)
    const [blurMasterName, setBlurMasterName] = useState(false)
    const [errMaster, setErrMaster] = useState(false)

    useEffect(() => {
        cities.setSelectedCity(cityChosen.map(city => city.id))
    }, [])
    const changeMaster = () => {
        const changeInfo = {
            id: idToEdit,
            name: masterName.trim(),
            rating: masterRating,
            cityId: cities.selectedCity
        }

        updateMaster(changeInfo)
            .then(res => {
                close()
                alertMessage('Данные мастера успешно изменены', false)
            }, err => {
                setErrMaster(true)
                alertMessage('Не удалось изменить данные мастера', true)
            })
    }


    function close() {
        fetchMasters(null, null, masters.page, 10).then(res => {
            masters.setMasters(res.data.rows)
            masters.setTotalCount(res.data.rows.length)
        }, (err) => {
        })
        setErrMaster(false)
        onClose()
    }

    //--------------------Validation
    const validButton = masterRating > 5 || masterRating < 0 || !masterName
    const validName = errMaster || blurMasterName && masterName.length == 0
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
                                    }
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
