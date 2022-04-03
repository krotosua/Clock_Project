import React, {useContext, useState} from "react";
import {
    Card,
    CardContent,
    Container,
} from "@mui/material";

import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";
import {START_ROUTE} from "../utils/consts";


const OrderEnd = () => {
    const navigate = useNavigate()

    return (


        <Container
            maxWidth="xl"
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: window.innerHeight - 60,
            }}
        >
            <Card sx={{}}>
                <CardContent sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    bgcolor: '#f5f5f5'
                }}>
                    <h1>Заказ успешно отправлен</h1>
                    <Button variant="outlined"
                            onClick={() => navigate(START_ROUTE)}>На главную страницу</Button>
                </CardContent>
            </Card>
        </Container>

    )
};

export default OrderEnd;
