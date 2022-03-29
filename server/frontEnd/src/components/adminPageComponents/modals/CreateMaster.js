import React, {useContext, useEffect, useState} from 'react';
import Modal from '@mui/material/Modal';
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {FormControl, TextField} from "@mui/material";
import {createMaster, fetchMaster} from "../../../http/masterAPI";
import SelectorCity from "../../SelectorCity"
import {Context} from "../../../index";
import {observer} from "mobx-react-lite";
import {fetchCity} from "../../../http/cityAPI";

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

    const [name, setName] = useState("")
    const [rating, setRating] = useState("")
    const [error, setError] = useState(false)
    const addMaster = () => {

        const masterData = {
            name: name,
            rating: rating,
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
                masters.setTotalCount(res.data.count)
            }, (err) => {
                return masters.setIsEmpty(true)

            })
        }, err => {
            setError(true)
            alertMessage("Не удалось добавить мастера", true)
        })
    }
    const close = () => {
        setName("")
        setRating("")
        setError(false)
        cities.setSelectedCity("")
        onClose()
    }

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
                                sx={{mt: 1}}
                                error={error && name === ""}
                                id="masterName"
                                label="Введите имя мастера"
                                variant="outlined"
                                value={name}
                                required
                                onChange={e => setName(e.target.value)}
                            />
                            <TextField
                                sx={{my: 2}}
                                error={error && rating === "" || rating > 5 || rating < 0}
                                id="masterRating"
                                label="Укажите рейтинг от 0 до 5"
                                variant="outlined"
                                value={rating}
                                type="number"
                                InputProps={{
                                    inputProps: {
                                        max: 5, min: 0
                                    }
                                }}
                                required
                                onChange={e => setRating(e.target.value)}
                            />
                            <SelectorCity error={error}/>
                        </FormControl>
                        <Box
                            sx={{mt: 2, display: "flex", justifyContent: "space-between"}}
                        >
                            <Button color="success" sx={{flexGrow: 1,}}
                                    variant="outlined"
                                    onClick={addMaster}
                                    disabled={rating > 5 || rating < 0}>
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
