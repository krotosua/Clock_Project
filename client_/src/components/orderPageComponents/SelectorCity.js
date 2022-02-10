import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function SelectorSize() {
    const [city, setAge] = React.useState('');

    const handleChange = (event) => {
        setAge(event.target.value);
    };


    return (
        <Box sx={{minWidth: 120}}>
            <FormControl fullWidth>
                <InputLabel id="citySel">Выберите город</InputLabel>
                <Select
                    labelId="citySel"
                    id="demo-simple-select"
                    value={city}
                    label="Выберите город"
                    onChange={handleChange}
                >
                    <MenuItem value={1}>Днепр</MenuItem>
                    <MenuItem value={2}>Ужгород</MenuItem>
                    <MenuItem value={3}>Киев</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
}
