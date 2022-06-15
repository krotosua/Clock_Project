import * as React from 'react';
import {OutlinedInput,InputLabel,MenuItem,FormControl,ListItemText,Select,Checkbox} from '@mui/material';
import {useContext, useState} from "react";
import {Context} from "../../../index";

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


export default function SelectorMasterCity({cityChosen, error, open}) {
    let {cities} = useContext(Context)
    const [cityName, setCityName] = React.useState(cityChosen || []);
    const [blur, setBlur] = useState(false)
    const handleChange = (event) => {
        const {
            target: {value},
        } = event

        setCityName(
            typeof value === 'string' ? value.split(',') : value,
        );
    };
    const handleClose = () => {
        cities.setSelectedCity(cityName.map(city => (city.id)))
    }

    return (
        <div>
            <FormControl sx={{width: 300}}>
                <InputLabel error={error && cityName.length == 0}
                            id="multiple-checkbox-label">
                    Города где работает мастер
                </InputLabel>
                <Select
                    labelId="multiple-checkbox-label"
                    id="multiple-checkbox"
                    error={error && cityName.length == 0 || open ? cityName.length == 0 && blur : false}
                    multiple
                    value={cityName}
                    onChange={handleChange}
                    onClose={handleClose}
                    onFocus={() => setBlur(false)}
                    onBlur={() => setBlur(true)}
                    input={<OutlinedInput label="Города где работает мастер"/>}
                    renderValue={(selected) => selected.map(sels => sels.name).join(', ')}
                    MenuProps={MenuProps}
                >
                    {cities.cities.map((city, index) => {

                        return (
                            <MenuItem key={index} value={city}>
                                <Checkbox
                                    checked={cityName.indexOf(city) > -1}
                                />
                                <ListItemText
                                    primary={city.name}
                                />
                            </MenuItem>
                        )
                    })}
                </Select>
            </FormControl>
        </div>
    );
}