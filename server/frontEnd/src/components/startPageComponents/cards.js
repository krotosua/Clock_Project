import React from 'react';
import Box from '@mui/material/Box';
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import smallClock from "../../assets/img/small.jpg";
import normalClock from "../../assets/img/normal.jpg";
import largeClock from "../../assets/img/large.jpg";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

const Cards = () => {
    return (
        <Box sx={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', ml: 3}}>
            <Card sx={{maxWidth: 345}}>
                <CardMedia
                    component="img"
                    height="300"
                    image={smallClock}
                    alt="green ds"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div" align='center'>
                        Ремонт малых часов

                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Малые часы отстают, спешат, остановились, перестали заводиться или начали издавать нехарактерный
                        треск / постукивание? Мастер быстро установит причину неполадки и устранит ее.
                        <li>Диагностика и ремонт часов</li>
                        <li>Ремонт, чистка, смазка, отладка работы механизма</li>
                        <li>Замена стекла</li>
                        <li>Мастер справиться за час</li>
                    </Typography>
                </CardContent>
            </Card>

            <Card sx={{maxWidth: 345}}>
                <CardMedia
                    component="img"
                    height="300"
                    image={normalClock}
                    alt="green iguana"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div" align='center'>
                        Ремонт средних часов

                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        В мастерской производится ремонт настенных часов любой сложности, мастер починит и отладит
                        современные часы средних размеров.
                        <li>Диагностика и ремонт часов</li>
                        <li>Ремонт, чистка, смазка, отладка работы механизма</li>
                        <li>Замена стекла</li>
                        <li>Мастер справиться за 2 часа</li>
                    </Typography>
                </CardContent>
            </Card>

            <Card sx={{maxWidth: 345}}>
                <CardMedia
                    component="img"
                    height="300"
                    image={largeClock}
                    alt="green iguana"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div" align='center'>
                        Ремонт больших часов

                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Мастер справиться с большими/антикварными моделями часов, восстановит ход кукушек, кварцевых,
                        механических часов с обычным или четвертным боем.
                        <li>Чистка и смазка механизма</li>
                        <li>Замена пружин</li>
                        <li>Регулировка хода и настройка боя</li>
                        <li>Изготовление деталей вручную (для антикварных часов)</li>
                        <li>Мастер справиться за 3 часа</li>
                    </Typography>
                </CardContent>

            </Card>
        </Box>
    );
};

export default Cards;
