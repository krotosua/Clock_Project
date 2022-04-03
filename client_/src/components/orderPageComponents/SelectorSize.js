import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import {Context} from "../../index";
import {useContext, useState} from "react";

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

export default function SelectorSize({sizeClock, readOnly}) {
    const {size} = useContext(Context)
    const [clock, setClock] = useState(sizeClock || "");

    const handleChange = (event) => {
        setClock(event.target.value);
    };


    return (
        <Box sx={{minWidth: 120}}>
            <FormControl fullWidth>
                <InputLabel id="size">Выберите размер часов</InputLabel>
                <Select
                    labelId="size"
                    value={clock}
                    readOnly={readOnly}
                    label="Выберите размер часов"
                    onChange={handleChange}
                    MenuProps={MenuProps}
                >
                    {size.size.map((clock, index) =>
                        <MenuItem
                            key={index}
                            value={clock.id}
                            onClick={() => size.setSelectedSize(clock)}
                        >
                            {clock.name}
                        </MenuItem>
                    )}

                </Select>
            </FormControl>
        </Box>
    );
}
