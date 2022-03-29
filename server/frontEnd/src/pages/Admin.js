import React, {useState} from 'react';
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
    ADMIN_ORDER_LIST_ROUTE, ADMIN_SIZES_ROUTE, ADMIN_USERS_ROUTE,
    ORDER_ROUTE
} from "../utils/consts";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import CreateCity from "../components/adminPageComponents/modals/CreateCity";
import {observer} from "mobx-react-lite";
import CreateMaster from "../components/adminPageComponents/modals/CreateMaster";
import UserList from "../components/adminPageComponents/UserList";
import SizeList from "../components/adminPageComponents/SizeClock";
import CreateSize from "../components/adminPageComponents/modals/CreateSize";
import MyAlert from "../components/adminPageComponents/MyAlert";


const Admin = observer(() => {
    const location = useLocation();
    const navigate = useNavigate()
    const cityList = location.pathname === ADMIN_CITY_LIST_ROUTE;
    const masterList = location.pathname === ADMIN_MASTER_LIST_ROUTE;
    const sizeList = location.pathname === ADMIN_SIZES_ROUTE;
    const orderList = location.pathname === ADMIN_ORDER_LIST_ROUTE;
    const usersList = location.pathname === ADMIN_USERS_ROUTE
    const [cityVisible, setCityVisible] = useState(false)
    const [masterVisible, setMasterVisible] = useState(false)
    const [sizeVisible, setSizeVisible] = useState(false)

    const [open, setOpen] = useState(false)
    const [isError, setIsError] = useState(false)
    const [message, setMessage] = useState("")


    function getValue(prop, list, idToEdit) { // получение значения свойства
        return list.reduce(
            (res, obj) => obj.id === idToEdit ? obj[prop] : res
            , '');
    }


    const alertMessage = (message, bool) => {
        setOpen(true)
        setMessage(message)
        setIsError(bool)
    }
    const variantsAdd = cityList ? () => {
            setCityVisible(true)
        } :
        masterList ? () => {
                setMasterVisible(true)
            } :
            orderList ? () => {
                navigate(ORDER_ROUTE)
            } : sizeList ? () => {
                setSizeVisible(true)
            } : null

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
                              onClick={() => navigate(ADMIN_SIZES_ROUTE)}>
                        <ListItemText primary="Размеры часов"/>
                    </ListItem>
                    <Divider light/>
                    <ListItem button
                              onClick={() => navigate(ADMIN_ORDER_LIST_ROUTE)}>
                        <ListItemText primary="Заказы"/>
                    </ListItem>
                    <Divider light/>
                    <ListItem button
                              onClick={() => navigate(ADMIN_USERS_ROUTE)}>
                        <ListItemText primary="Пользователи"/>
                    </ListItem>
                </List>
                <Box sx={{gridArea: 'main'}}>
                    {cityList ? <CityList alertMessage={alertMessage}
                                          getValue={getValue}/> : ""}
                    {masterList ? <MasterList alertMessage={alertMessage}
                                              getValue={getValue}/> : ""}
                    {sizeList ? <SizeList alertMessage={alertMessage}
                                          getValue={getValue}/> : ""}
                    {orderList ? <OrderList
                        alertMessage={alertMessage}
                        getValue={getValue}/> : ""}
                    {usersList ? <UserList
                        alertMessage={alertMessage}
                        getValue={getValue}/> : ""}

                </Box>

                {usersList ? null :
                    <Tooltip title={cityList ? "Добавить город" :
                        masterList ? "Добавить мастера" :
                            sizeList ? "Добавить размер часов" :
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
                    </Tooltip>}
                <CreateCity open={cityVisible}
                            onClose={() => setCityVisible(false)}
                            alertMessage={alertMessage}/>
                <CreateMaster open={masterVisible}
                              onClose={() => setMasterVisible(false)}
                              alertMessage={alertMessage}
                />
                <CreateSize open={sizeVisible}
                            onClose={() => setSizeVisible(false)}
                            alertMessage={alertMessage}
                />
                <MyAlert open={open}
                         onClose={() => setOpen(false)}
                         message={message}
                         isError={isError}/>

            </Box>
        </Container>
    );
});

export default Admin;