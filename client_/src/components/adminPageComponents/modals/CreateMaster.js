import React, {useContext, useEffect, useState} from 'react';
import Modal from '@mui/material/Modal';
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {FormControl, TextField} from "@mui/material";
import {createMaster, fetchMaster} from "../../../http/masterAPI";
import {Context} from "../../../index";
import {observer} from "mobx-react-lite";
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
const CreateMaster = observer(({open, onClose, alertMessage}) => {
    let {cities, masters} = useContext(Context)
    const [masterName, setMasterName] = useState("")
    const [masterRating, setMasterRating] = useState("")
    const [blurMasterName, setBlurMasterName] = useState(false)
    const [errMaster, setErrMaster] = useState(false)
    const addMaster = () => {

        const masterData = {
            name: masterName.trim(),
            rating: masterRating,
            cityId: cities.selectedCity
        }

        createMaster(masterData).then(res => {
            close()
            alertMessage("Мастер успешно добавлен", false)
            fetchMaster(null, null, masters.page, 10).then(res => {
                if (res.status === 204) {
                    return masters.setIsEmpty(true)
                }
                masters.setIsEmpty(false)
                masters.setMasters(res.data.rows)
                masters.setTotalCount(res.data.rows.length)
            }, (err) => {
                return masters.setIsEmpty(true)

            })
        }, err => {
            setErrMaster(true)
            alertMessage("Не удалось добавить мастера", true)
        })
    }
    const close = () => {
        setMasterName("")
        setMasterRating("")
        setErrMaster(false)
        setBlurMasterName(false)
        cities.setSelectedCity("")
        onClose()
    }
    //--------------------Validation
    const validButton = masterRating > 5 || masterRating < 0 || !masterName
    const validName = blurMasterName && masterName.length == 0
    const validRating = masterRating > 5 || masterRating < 0

    return (
        <div>

            <Modal
                open={open}
                onClose={close}
            >
                <Box sx={style}>

                    <Typography align="center" id="modal-modal-title" variant="h6" component="h2">
                        Добавить мастера
                    </Typography>
                    <Box sx={{display: "flex", flexDirection: "column"}}>
                        <FormControl>
                            <TextField
                                error={validName}
                                helperText={validName ? "Введите имя мастера" : ""}
                                sx={{mt: 1}}
                                id="masterName"
                                label={`Укажите имя мастера`}
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
                                helperText={validRating ? 'Введите рейтинг от 0 до 5' : false}
                                label={`Укажите рейтинг от 0 до 5`}
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
                            <SelectorMasterCity open={open} error={errMaster}/>

                        </FormControl>
                        <Box
                            sx={{mt: 2, display: "flex", justifyContent: "space-between"}}
                        >
                            <Button color="success" sx={{flexGrow: 1,}}
                                    variant="outlined"
                                    onClick={addMaster}
                                    disabled={validButton}>
                                Добавить
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

export default CreateMaster;
