import * as React from 'react';
import Cards from "../components/startPageComponents/cards"
import AboutCompany from "../components/startPageComponents/aboutCompany";
import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";
import {ORDER_ROUTE} from "../utils/consts";
import Box from "@mui/material/Box";

const Start = () => {
    const navigate = useNavigate()
    return (

        <Box sx={{display: 'flex', flexDirection: 'column'}}>
            <AboutCompany/>
            <Cards/>

            <Button sx={{mt: 5, mb: 10}} variant="outlined" color={"warning"} onClick={() => navigate(ORDER_ROUTE)}>
                Сделать заказ
            </Button>
        </Box>

    );
};

export default Start