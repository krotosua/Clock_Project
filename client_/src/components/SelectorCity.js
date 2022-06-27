import * as React from 'react';
import {useState} from 'react';
import {Box, FormControl, FormHelperText, InputLabel, MenuItem, Select} from '@mui/material';
import {useDispatch, useSelector} from "react-redux";
import {setSelectedCityAction} from "../store/CityStore";


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

export default function SelectorCity({Edit, cityToEdit, cleanMaster, error, closeList, editOpen}) {
    const cities = useSelector(state => state.city)
    const [city, setCity] = useState(Edit ?? cities.selectedCity.id ?? "");
    const dispatch = useDispatch()
    const handleEditChange = (event) => {
        setCity(event.target.value);
        closeList()
        cityToEdit()
    };
    const handleChange = (event) => {
        setCity(event.target.value);
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
                            onClick={() => dispatch(setSelectedCityAction(city))}
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
