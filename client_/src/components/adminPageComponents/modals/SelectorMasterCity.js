import * as React from 'react';
import {useEffect, useState} from 'react';
import {
    Checkbox,
    FormControl,
    FormHelperText,
    InputLabel,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Select
} from '@mui/material';
import {fetchCities} from "../../../http/cityAPI";
import {useFormContext} from "react-hook-form";

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


export default function SelectorMasterCity({cityChosen}) {
    const [citiesList, setCitiesList] = useState([])
    const [cityName, setCityName] = React.useState([]);
    const {register, errors, trigger, setValue} = useFormContext();
    const handleChange = (event) => {
        const {target: {value}} = event
        setCityName(
            typeof value === 'string' ? value.split(',') : value,
        );
        setValue("cityList", typeof value === 'string' ? value.split(',') : value,)
        trigger("cityList")
    };
    useEffect(async () => {
        try {
            const res = await fetchCities(null, null)
            if (res.status === 204) {
                setCitiesList([])
                return
            }
            setCitiesList(res.data.rows)
            if (cityChosen) {
                setCityName(cityChosen.map(city => res.data.rows.find(cityes => city.id === cityes.id)))
            }
        } catch (e) {
            setCitiesList([])
        }
    }, []);
    return (
        <div>
            <FormControl error={Boolean(errors.cityList)} sx={{width: 300}}>
                <InputLabel
                    id="multiple-cities">
                    Выберите город(а) работы мастера
                </InputLabel>
                <Select
                    {...register("cityList", {
                        required: "Укажите город(a)",
                    })}
                    labelId="multiple-cities"
                    id="multiple-cities"
                    multiple
                    value={cityName}
                    onChange={handleChange}
                    input={<OutlinedInput label="Выберите город(а) работы мастера"/>}
                    renderValue={(selected) => selected.map(sels => sels.name).join(', ')}
                    MenuProps={MenuProps}
                >
                    {citiesList.map((city, index) => {
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
                <FormHelperText>{errors.cityList?.message}</FormHelperText>
            </FormControl>
        </div>
    );
}