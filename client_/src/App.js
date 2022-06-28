import React, {useEffect, useState} from 'react';
import {BrowserRouter} from "react-router-dom";
import AppRouter from "./components/AppRouter";
import NavBar from "./components/NavBar";
import {Box, CircularProgress, Container, CssBaseline} from "@mui/material";
import {useDispatch} from "react-redux";
import {setEmptyCityAction} from "./store/CityStore";
import {setIsEmptySizeAction} from "./store/SizeStore";
import {getCities} from "./asyncActions/cities";
import {checkUser} from "./asyncActions/users";


const App = () => {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true)
    useEffect(async () => {
        try {
            await dispatch(checkUser())
            await dispatch(getCities(null, null))
        } catch (e) {
            dispatch(setEmptyCityAction(true))
            dispatch(setIsEmptySizeAction(true))
        } finally {
            setLoading(false)
        }
    }, [])

    if (loading) {
        return (
            <Box sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: window.innerHeight - 60,
            }}>
                <CircularProgress/>
            </Box>
        )
    }
    return (
        <BrowserRouter>
            <NavBar/>
            <Box sx={{bgcolor: '#eceaea'}}>

                <CssBaseline/>
                <Container sx={{
                    bgcolor: '#fff', mt: 6,
                    height: document.documentElement.clientHeight - 30
                }}>
                    <AppRouter/>
                </Container>
                <Box sx={{width: "100%", bgcolor: '#eceaea'}}>
                </Box>
            </Box>

        </BrowserRouter>
    );
}

export default App;
