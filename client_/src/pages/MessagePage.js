import * as React from 'react';
import {Link, useLocation, useNavigate} from "react-router-dom";

import Box from "@mui/material/Box";
import {Button, Container, Typography} from "@mui/material";
import {ACTIVATED_ROUTE, CONGRATULATION_ROUTE, LOGIN_ROUTE, START_ROUTE} from "../utils/consts";

const MessagePage = () => {
    const location = useLocation();
    const activated = location.pathname === ACTIVATED_ROUTE;
    const congratulated = location.pathname === CONGRATULATION_ROUTE;
    const navigate = useNavigate()
    return (
        activated ?
            <Box sx={{display: 'flex', flexDirection: 'column'}}>
                <Container
                    maxWidth="xl"
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: window.innerHeight - 60,
                    }}
                > <Box sx={{
                    mt: 5,
                    display: 'flex',
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center"
                }}>

                    <Typography variant="h6" gutterBottom component="div">
                        Ваш аккаунт успешно активирован
                    </Typography>
                    <Typography sx={{text: "center"}} variant="h6" gutterBottom component="div">
                        Чтобы перейти в личный кабинет требуется авторизироваться
                    </Typography>
                    <Link to={LOGIN_ROUTE}
                          style={{textDecoration: 'none', color: 'black'}}>
                        <Button size="large" color="warning" variant="contained" fullwidth
                                onClick={() => navigate(LOGIN_ROUTE)}>
                            Перейти к авторизации
                        </Button>
                    </Link>
                </Box>
                </Container>
            </Box> : congratulated ?
                <Box sx={{display: 'flex', flexDirection: 'column'}}>
                    <Container
                        maxWidth="xl"
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: window.innerHeight - 60,
                        }}
                    >
                        <Box sx={{
                            mt: 5,
                            display: 'flex',
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>

                            <Typography variant="h6" gutterBottom component="div">
                                Ссылка для активации отправленна на почту.
                                Пройдите чтобы активировать ваш аккаунт.
                            </Typography>
                            <Typography sx={{text: "center"}} variant="h6" gutterBottom component="div">
                                А пока что можно:
                            </Typography>
                            <Link to={START_ROUTE}
                                  style={{textDecoration: 'none', color: 'black'}}>
                                <Button size="large" variant="outlined" fullwidth onClick={() => navigate(START_ROUTE)}>
                                    Вернуться на стартовую страницу
                                </Button>
                            </Link>
                        </Box>
                    </Container>
                </Box> : null

    );
};

export default MessagePage