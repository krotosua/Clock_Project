import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function SelectorSize() {
    const [size, setAge] = React.useState('');

    const handleChange = (event) => {
        setAge(event.target.value);
    };


    return (
        <Box sx={{minWidth: 120}}>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Выберите размер часов</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={size}
                    label="Выберите размер часов"
                    onChange={handleChange}
                >
                    <MenuItem value={1}>Маленькие</MenuItem>
                    <MenuItem value={2}>Средние</MenuItem>
                    <MenuItem value={3}>Большие</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
}
