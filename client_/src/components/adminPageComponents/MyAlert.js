import React from 'react';
import {Snackbar} from "@mui/material";
import {Alert} from "@mui/lab";

const MyAlert = ({open, onClose, message, isError}) => {
    return (
        <Snackbar open={open} autoHideDuration={2000} onClose={onClose}>
            <Alert onClose={onClose}
                   severity={isError ? "error" : "success"}>{message}</Alert>
        </Snackbar>
    );
};

export default MyAlert;
