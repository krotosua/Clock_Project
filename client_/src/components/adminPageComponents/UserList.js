import * as React from 'react';
import {useEffect, useState} from 'react';
import {
    Box,
    Button,
    CircularProgress,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Tooltip,
    Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import TablsPagination from "../TablsPagination";
import {activateUser, deleteUser, fetchUsers} from "../../http/userAPI";
import EditUser from "./modals/EditUser";
import CreateUser from "./modals/CreateUser";
import {ROLE_LIST} from "../../store/UserStore";


const UserList = ({alertMessage}) => {
    const [editVisible, setEditVisible] = useState(false)
    const [createVisible, setCreateVisible] = useState(false)
    const [userToEdit, setUserToEdit] = useState(null);
    const [usersList, setUsersList] = useState([])
    const [page, setPage] = useState(1)
    const [totalCount, setTotalCount] = useState()
    const [limit, setLimit] = useState(10)
    const [loading, setLoading] = useState(true)

    const getUsers = async () => {
        try {
            const res = await fetchUsers(page, limit)
            if (res.status === 204) {
                setUsersList([])
            }
            setUsersList(res.data.rows)
            setTotalCount(res.data.count)
        } catch (e) {
            setUsersList([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(async () => {
        await getUsers()
    }, [page])

    const changeActiveted = async (user) => {
        const changeInfo = {
            id: user.id,
            isActivated: !user.isActivated
        }
        try {
            await activateUser(changeInfo)
            user.isActivated = !user.isActivated
            alertMessage('Данные мастера успешно изменены', false)
        } catch (e) {
            alertMessage('Не удалось изменить данные мастера', true)
        }
    }

    const removeUser = async (id) => {
        try {
            await deleteUser(id)
            await getUsers()
            alertMessage('Успешно удаленно', false)
        } catch (e) {
            alertMessage('Не удалось удалить, так как у пользователя остались заказы', true)
        }
    }
    if (loading) {
        return (
            <Box sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: window.innerHeight - 60,
            }}>
                <CircularProgress/>
            </Box>
        )
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

                {usersList.length === 0 ? <h1>Список пуст</h1> : usersList.map((user, index) => {
                    return (<ListItem
                            key={user.id}
                            divider
                            secondaryAction={user.role !== ROLE_LIST.ADMIN ? <Tooltip title={'Удалить пользователя'}
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
                            {user.role !== ROLE_LIST.ADMIN ? <Tooltip title={'Изменить данные пользователя'}
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
                    getUsers={() => getUsers(page)}
                    alertMessage={alertMessage}
                /> : null}
            {createVisible ?
                <CreateUser
                    getUsers={() => getUsers(page)}
                    open={createVisible}
                    onClose={() => setCreateVisible(false)}
                    alertMessage={alertMessage}/> : null}

        </Box>
        <Box sx={{display: "flex", justifyContent: "center"}}>
            <TablsPagination page={page} totalCount={totalCount} limit={limit} pagesFunction={(page) => setPage(page)}/>
        </Box>
    </Box>);
}
export default UserList;
