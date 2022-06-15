import * as React from 'react';
import {Box, InputLabel, MenuItem, FormControl, Select, FormHelperText} from '@mui/material';
import {useContext, useState} from "react";
import {Context} from "../index";


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

export default function SelectorCity({
                                         Edit,
                                         cityChosen,
                                         cityToEdit,
                                         cleanMaster,
                                         error,
                                         closeList,
                                         editOpen,
                                         setCityChosen
                                     }) {
    let {cities} = useContext(Context)
    const [city, setCity] = useState(Edit || cityChosen || "");

    const handleEditChange = (event) => {
        setCity(event.target.value);
        cities.setSelectedCity(event.target.value)
        closeList()
        cleanMaster()
        cityToEdit()
    };
    const handleChange = (event) => {
        setCity(event.target.value);
        cities.setSelectedCity(event.target.value)
        setCityChosen()
        cleanMaster()
    };

    return (
        <Box sx={{minWidth: 120}}>
            <FormControl fullWidth>
                <InputLabel id="citySel">Выберите город</InputLabel>
                <Select
                    error={error && city === ""}
                    labelId="citySel"
                    value={city}
                    label="Выберите город"
                    onChange={editOpen ? handleEditChange : handleChange}
                    MenuProps={MenuProps}
                >
                    {cities.cities.map((city, index) =>
                        <MenuItem
                            key={index}
                            value={city.id}

                        >
                            {city.name}
                        </MenuItem>
                    )}
                </Select>
                {error && city === "" ?
                    <FormHelperText>Укажите город</FormHelperText> : ""}
            </FormControl>
        </Box>
    );
}
