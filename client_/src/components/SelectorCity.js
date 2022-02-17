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
export default function SelectorCity() {
    const [cityCheck, setCity] = useState('');
    let {cities} = useContext(Context)
    const handleChange = (event) => {
        setCity(event.target.value);
    };
    return (
        <Box sx={{minWidth: 120,}}>
            <FormControl fullWidth>
                <InputLabel id="citySel">Выберите город</InputLabel>
                <Select
                    labelId="citySel"
                    id="demo-simple-select"

                    value={cityCheck}
                    label="Выберите город"
                    onChange={e => setCity(e.target.value)}
                    MenuProps={MenuProps}
                >
                    {cities.cities.map(city =>
                        <MenuItem
                            key={city.id}
                            value={city.id}
                        >{city.name}
                        </MenuItem>
                    )}
                </Select>
            </FormControl>
        </Box>
    );
}
