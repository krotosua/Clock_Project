import React, {useContext, useEffect, useState} from 'react';
import Modal from '@mui/material/Modal';
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {FormControl, TextField} from "@mui/material";
import {createCity, fetchCity,} from "../../../http/cityAPI";
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
const CreateCity = ({open, onClose, alertMessage,}) => {
    const [name, setName] = useState("")

    const [error, setError] = useState(false)
    let {cities} = useContext(Context)
    const addCity = () => {
        createCity({name: name}).then(res => {
                cities.setIsEmpty(false)
                alertMessage("Город успешно создан", false)
                close()
                fetchCity(cities.page, 10).then(res => {
                    cities.setIsEmpty(false)
                    cities.setCities(res.data.rows)
                    cities.setTotalCount(res.data.count)
                }, error => cities.setIsEmpty(true))

            },
            err => {
                setError(true)
                alertMessage("Не удалось создать город", true)
            })
    }
    const close = () => {
        setError(false)
        setName("")
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
                        Добавить название города
                    </Typography>
                    <Box sx={{display: "flex", flexDirection: "column"}}>
                        <FormControl>
                            <TextField
                                error={error}
                                helperText={error && name == "" ? "Введите название города" :
                                    error ? "Город с таким именем уже существует" : ""}
                                sx={{mt: 1}}
                                id="city"
                                label="Введите город"
                                variant="outlined"
                                value={name}
                                onChange={e => {
                                    setName(e.target.value)
                                    setError(false)
                                }}
                            />
                        </FormControl>
                        <Box
                            sx={{mt: 2, display: "flex", justifyContent: "space-between"}}
                        >
                            <Button color="success" sx={{flexGrow: 1,}} variant="outlined"
                                    onClick={addCity}> Добавить</Button>
                            <Button color="error" sx={{flexGrow: 1, ml: 2}} variant="outlined"
                                    onClick={close}> Закрыть</Button>
                        </Box>
                    </Box>

                </Box>
            </Modal>
        </div>
    );
};

export default CreateCity;
