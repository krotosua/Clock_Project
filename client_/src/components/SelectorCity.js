import * as React from 'react';
import {useEffect, useState} from 'react';
import {Box, FormControl, FormHelperText, InputLabel, MenuItem, Select} from '@mui/material';
import {fetchCities} from "../http/cityAPI";
import {Controller, useFormContext} from "react-hook-form";


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
    const [citiesList, setCitiesList] = useState([])
    const {control, errors, trigger, setValue} = useFormContext();
    useEffect(async () => {
        try {
            const res = await fetchCities(null, null)
            if (res.status === 204) {
                setCitiesList([])
                return
            }
            setCitiesList(res.data.rows)
            if (cityToEdit) {
                setChosenCity(res.data.rows.find(size => size.id === cityToEdit))
            }
        } catch (e) {
            setCitiesList([])
        }
    }, []);
    const handelChange = (onChange, e) => {
        onChange(e)
        if (cityToEdit) {
            setValue("openList", false)
        }
    }

    return (
        <Box sx={{minWidth: 120}}>
            <Controller
                name="city"
                control={control}
                render={({field: {onChange, value}, fieldState: {error}}) => (
                    <FormControl error={!!error} fullWidth>
                        <InputLabel id="city">Выберите город</InputLabel>
                        <Select
                            labelId="city"
                            required
                            value={value || ""}
                            label="Выберите город"
                            onChange={(e) => handelChange(onChange, e)}
                            MenuProps={MenuProps}
                            onBlur={() => trigger("city")}
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
                        <FormHelperText>{error?.message}</FormHelperText>
                    </FormControl>)}
                rules={{
                    required: 'Укажите город'
                }}
            />
        </Box>
    );
}
export default SelectorCity;