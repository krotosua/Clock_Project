import * as React from 'react';
import {useEffect, useState} from 'react';
import {Autocomplete, CircularProgress, TextField} from '@mui/material';
import {useFormContext} from "react-hook-form";


export default function SelectorMultiple({name, fetch, label, id, OptionLabel}) {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([])
    const [inputValue, setInputValue] = React.useState("");
    const {setValue, getValues} = useFormContext();
    const loading = open && options.length === 0;
    useEffect(async () => {
        let timer
        timer = setTimeout(() => console.log("hi"), 2000)
        clearTimeout(timer)
        try {

            const res = await fetch(null, null, null, null, inputValue)
            if (res.status === 204) {
                setOptions([])
                return
            }
            !!OptionLabel ? setOptions(res.data) : setOptions(res.data.rows)

        } catch (e) {
            setOptions([])
        }
    }, [inputValue]);
    useEffect(async () => {
        if (!loading) {
            return undefined;
        }
        try {
            const res = await fetch(null, null)
            if (res.status === 204) {
                setOptions([])
                return
            }
            !!OptionLabel ? setOptions(res.data) : setOptions(res.data.rows)

        } catch (e) {
            setOptions([])
        }
    }, [open]);
    return (
        <div>
            <Autocomplete
                size={"small"}
                multiple
                limitTags={2}
                id={id}
                open={open}
                onOpen={() => {
                    setOpen(true);
                }}
                onClose={() => {
                    setOpen(false);
                }}
                value={getValues(name)}
                options={options}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                getOptionLabel={OptionLabel ? OptionLabel : (option) => option.name}
                onChange={(event, newValue, reason) => {
                    setValue(name, newValue)
                }}
                clearOnBlur={false}
                clearText={"Убрать фильтр"}
                inputValue={inputValue}
                onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue);
                }}
                renderInput={(params) => (
                    <TextField
                        fullWidth
                        {...params} label={label}
                        placeholder={label}
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <React.Fragment>
                                    {loading ? <CircularProgress color="inherit" size={20}/> : null}
                                    {params.InputProps.endAdornment}
                                </React.Fragment>
                            ),
                        }}
                    />
                )}
                sx={{width: 300, mt: 1}}
            />
        </div>
    );
}