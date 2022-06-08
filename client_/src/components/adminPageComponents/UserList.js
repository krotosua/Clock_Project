import * as React from 'react';
import {
    Box, List, ListItem, ListItemText, IconButton, Typography, Divider, Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import {useContext, useEffect, useState} from "react";
import {Context} from "../../index";
import {observer} from "mobx-react-lite";
import Pages from "../Pages";
import {deleteUser, fetchUsers} from "../../http/userAPI";
import EditUser from "./modals/EditUser";
import CreateUser from "./modals/CreateUser";


const UserList = observer(({alertMessage}) => {
    let {user} = useContext(Context)
    const [editVisible, setEditVisible] = useState(false)
    const [createVisible, setCreateVisible] = useState(false)
    const [userToEdit, setUserToEdit] = useState(null);
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
    const removeUser = (id) => {
        deleteUser(id).then(data => {
            user.setUsersList(user.usersList.filter(obj => obj.id !== id));
            alertMessage('Успешно удаленно', false)
            getUsers()

        }, (err) => {
            alertMessage('Не удалось удалить, так как у пользователя остались заказы', true)
        })
    }
    return (<Box>
        <Box sx={{flexGrow: 1, maxWidth: "1fr", minHeight: "700px"}}>

            <List subheader={<Typography sx={{mt: 4, mb: 2,}}
                                         variant="h6" component="div">
                Пользователи
            </Typography>}>
                <ListItem
                    secondaryAction={<Tooltip title={'Добавить пользователя'}
                                              placement="top"
                                              arrow>
                        <IconButton sx={{width: 20}}
                                    edge="end"
                                    aria-label="addCity"
                                    onClick={() => setCreateVisible(true)}
                        >
                            <AddIcon/>
                        </IconButton>
                    </Tooltip>}>
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

                {user.IsEmpty ? <h1>Список пуст</h1> : user.usersList.map((user, index) => {
                    return (<ListItem
                            key={user.id}
                            divider
                            secondaryAction={user.role !== "ADMIN" ? <Tooltip title={'Удалить пользователя'}
                                                                              placement="right"
                                                                              arrow>
                                <IconButton sx={{width: 10}}
                                            edge="end"
                                            aria-label="delete"
                                            onClick={() => removeUser(user.id)}
                                >
                                    <DeleteIcon/>
                                </IconButton>
                            </Tooltip> : <Box sx={{width: 10}}
                            >
                            </Box>}
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
                            {user.role !== "ADMIN" ? <Tooltip title={'Изменить данные пользователя'}
                                                              placement="left"
                                                              arrow>
                                <IconButton sx={{width: 5}}
                                            edge="end"
                                            aria-label="Edit"
                                            onClick={() => {
                                                setEditVisible(true)
                                                setUserToEdit(user)
                                            }}
                                >
                                    <EditIcon/>
                                </IconButton>
                            </Tooltip> : null}
                        </ListItem>

                    )
                })}

            </List>
            {editVisible ? <EditUser
                open={editVisible}
                userToEdit={userToEdit}
                onClose={() => {
                    setEditVisible(false)
                }}
                alertMessage={alertMessage}
            /> : null}
            {createVisible ? <CreateUser open={createVisible}
                                         onClose={() => setCreateVisible(false)}
                                         alertMessage={alertMessage}/> : null}

        </Box>
        <Box sx={{display: "flex", justifyContent: "center"}}>
            <Pages context={user}/>
        </Box>
    </Box>);
})
export default UserList;
