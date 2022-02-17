import React, {useContext, useEffect, useState} from 'react';
import {BrowserRouter} from "react-router-dom";
import AppRouter from "./components/AppRouter";
import NavBar from "./components/NavBar";
import {CircularProgress, Container, CssBaseline} from "@mui/material";
import Box from "@mui/material/Box";
import {observer} from "mobx-react-lite";
import {Context} from "./index";
import {check} from "./http/userAPI";


const App = observer(() => {
    const {user} = useContext(Context)
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        check().then(data => {
            user.setUser(true)
            user.setIsAuth(true)
            user.setUserRole(data.role)

        }).finally(() => setLoading(false))
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
