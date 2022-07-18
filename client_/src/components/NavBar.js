import * as React from 'react';
import {AppBar, Button, Container, Toolbar, Typography} from '@mui/material';
import {Link, useNavigate} from "react-router-dom";
import {ADMIN_ROUTE, CUSTOMER_ORDER_ROUTE, LOGIN_ROUTE, MASTER_ORDER_ROUTE, START_ROUTE} from "../utils/consts";
import {useDispatch, useSelector} from "react-redux";
import {resetUserAction} from "../store/UserStore";


const NavBar = () => {
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const logOut = () => {
        navigate(START_ROUTE)
        localStorage.removeItem('token')
        dispatch(resetUserAction())
    }

    return (
        <React.Fragment>
            <AppBar color="warning" position="fixed">
                <Container maxWidth="xl">
                    {user.isAuth && user.user.isActivated || user.userRole === "ADMIN" ?
                        <Toolbar>

                            <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                                <Link to={START_ROUTE}
                                      style={{textDecoration: 'none', color: 'white'}}>
                                <span onClick={() => navigate(START_ROUTE)}
                                      style={{cursor: "pointer"}}>Clockwise Clockware</span>
                                </Link>
                            </Typography>
                            {user.userRole === "ADMIN" ?
                                <Link to={ADMIN_ROUTE}
                                      style={{textDecoration: 'none', color: 'white'}}>
                                    <Button variant="outlined"
                                            color="inherit"
                                            onClick={() => navigate(ADMIN_ROUTE)}>
                                        Админ панель
                                    </Button>
                                </Link> :
                                user.userRole === "CUSTOMER" ?
                                    <Link to={`${CUSTOMER_ORDER_ROUTE}/${user.user.id}`}
                                          style={{textDecoration: 'none', color: 'white'}}>
                                        <Button variant="outlined" color="inherit"
                                                onClick={() => {
                                                    navigate(`${CUSTOMER_ORDER_ROUTE}/${user.user.id}`)
                                                }}>
                                            Список заказов
                                        </Button>
                                    </Link> :
                                    user.userRole === "MASTER" ?
                                        <Link to={`${MASTER_ORDER_ROUTE}/${user.user.id}`}
                                              style={{textDecoration: 'none', color: 'white'}}>
                                            <Button variant="outlined" color="inherit"
                                                    onClick={() => {
                                                        navigate(`${MASTER_ORDER_ROUTE}/${user.user.id}`)
                                                    }}>
                                                Список заказов
                                            </Button>
                                        </Link> : null
                            }
                            <Link to={START_ROUTE}
                                  style={{textDecoration: 'none', color: 'white'}}>
                                <Button variant="outlined" sx={{ml: 2}} color="inherit"
                                        onClick={() => logOut()}>Выйти</Button>
                            </Link>
                        </Toolbar>

                        :

                        <Toolbar>
                            <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                                <Link to={START_ROUTE}
                                      style={{textDecoration: 'none', color: 'white'}}>
                                <span onClick={() => navigate(START_ROUTE)}
                                      style={{cursor: "pointer"}}>Clockwise Clockware</span>
                                </Link>
                            </Typography>
                            <Link to={LOGIN_ROUTE}
                                  style={{textDecoration: 'none', color: 'white'}}>
                                <Button variant="outlined" color="inherit">Войти</Button>
                            </Link>
                        </Toolbar>}
                </Container>
            </AppBar>
        </React.Fragment>

    );
}

export default NavBar