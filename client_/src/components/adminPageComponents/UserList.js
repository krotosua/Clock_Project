import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import {useContext, useEffect} from "react";
import {Context} from "../../index";
import Divider from "@mui/material/Divider";
import {observer} from "mobx-react-lite";
import {Tooltip} from "@mui/material";
import {deleteUser, fetchUsers} from "../../http/userAPI";
import PersonIcon from '@mui/icons-material/Person';
import Pages from "../Pages";


const CityList = observer(({alertMessage}) => {
    let {user} = useContext(Context)
    const getUsers = () => {
        fetchUsers(user.page, 10).then(res => {
            if (res.status === 204) {
                return user.setIsEmpty(true)

            }
            user.setIsEmpty(false)
            user.setUsersList(res.data.rows)
            user.setTotalCount(res.data.count)
        }, error => user.setIsEmpty(true))
    }
    useEffect(() => {
        getUsers()
    }, [])
    const delUser = (id) => {
        deleteUser(id).then(data => {
            user.setUsersList(user.usersList.filter(obj => obj.id !== id));
            alertMessage('Успешно удаленно', false)
            getUsers()

        }, (err) => {
            alertMessage('Не удалось удалить, так как у пользователя остались заказы', true)
        })
    }
    return (
        <Box>
            <Box sx={{flexGrow: 1, maxWidth: "1fr", minHeight: "700px"}}>

                <List subheader={
                    <Typography sx={{mt: 4, mb: 2,}}
                                variant="h6" component="div">
                        Пользователи
                    </Typography>}>
                    <ListItem
                        secondaryAction={
                            <PersonIcon/>}>
                        <ListItemText sx={{width: "2px",}}
                                      primary="№"
                        /><ListItemText sx={{width: 10}}
                                        primary="ID пользователя"
                    />
                        <ListItemText sx={{width: "40px", pr: 10}}
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
                                        user.role === "USER" ?
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
                                            </Tooltip> : <Box sx={{width: 10}}
                                            >
                                            </Box>
                                    }
                                >

                                    <ListItemText sx={{width: "2px"}}
                                                  primary={index + 1}
                                    />
                                    <ListItemText sx={{width: 10, height: 20, whiteSpace: 'wrap'}}
                                                  primary=
                                                      {user.id}
                                    />
                                    <ListItemText sx={{width: "40px", pr: 10}}
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
            <Box sx={{display: "flex", justifyContent: "center"}}>
                <Pages context={user}/>
            </Box>
        </Box>
    );
})
export default CityList;
