import React, {useContext, useEffect, useState} from 'react';
import {BrowserRouter} from "react-router-dom";
import AppRouter from "./components/AppRouter";
import NavBar from "./components/NavBar";
import {Box, CircularProgress, Container, CssBaseline} from "@mui/material";
import {observer} from "mobx-react-lite";
import {Context} from "./index";
import {check} from "./http/userAPI";
import {fetchCity} from "./http/cityAPI";
import {fetchSize} from "./http/sizeAPI";


const App = observer(() => {
    const {user, cities, size} = useContext(Context)
    const [loading, setLoading] = useState(true)
    useEffect(async () => {
        if (localStorage.getItem('token') !== "" ||
            localStorage.getItem('token')) {
            try {
                const data = await check()
                user.setUser(data)
                user.setUserName(data.name)
                user.setIsAuth(true)
                user.setUserRole(data.role)
            } catch {
                localStorage.setItem('token', "")
            }
        }
        try {
            const cityRes = await fetchCity()
            if (cityRes.status === 204) {
                cities.setIsEmpty(true)
            } else {
                cities.setCities(cityRes.data.rows)
                cities.setTotalCount(cityRes.data.count)
            }
            const sizeRes = await fetchSize()
            if (sizeRes.status === 204) {
                return size.setIsEmpty(true)
            }
            return size.setSize(sizeRes.data.rows)
        } catch (e) {
            cities.setIsEmpty(true)
            size.setIsEmpty(true)
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
})

export default App;
