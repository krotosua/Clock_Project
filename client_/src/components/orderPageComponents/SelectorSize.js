import * as React from 'react';
import {useEffect, useState} from 'react';
import {Box, FormControl, InputLabel, MenuItem, Select} from '@mui/material';
import {fetchSize} from "../../http/sizeAPI";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP, width: 250,
        },
    },
};

export default function SelectorSize({setChosenSize, sizeToEdit, chosenSize, closeList, editOpen, cleanMaster}) {
    const [clock, setClock] = useState(chosenSize.id ?? sizeToEdit ?? '');
    const [clockList, setClockList] = useState([])
    useEffect(async () => {
        try {
            const res = await fetchSize(null, null)
            setClockList(res.data.rows)
        } catch (e) {
            setClockList([])
        }
    }, []);

    const handleEditChange = (event) => {
        setClock(event.target.value);
        closeList()
    };
    const handleChange = (event) => {
        setClock(event.target.value);
        cleanMaster()
    };


    return (<Box sx={{minWidth: 120}}>
            <FormControl fullWidth>

                <InputLabel id="size"> Выберите размер часов</InputLabel>
                <Select
                    labelId="size"
                    value={clock}
                    label={"Выберите размер часов"}
                    onChange={editOpen ? handleEditChange : handleChange}
                    MenuProps={MenuProps}
                >
                    {clockList.map((clock, index) => <MenuItem
                        key={index}
                        value={clock.id}
                        onClick={() => setChosenSize(clock)}
                    >
                        {clock.name}
                    </MenuItem>)}

                </Select>
            </FormControl>
        </Box>
    );
}
