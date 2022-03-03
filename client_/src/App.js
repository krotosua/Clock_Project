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
        check().then(data => {
            user.setUser(true)
            user.setIsAuth(true)
            user.setUserRole(data.role)

        }).finally(() => setLoading(false))
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

    if (loading) {
        return <CircularProgress/>
    }
    return (

        <BrowserRouter>

            <NavBar/>
            <Box sx={{bgcolor: '#eceaea'}}>

                <CssBaseline/>
                <Container sx={{bgcolor: '#fff', mt: 6}}>
                    <AppRouter/>

                </Container>

            </Box>
        </BrowserRouter>
    );
})

export default App;
