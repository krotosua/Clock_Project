import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';

import {useContext} from "react";
import {Context} from "../../index";


const OrderList = () => {
    let {orders} = useContext(Context)

    return (
        <Box sx={{flexGrow: 1, maxWidth: 752}}>
            <Typography sx={{mt: 4, mb: 2}} variant="h6" component="div">
                Заказы
            </Typography>
            <List>
                {orders.orders.map(order => {
                    return (<ListItem
                        secondaryAction={
                            <IconButton edge="end" aria-label="delete">
                                <DeleteIcon/>
                            </IconButton>
                        }
                    >
                        <ListItemText
                            primary={order.name}
                        />

                    </ListItem>)
                })}
            </List>

        </Box>
    );
}
export default OrderList;
