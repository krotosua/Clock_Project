import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import {observer} from "mobx-react-lite";
import {useContext} from "react";
import {Context} from "../../index";
import {checkUtils} from "@material-ui/pickers/_shared/hooks/useUtils";


const CityList = () => {
    let {city} = useContext(Context)

    return (
        <Box sx={{flexGrow: 1, maxWidth: 752}}>
            <Typography sx={{mt: 4, mb: 2}} variant="h6" component="div">
                Города
            </Typography>
            <List>
                {city.cities.map(city =>
                    console.log(city)
                )}
            </List>

        </Box>
    );
}
export default CityList;
