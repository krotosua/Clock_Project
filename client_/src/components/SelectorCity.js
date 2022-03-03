import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
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

export default function SelectorCity({Edit}) {
    let {cities} = useContext(Context)
    const [city, setCity] = useState(Edit || "");


    const handleChange = (event) => {
        setCity(event.target.value);
        cities.setSelectedCity(event.target.value)
    };

    return (
        <Box sx={{minWidth: 120}}>
            <FormControl fullWidth>
                <InputLabel id="citySel">Выберите город</InputLabel>
                <Select
                    labelId="citySel"
                    value={city}
                    label="Выберите город"
                    onChange={handleChange}
                    MenuProps={MenuProps}
                >
                    {cities.cities.map((city) =>
                        <MenuItem
                            key={city.id}
                            value={city.id}
                        >
                            {city.name}
                        </MenuItem>
                    )}
                </Select>
            </FormControl>
        </Box>
    );
}
