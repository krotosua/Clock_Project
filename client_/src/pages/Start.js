import * as React from 'react';
import Cards from "../components/startPageComponents/cards"
import AboutCompany from "../components/startPageComponents/aboutCompany";
import Button from "@mui/material/Button";
import {Link, useNavigate} from "react-router-dom";
import {ORDER_ROUTE} from "../utils/consts";
import Box from "@mui/material/Box";

const Start = () => {
    const navigate = useNavigate()
    return (

        <Box sx={{display: 'flex', flexDirection: 'column'}}>
            <AboutCompany/>
            <Cards/>
            <Box>
                <Link to={ORDER_ROUTE}
                      style={{textDecoration: 'none', color: 'white'}}>
                    <Button fullWidth sx={{mt: 5, mb: 2}} variant="outlined" color={"warning"}
                            onClick={() => navigate(ORDER_ROUTE)}>
                        Сделать заказ
                    </Button>
                </Link>
            </Box>

        </Box>

    );
};

export default Start