import {
    Card,
    CardContent,
    Container,

} from "@mui/material";
import React, {useContext, useEffect, useState} from "react";
import MyStepper from "../components/orderPageComponents/MyStepper"
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import {fetchSize} from "../http/sizeAPI";
import {fetchCity} from "../http/cityAPI";
import MyAlert from "../components/adminPageComponents/MyAlert";


const Order = observer(() => {
    const {size, cities} = useContext(Context)

    useEffect(() => {
        fetchCity().then(res => {
            if (res.status === 204) {
                cities.setIsEmpty(true)
            } else {
                cities.setCities(res.data.rows)
            }
        })
        fetchSize().then(res => {
            if (res.status === 204) {
                return size.setIsEmpty(true)
            }
            return size.setSize(res.data.rows)
        }, (err) => {
            size.setIsEmpty(true)
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
            <Card sx={{width: 1000, p: 1, bgcolor: '#f5f5f5'}}>
                <CardContent>
                    <MyStepper/>
                </CardContent>
            </Card>

        </Container>
    );
});

export default Order;
