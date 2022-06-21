import {Card, CardContent, Container,} from "@mui/material";
import React, {useContext, useEffect, useState} from "react";
import OrderStepper from "../components/orderPageComponents/OrderStepper"
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import {fetchSize} from "../http/sizeAPI";
import {fetchCity} from "../http/cityAPI";
import MyAlert from "../components/adminPageComponents/MyAlert";

const Order = observer(() => {
    const {size, cities} = useContext(Context)
    const [open, setOpen] = useState(false)
    const [isError, setIsError] = useState(false)
    const [message, setMessage] = useState("")
    const alertMessage = (message, bool) => {
        setOpen(true)
        setMessage(message)
        setIsError(bool)
    }
    useEffect(async () => {
        try {
            const cityRes = await fetchCity()
            if (cityRes.status === 204) {
                cities.setIsEmpty(true)
            } else {
                cities.setCities(cityRes.data.rows)
            }
        } catch (e) {
            cities.setIsEmpty(true)
        }
        try {
            const sizeRes = await fetchSize()
            if (sizeRes.status === 204) {
                return size.setIsEmpty(true)
            }
            return size.setSize(sizeRes.data.rows)
        } catch (e) {
            size.setIsEmpty(true)
        }
    }, [])

    return (
        <Container
            maxWidth="xl"
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "800px",
            }}
        >
            <Card sx={{width: 1000, p: 1, bgcolor: '#f5f5f5'}}>
                <CardContent>
                    <OrderStepper alertMessage={alertMessage}/>
                </CardContent>
            </Card>
            <MyAlert open={open}
                     onClose={() => setOpen(false)}
                     message={message}
                     isError={isError}/>
        </Container>
    );
});

export default Order;
