import {Card, CardContent, Container,} from "@mui/material";
import React, {useEffect, useState} from "react";
import OrderStepper from "../components/orderPageComponents/OrderStepper"
import {fetchSize} from "../http/sizeAPI";
import {fetchCity} from "../http/cityAPI";
import MyAlert from "../components/adminPageComponents/MyAlert";
import {useDispatch, useSelector} from "react-redux";
import {setCitiesAction, setEmptyCityAction} from "../store/CityStore";
import {setIsEmptySizeAction, setSizesAction} from "../store/SizeStore";

const Order = () => {
    const dispatch = useDispatch()
    const size = useSelector(state => state.sizes)
    const cities = useSelector(state => state.city)
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
                dispatch(setEmptyCityAction(true))
            } else {
                dispatch(setCitiesAction(cityRes.data.rows))
            }
        } catch (e) {
            dispatch(setEmptyCityAction(true))
        }
        try {
            const sizeRes = await fetchSize()
            if (sizeRes.status === 204) {
                dispatch(setIsEmptySizeAction(true))
            }
            dispatch(setSizesAction(sizeRes.data.rows))
        } catch (e) {
            dispatch(setIsEmptySizeAction(true))
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
};

export default Order;
