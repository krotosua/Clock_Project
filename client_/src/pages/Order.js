import {
    Card,
    CardContent,
    Container,

} from "@mui/material";
import React, {} from "react";

import Stepper from "../components/orderPageComponents/Stepper"
import {observer} from "mobx-react-lite";


const Order = observer(() => {

    return (
        <Container
            maxWidth="xl"
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: window.innerHeight - 100,
            }}
        >
            <Card sx={{width: 1000, p: 1}}>
                <CardContent>
                    <Stepper/>
                </CardContent>
            </Card>
        </Container>
    );
});

export default Order;
