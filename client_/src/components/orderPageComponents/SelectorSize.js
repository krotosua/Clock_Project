import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import {Context} from "../../index";
import {useContext} from "react";

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

export default function SelectorSize() {
    const {size} = useContext(Context)
    const [clock, setClock] = React.useState('');
    const handleChange = (event) => {
        setClock(event.target.value);
        size.setSelectedSize(event.target.value)
    };


    return (
        <Box sx={{minWidth: 120}}>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Выберите размер часов</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={clock}
                    label="Выберите размер часов"
                    onChange={handleChange}
                    MenuProps={MenuProps}
                >
                    {size.size.map((clock) =>
                        <MenuItem
                            key={clock.id}
                            value={clock}
                        >
                            {clock.name}
                        </MenuItem>
                    )}

                </Select>
            </FormControl>
        </Box>
    );
}
