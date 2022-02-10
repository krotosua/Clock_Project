import React from 'react';
import {Box, TextField} from "@mui/material";
import SelectorSize from "./SelectorSize";
import SelectorCity from "./SelectorCity";
import NativePickers from "./TimeChoose";

const PageOneStepp = () => {
    return (
        <Box component="form">
            <TextField id="Name" label="Ваше имя" variant="outlined" fullWidth/>
            <TextField sx={{mt: 2}} id="Email" label="Ващ Email" variant="outlined" fullWidth/>
            <Box sx={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', my: 2}}>
                <SelectorSize/>
                <SelectorCity/>
            </Box>
            <NativePickers/>
        </Box>
    );
};

export default PageOneStepp;
