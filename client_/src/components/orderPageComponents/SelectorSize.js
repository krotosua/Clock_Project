import * as React from 'react';
import {useState} from 'react';
import {Box, FormControl, InputLabel, MenuItem, Select} from '@mui/material';
import {useDispatch, useSelector} from "react-redux";
import {setSelectedSizeAction} from "../../store/SizeStore";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP, width: 250,
        },
    },
};

export default function SelectorSize({sizeToEdit, closeList, editOpen, cleanMaster}) {
    const dispatch = useDispatch()
    const size = useSelector(state => state.sizes)
    const [clock, setClock] = useState(size.selectedSize.id ?? '');

    const handleEditChange = (event) => {
        setClock(event.target.value);
        sizeToEdit()
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
                    {size.sizes.map((clock, index) => <MenuItem
                        key={index}
                        value={clock.id}
                        onClick={() => dispatch(setSelectedSizeAction(clock))}
                    >
                        {clock.name}
                    </MenuItem>)}

                </Select>
            </FormControl>
        </Box>
    );
}
