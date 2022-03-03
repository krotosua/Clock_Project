import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import {useContext, useEffect, useState} from "react";
import {Context} from "../../index";
import Divider from "@mui/material/Divider";
import {observer} from "mobx-react-lite";
import {deleteCity, fetchCity} from "../../http/cityAPI";

import {Tooltip} from "@mui/material";

import {deleteSize, fetchSize} from "../../http/sizeAPI";
import CreateSize from "./modals/CreateSize";


const SizeList = observer(() => {
    let {size} = useContext(Context)
    const [sizeVisible, setSizeVisible] = useState(false)
    const [editVisible, setEditVisible] = useState(false)
    const [idToEdit, setIdToEdit] = useState(null);
    useEffect(() => {
        fetchSize().then(res => {
            if (res.status === 204) {
                return size.setIsEmpty(true)
            }
          
            return size.setSize(res.data.rows)
        }, (err) => {
            size.setIsEmpty(true)
        })
    }, [])

//delete size
    const delSize = (id) => {
        deleteSize(id).then((res) => {
            size.setSize(size.size.filter(obj => obj.id !== id));
            if (size.size.length === 0) {
                size.setIsEmpty(true)
            } else {
                size.setIsEmpty(false)
            }
        }, (err) => {
            return console.error(err)
        })

    }

    return (

        <Box sx={{flexGrow: 1, maxWidth: "1fr"}}>
            <Typography sx={{mt: 4, mb: 2}} variant="h6" component="div">
                Размеры часов
            </Typography>
            <List disablePadding>
                <ListItem
                    key={1}
                    divider
                    secondaryAction={
                        <Tooltip title={'Добавить размер часов'}
                                 placement="top"
                                 arrow>
                            <IconButton sx={{width: 20}}
                                        edge="end"
                                        aria-label="addCity"
                                        onClick={() => setSizeVisible(true)}
                            >
                                <AddIcon/>
                            </IconButton>
                        </Tooltip>
                    }
                >
                    <ListItemText sx={{width: 10}}
                                  primary="№"
                    />
                    <ListItemText sx={{width: 10}}
                                  primary="Название часов"
                    />
                    <ListItemText sx={{width: 10}}
                                  primary="Количество времени"
                    />
                </ListItem>
                <Divider orientation="vertical"/>

                {size.IsEmpty ? <h1>Список пуст</h1> :
                    size.size.map((size, index) => {

                        return (<ListItem
                                key={size.id}
                                divider

                                secondaryAction={
                                    <Tooltip title={'Удалить город'}
                                             placement="right"
                                             arrow>
                                        <IconButton sx={{width: 10}}
                                                    edge="end"
                                                    aria-label="delete"
                                                    onClick={() => delSize(size.id)}
                                        >
                                            <DeleteIcon/>
                                        </IconButton>
                                    </Tooltip>
                                }
                            >
                                <ListItemText sx={{width: 10}}
                                              primary={index + 1}
                                />
                                <ListItemText sx={{width: 10}}
                                              primary={size.name}
                                />
                                <ListItemText sx={{width: 10}}
                                              primary={size.date}
                                />
                                <Tooltip title={'Изменить параметры часов'}
                                         placement="left"
                                         arrow>
                                    <IconButton sx={{width: 5}}
                                                edge="end"
                                                aria-label="Edit"

                                    >
                                        <EditIcon/>
                                    </IconButton>
                                </Tooltip>
                            </ListItem>
                        )
                    })}
            </List>
            <CreateSize open={sizeVisible} onClose={() => setSizeVisible(false)}/>
        </Box>
    );
})
export default SizeList;
