import React from 'react';
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import CityList from "../components/adminPageComponents/CityList"
import {Container} from "@mui/material";

const Admin = () => {
    return (

        <Container sx={{height: window.innerHeight}} maxWidth='false'>
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 1,
                gridTemplateRows: 'auto',
                gridTemplateAreas: `"menu main main" 
                                    "menu main main"
                                    "menu main main"`

            }}>
                <List sx={{width: '100%', maxWidth: 250, gridArea: 'menu'}} component="nav"
                      aria-label="mailbox folders">
                    <ListItem value={1} button>
                        <ListItemText primary="Города"/>
                    </ListItem>
                    <Divider/>
                    <ListItem button divider>
                        <ListItemText primary="Мастера"/>
                    </ListItem>
                    <ListItem button>
                        <ListItemText primary="Заказы"/>
                    </ListItem>
                    <Divider light/>
                    <ListItem button>
                        <ListItemText primary="Пользователи"/>
                    </ListItem>
                </List>
                <Box sx={{gridArea: 'main'}}>
                    <CityList/>

                </Box>


            </Box>
        </Container>
    );
};

export default Admin;