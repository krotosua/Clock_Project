import * as React from 'react';
import {useEffect, useState} from 'react';
import {Autocomplete, TextField} from '@mui/material';
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


export default function SelectorMultiple({name, fetch, label, id, OptionLabel}) {
    const [list, setList] = useState([])
    const [nameList, setNameList] = useState([])
    const {setValue, getValues} = useFormContext();

    useEffect(async () => {
        try {
            const res = await fetch(null, null)
            if (res.status === 204) {
                setList([])
                return
            }
            !!OptionLabel ? setList(res.data) : setList(res.data.rows)

        } catch (e) {
            setList([])
        }
    }, []);
    return (
        <div>
            <Autocomplete
                size={"small"}
                multiple
                limitTags={2}
                id={id}
                value={getValues(name) || []}
                options={list}
                getOptionLabel={OptionLabel ? OptionLabel : (option) => option.name}
                onChange={(event, newValue, reason) => {
                    setValue(name, newValue)
                    setNameList(newValue)
                }}
                clearOnBlur={false}
                clearText={"Убрать фильтр"}
                renderInput={(params) => (
                    <TextField
                        {...params} label={label}
                        placeholder={label}/>
                )}
                sx={{width: 300, mt: 1}}
            />
        </div>
    );
}