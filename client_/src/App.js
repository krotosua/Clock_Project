import React, {useContext, useEffect, useState} from 'react';
import {BrowserRouter} from "react-router-dom";
import AppRouter from "./components/AppRouter";
import NavBar from "./components/NavBar";
import {CircularProgress, Container, CssBaseline} from "@mui/material";
import Box from "@mui/material/Box";
import {observer} from "mobx-react-lite";
import {Context} from "./index";
import {check} from "./http/userAPI";
import {fetchCity} from "./http/cityAPI";
import {fetchSize} from "./http/sizeAPI";


const App = observer(() => {
    const {user, cities, size} = useContext(Context)
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        if (localStorage.getItem('token') !== "" ||
            localStorage.getItem('token')) {
            check().then(data => {
                user.setUser(data)
                user.setIsAuth(true)
                user.setUserRole(data.role)
                console.log(data)
            }, err => {
                localStorage.setItem('token', "")
            })
        }
        fetchCity(1, 10).then(res => {
            if (res.status === 204) {
                cities.setIsEmpty(true)
            } else {
                cities.setCities(res.data.rows)
                cities.setTotalCount(res.data.count)
            }
        }).finally(() => setLoading(false))
        fetchSize().then(res => {
            if (res.status === 204) {
                return size.setIsEmpty(true)
            }
            return size.setSize(res.data.rows)
        }, (err) => {
            size.setIsEmpty(true)
        })
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
                <Container sx={{bgcolor: '#fff', mt: 6, height: document.documentElement.clientHeight - 48}}>
                    <AppRouter/>
                </Container>
                <Box sx={{width: "100%", bgcolor: '#eceaea'}}>
                </Box>
            </Box>

        </BrowserRouter>
    );
})

export default App;
