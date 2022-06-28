import * as React from 'react';
import {useEffect, useState} from 'react';
import {Box, FormControl, FormHelperText, InputLabel, MenuItem, Select} from '@mui/material';
import {fetchCities} from "../http/cityAPI";


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

const SelectorCity = ({chosenCity, cityToEdit, cleanMaster, closeList, editOpen, setChosenCity}) => {
    const [city, setCity] = useState(chosenCity.id ?? cityToEdit ?? "");
    const [citiesList, setCitiesList] = useState([])
    useEffect(async () => {
        try {
            const res = await fetchCities(null, null)
            setCitiesList(res.data.rows)
        } catch (e) {
            setCitiesList([])
        }
    }, []);
    const handleEditChange = (event) => {
        setCity(event.target.value);
        closeList()
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
                    error={city === ""}
                    labelId="citySel"
                    value={city}
                    label="Выберите город"
                    onChange={editOpen ? handleEditChange : handleChange}
                    MenuProps={MenuProps}
                >
                    {citiesList.map((city, index) =>
                        <MenuItem
                            key={index}
                            value={city.id}
                            onClick={() => setChosenCity(city)}
                        >
                            {city.name}
                        </MenuItem>
                    )}
                </Select>
                {city === "" ?
                    <FormHelperText>Укажите город</FormHelperText> : ""}
            </FormControl>
        </Box>
    );
}
export default SelectorCity;