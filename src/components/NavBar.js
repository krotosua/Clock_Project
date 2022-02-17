import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import {useContext} from "react";
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {Container, CssBaseline, Link} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {ADMIN_ROUTE, LOGIN_ROUTE, START_ROUTE, USER_ORDER_ROUTE} from "../utils/consts";


const NavBar = observer(() => {
    const {user} = useContext(Context)
    const navigate = useNavigate()
    const logOut = () => {
        user.setUser({})
        user.setIsAuth(false)
        user.setUserRole("")
        localStorage.setItem('token', "")
        navigate(START_ROUTE)
    }

    return (
        <React.Fragment>
            <CssBaseline/>
            <AppBar color="warning" position="fixed">
                <Container maxWidth="xl">
                    {user.isAuth ?
                        <Toolbar>
                            <Typography variant="h6" component="div" sx={{flexGrow: 1}}>

                                <Link href={START_ROUTE} underline="none" color="white">
                                    {'  Clockwise Clockware'}
                                </Link>
                            </Typography>
                            {user.userRole === "ADMIN" ?
                                <Button variant="outlined" color="inherit" onClick={() => navigate(ADMIN_ROUTE)}>
                                    Админ панель
                                </Button> :
                                <Button variant="outlined" color="inherit" onClick={() => navigate(USER_ORDER_ROUTE)}>
                                    Список заказов
                                </Button>
                            }
                            <Button variant="outlined" sx={{ml: 2}} color="inherit"
                                    onClick={() => logOut()}>Выйти</Button>
                        </Toolbar> :

                        <Toolbar>
                            <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                                <Link href={START_ROUTE} underline="none" color="white">
                                    {'  Clockwise Clockware'}
                                </Link>
                            </Typography>
                            <Button variant="outlined" color="inherit"
                                    onClick={() => navigate(LOGIN_ROUTE)}>Войти</Button>
                        </Toolbar>}
                </Container>
            </AppBar>
        </React.Fragment>

    );
})

export default NavBar