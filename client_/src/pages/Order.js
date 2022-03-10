import {
    Card,
    CardContent,
    Container,

} from "@mui/material";
import React, {useContext, useEffect} from "react";

import MyStepper from "../components/orderPageComponents/Stepper"
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import {fetchSize} from "../http/sizeAPI";


const Order = observer(() => {
    const {size} = useContext(Context)
    useEffect(() => {
        fetchSize().then(res => {
            if (res.status === 204) {
                return size.setIsEmpty(true)
            }
            return size.setSize(res.data.rows)
        }, (err) => {
            size.setIsEmpty(true)
            return console.error(err)
        })
    }, [])
    return (
        <Container
            maxWidth="xl"
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: window.innerHeight,
            }}
        >
            <Card sx={{width: 1000, p: 1}}>
                <CardContent>
                    <MyStepper/>
                </CardContent>
            </Card>
        </Container>
    );
});

export default Order;
