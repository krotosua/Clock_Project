import * as React from 'react';
import {useContext, useEffect, useState} from 'react';
import {Box, Button, Divider, IconButton, List, ListItem, ListItemText, Tooltip, Typography,} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import {Context} from "../../index";
import {observer} from "mobx-react-lite";
import Pages from "../Pages";
import {activateUser, deleteUser, fetchUsers} from "../../http/userAPI";
import EditUser from "./modals/EditUser";
import CreateUser from "./modals/CreateUser";


const UserList = observer(({alertMessage}) => {

    let {user} = useContext(Context)

    const [editVisible, setEditVisible] = useState(false)
    const [createVisible, setCreateVisible] = useState(false)
    const [userToEdit, setUserToEdit] = useState(null);
    const getUsers = async () => {
        try {
            const res = await fetchUsers(user.page, 10)
            if (res.status === 204) {
                return user.setIsEmpty(true)
            }
            user.setIsEmpty(false)
            user.setUsersList(res.data.rows)
            user.setTotalCount(res.data.count)
        } catch (e) {
            user.setIsEmpty(true)
        }
    }
    useEffect(async () => {
        await getUsers()

    }, [user.page])
    const changeActiveted = async (user) => {
        const changeInfo = {
            id: user.id,
            isActivated: !user.isActivated
        }
        try {
            await activateUser(changeInfo)
            alertMessage('Данные мастера успешно изменены', false)
            return user.isActivated = !user.isActivated
        } catch (e) {
            alertMessage('Не удалось изменить данные мастера', true)
        }
    }

    const removeUser = async (id) => {
        try {
            await deleteUser(id)
            user.setUsersList(user.usersList.filter(user => user.id !== id));
            alertMessage('Успешно удаленно', false)
            await getUsers()
        } catch (e) {
            alertMessage('Не удалось удалить, так как у пользователя остались заказы', true)
        }
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
                    <ListItemText sx={{width: 10}}
                                  primary="Статус"
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
                            <ListItemText sx={{width: 10}}
                                          primary={<Button color={user.isActivated ? "success" : "error"}
                                                           size="small"
                                                           variant="outlined"
                                                           onClick={() => changeActiveted(user)}
                                          >
                                              {user.isActivated ? "Активный" : "Не активный"}
                                          </Button>}
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
            {editVisible ?
                <EditUser
                    open={editVisible}
                    userToEdit={userToEdit}
                    onClose={() => {
                        setEditVisible(false)
                    }}
                    getUsers={() => getUsers()}
                    alertMessage={alertMessage}
                /> : null}
            {createVisible ?
                <CreateUser
                    getUsers={() => getUsers()}
                    open={createVisible}
                    onClose={() => setCreateVisible(false)}
                    alertMessage={alertMessage}/> : null}

        </Box>
        <Box sx={{display: "flex", justifyContent: "center"}}>
            <Pages context={user}/>
        </Box>
    </Box>);
})
export default UserList;
