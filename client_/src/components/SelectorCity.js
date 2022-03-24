import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import {useContext, useState} from "react";
import {Context} from "../index";
import {FormHelperText} from "@mui/material";


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

export default function SelectorCity({Edit, cityChosen, readOnly, error}) {
    let {cities} = useContext(Context)
    const [city, setCity] = useState(Edit || cityChosen || "");

    const handleChange = (event) => {
        setCity(event.target.value);
        cities.setSelectedCity(event.target.value)
    };

    return (
        <Box sx={{minWidth: 120}}>
            <FormControl fullWidth>
                <InputLabel id="citySel">Выберите город</InputLabel>
                <Select
                    error={error && city === ""}
                    labelId="citySel"
                    value={city}
                    readOnly={readOnly}
                    label="Выберите город"
                    onChange={handleChange}
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
