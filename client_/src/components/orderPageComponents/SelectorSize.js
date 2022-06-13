import * as React from 'react';
import {Select, FormControl, MenuItem, InputLabel, Box, FormHelperText,} from '@mui/material';
import {Context} from "../../index";
import {useContext, useEffect, useState} from "react";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP, width: 250,
        },
    },
};

export default function SelectorSize({
                                         loading,
                                         sizeClock,
                                         sizeToEdit,
                                         closeList,
                                         editOpen,
                                         disaledSelector,
                                         cleanMaster,
                                         setSizeClock
                                     }) {
    const {size,cities} = useContext(Context)
    const [clock, setClock] = useState(sizeClock || '');

    useEffect(() =>{
        if(size.selectedSize.date !== "00:00:00"){
            setClock(sizeClock)
            return
        }
        setClock("")
    },[cities.selectedCity])

    const handleEditChange = (event) => {
        setClock(event.target.value);
        cleanMaster()
        sizeToEdit()
        closeList()
    };
    const handleChange = (event) => {
        setClock(event.target.value);
        cleanMaster()
        setSizeClock()
    };

    return (<Box sx={{minWidth: 120}}>
            <FormControl fullWidth>

                <InputLabel disabled={disaledSelector || loading} id="size"> Выберите размер часов</InputLabel>
                <Select
                    labelId="size"
                    value={clock}
                    disabled={disaledSelector}
                    label={"Выберите размер часов"}
                    onChange={editOpen ? handleEditChange : handleChange}
                    MenuProps={MenuProps}
                >
                    {size.size.map((clock, index) => <MenuItem
                        key={index}
                        value={clock.id}
                        onClick={() => size.setSelectedSize(clock)}
                    >
                        {clock.name}
                    </MenuItem>)}

                </Select>
                {disaledSelector ?
                    <FormHelperText>Выберите вначале город</FormHelperText> : null}
            </FormControl>
        </Box>
    );
}
