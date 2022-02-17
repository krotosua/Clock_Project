import React, {useContext, useEffect, useState} from 'react';
import Modal from '@mui/material/Modal';
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {FormControl, TextField} from "@mui/material";
import {createMaster} from "../../../http/masterAPI";
import SelectorCity from "../../SelectorCity"

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
const CreateMaster = ({open, onClose}) => {
    const [name, setName] = useState('')
    const [rating, setRating] = useState(0)
    const addMaster = () => {
        createMaster({}).then(data => {

        })
    }

    return (
        <div>

            <Modal
                open={open}
                onClose={onClose}
            >
                <Box sx={style}>

                    <Typography align="center" id="modal-modal-title" variant="h6" component="h2">
                        Добавить мастера
                    </Typography>
                    <Box sx={{display: "flex", flexDirection: "column"}}>
                        <FormControl>
                            <TextField
                                sx={{mt: 1}}
                                id="masterName"
                                label="Введите имя мастера"
                                variant="outlined"
                                value={name}
                                required
                                onChange={e => setName(e.target.value)}
                            />
                            <TextField
                                sx={{my: 2}}
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
                            <SelectorCity/>
                        </FormControl>
                        <Box
                            sx={{mt: 2, display: "flex", justifyContent: "space-between"}}
                        >
                            <Button color="success" sx={{flexGrow: 1,}} variant="outlined"
                                    onClick={addMaster}> Добавить</Button>
                            <Button color="error" sx={{flexGrow: 1, ml: 2}} variant="outlined"
                                    onClick={onClose}> Закрыть</Button>
                        </Box>
                    </Box>

                </Box>
            </Modal>
        </div>
    );
};

export default CreateMaster;
