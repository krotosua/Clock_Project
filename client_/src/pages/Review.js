import * as React from 'react';
import {useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from "react-router-dom";
import Box from "@mui/material/Box";
import MasterRating from "../components/customerPageComponents/MasterRating";
import {checkLink} from "../http/masterAPI";
import {Button, Typography} from "@mui/material";
import {START_ROUTE} from "../utils/consts";

const Review = () => {
    const {uuid} = useParams()
    const navigate = useNavigate()
    const [open, setOpen] = useState(true)
    const [wrongLink, setWrongLink] = useState(false)
    useEffect(async () => {
        try {
            await checkLink(uuid)
            setWrongLink(false)
        } catch (e) {
            setWrongLink(true)
            setOpen(false)
        }
    }, [])
    return (
        <Box sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: window.innerHeight - 60,
        }}>
            <MasterRating open={open}
                          uuid={uuid}
                          onClose={() => setOpen(false)}
            />
            {!open && wrongLink ? <Box sx={{
                mt: 5,
                display: 'flex',
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <Typography variant="h6" gutterBottom component="div">
                    Ссылка больше не доступна
                </Typography>
                <Link to={START_ROUTE}
                      style={{textDecoration: 'none', color: 'black'}}>
                    <Button size="large"
                            color="warning"
                            variant="contained"
                            onClick={() => navigate(START_ROUTE)}>
                        Перейти на стартовую страницу
                    </Button>
                </Link>
            </Box> : !open ? <Box sx={{
                mt: 5,
                display: 'flex',
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <Typography variant="h6" gutterBottom component="div">
                    Ваш отзыв успешно отправлен
                </Typography>
                <Link to={START_ROUTE}
                      style={{textDecoration: 'none', color: 'black'}}>
                    <Button size="large"
                            color="warning"
                            variant="contained"
                            onClick={() => navigate(START_ROUTE)}>
                        Перейти на стартовую страницу
                    </Button>
                </Link>
            </Box> : null}

        </Box>
    )
};

export default Review