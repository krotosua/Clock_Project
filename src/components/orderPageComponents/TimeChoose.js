import * as React from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';

export default function NativePickers() {
    return (
        <Stack component="form" noValidate spacing={3}>

            <TextField
                id="datetime-local"
                label="Выберите дату и время"
                type="datetime-local"
                defaultValue=""
                sx={{width: 250}}
                InputLabelProps={{
                    shrink: true,
                }}
            />
        </Stack>
    );
}
