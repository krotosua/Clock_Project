import React, {useContext, useEffect, useState} from 'react';
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import CityList from "../components/adminPageComponents/CityList"
import {Container, Tooltip} from "@mui/material";
import MasterList from "../components/adminPageComponents/MasterList";
import OrderList from "../components/adminPageComponents/OrderList";
import {useLocation, useNavigate} from "react-router-dom";
import {
    ADMIN_CITY_LIST_ROUTE,
    ADMIN_MASTER_LIST_ROUTE,
    ADMIN_ORDER_LIST_ROUTE,
    ORDER_ROUTE
} from "../utils/consts";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import CreateCity from "../components/adminPageComponents/modals/CreateCity";
import {observer} from "mobx-react-lite";
import CreateMaster from "../components/adminPageComponents/modals/CreateMaster";
import {fetchCity} from "../http/cityAPI";
import {Context} from "../index";

const Admin = observer(() => {
    const location = useLocation();
    const navigate = useNavigate()
    const cityList = location.pathname === ADMIN_CITY_LIST_ROUTE;
    const masterList = location.pathname === ADMIN_MASTER_LIST_ROUTE;
    const orderList = location.pathname === ADMIN_ORDER_LIST_ROUTE;
    const [cityVisible, setCityVisible] = useState(false)
    const [masterVisible, setMasterVisible] = useState(false)
    let {cities} = useContext(Context)

    useEffect(() => {
        fetchCity().then(res => {
            if (res.status === 204) {

                cities.setIsEmpty(true)

            } else {
                cities.setCities(res.data.rows)
            }
        })
    }, [])
    const variantsAdd = cityList ? () => {
            setCityVisible(true)
        } :
        masterList ? () => {
                setMasterVisible(true)
            } :
            orderList ? () => {
                navigate(ORDER_ROUTE)
            } : console.log("hi")

    return (

        <Container disableGutters
                   sx={{height: window.innerHeight, pt: 2}}>
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gridTemplateRows: 'auto',
                gridTemplateAreas: `"menu main main main" 
                                    "menu main main main"
                                    "menu main main main"`

            }}>
                <List sx={{width: '100%', maxWidth: 250, gridArea: 'menu'}} component="nav"
                      aria-label="mailbox folders">
                    <ListItem button
                              onClick={() => navigate(ADMIN_CITY_LIST_ROUTE)}>
                        <ListItemText primary="Города"/>
                    </ListItem>
                    <Divider/>
                    <ListItem button
                              onClick={() => navigate(ADMIN_MASTER_LIST_ROUTE)}>
                        <ListItemText primary="Мастера"/>
                    </ListItem>
                    <Divider light/>
                    <ListItem button
                              onClick={() => navigate(ADMIN_ORDER_LIST_ROUTE)}>
                        <ListItemText primary="Заказы"/>
                    </ListItem>
                    <Divider light/>
                    <ListItem button>
                        <ListItemText primary="Пользователи"/>
                    </ListItem>
                </List>
                <Box sx={{gridArea: 'main'}}>
                    {cityList ? <CityList setCityVisible={false}/> : ""}
                    {masterList ? <MasterList/> : ""}
                    {orderList ? <OrderList/> : ""}
                </Box>

                <Tooltip title={cityList ? "Добавить город" :
                    masterList ? "Добавить мастера" :
                        'Добавить заказ'}
                         placement="top"
                         arrow>
                    <Fab color="primary"
                         aria-label="add"
                         sx={{position: 'fixed', bottom: 80, right: 400}}
                         onClick={variantsAdd}
                    >
                        <AddIcon/>
                    </Fab>
                </Tooltip>
                <CreateCity open={cityVisible} onClose={() => setCityVisible(false)}/>
                <CreateMaster open={masterVisible} onClose={() => setMasterVisible(false)}/>
            </Box>
        </Container>
    );
});

export default Admin;