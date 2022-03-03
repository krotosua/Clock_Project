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
import CreateCity from "./modals/CreateCity";
import {Tooltip} from "@mui/material";
import EditCity from "./modals/EditCity";
import {deleteUser, fetchUsers} from "../../http/userAPI";
import PersonIcon from '@mui/icons-material/Person';


const CityList = observer(() => {
    let {user} = useContext(Context)

    useEffect(() => {
        fetchUsers().then(res => {
            if (res.status === 204) {
                user.setIsEmpty(true)
                return
            }
            user.setUsersList(res.data.rows)
        })
    }, [])
    const delUser = (id) => {
        deleteUser(id).then(data => console.log(data))
        user.setUsersList(user.usersList.filter(obj => obj.id !== id));
        if (user.usersList.length === 0) {
            user.setIsEmpty(true)
        } else {
            user.setIsEmpty(false)
        }
    }

    return (

        <Box sx={{flexGrow: 1, maxWidth: "1fr"}}>
            <Typography sx={{mt: 4, mb: 2}} variant="h6" component="div">
                Пользователи
            </Typography>
            <List disablePadding>
                <ListItem
                    secondaryAction={

                        <PersonIcon sx={{width: 30}}
                                    edge="end"
                                    aria-label="delete"

                        >
                            <DeleteIcon/>
                        </PersonIcon>

                    }
                >
                    <ListItemText sx={{width: 5}}
                                  primary="№"
                    /><ListItemText sx={{width: 10}}
                                    primary="ID пользователя"
                />
                    <ListItemText sx={{width: 10}}
                                  primary="Email пользователя"
                    />
                    <ListItemText sx={{width: 10}}
                                  primary="Роль пользователя"
                    />
                </ListItem>
                <Divider orientation="vertical"/>

                {user.IsEmpty ? <h1>Список пуст</h1> :
                    user.usersList.map((user, index) => {

                        return (<ListItem
                                key={user.id}
                                divider
                                secondaryAction={
                                    <Tooltip title={'Удалить пользователя'}
                                             placement="right"
                                             arrow>
                                        <IconButton sx={{width: 10}}
                                                    edge="end"
                                                    aria-label="delete"
                                                    onClick={() => delUser(user.id)}
                                        >
                                            <DeleteIcon/>
                                        </IconButton>
                                    </Tooltip>
                                }
                            >

                                <ListItemText sx={{width: 5}}
                                              primary={index + 1}
                                />
                                <ListItemText sx={{width: 10}}
                                              primary={user.id}
                                />
                                <ListItemText sx={{width: 10}}
                                              primary={user.email}
                                />
                                <ListItemText sx={{width: 10}}
                                              primary={user.role}
                                />
                            </ListItem>

                        )
                    })}

            </List>

        </Box>
    );
})
export default CityList;
