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
import {Tooltip} from "@mui/material";
import {deleteSize, fetchSize} from "../../http/sizeAPI";
import CreateSize from "./modals/CreateSize";
import EditSize from "./modals/EditSize";
import Pages from "../Pages";


const SizeList = observer(({alertMessage, getValue}) => {
    let {size} = useContext(Context)
    const [createVisible, setCreateVisible] = useState(false);
    const [editVisible, setEditVisible] = useState(false);
    const [idToEdit, setIdToEdit] = useState(null);
    const [nameToEdit, setNameToEdit] = useState(null);
    const [dateToEdit, setDateToEdit] = useState(null);
    const getSize = () => {
        fetchSize(size.page, 10).then(res => {
            if (res.status === 204) {
                return size.setIsEmpty(true)
            }
            size.setIsEmpty(false)
            size.setSize(res.data.rows)
            size.setTotalCount(res.data.count)
        }, (err) => {
            size.setIsEmpty(true)
        })
    }
    useEffect(() => {
        getSize()
    }, [size.page])


    const delSize = (id) => {
        deleteSize(id).then((res) => {
            size.setSize(size.size.filter(obj => obj.id !== id));
            alertMessage('Успешно удаленно', false)
            getSize()
        }, (err) => {
            alertMessage('Не удалось удалить', true)
            return
        })

    }

    return (
        <Box>
            <Box sx={{flexGrow: 1, maxWidth: "1fr", minHeight: "700px"}}>
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
                                            aria-label="addSize"
                                            onClick={() => setCreateVisible(true)}
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
                                        <Tooltip title={'Удалить часы'}
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
                                                    onClick={() => {
                                                        setEditVisible(true)
                                                        setIdToEdit(size.id)
                                                        setNameToEdit(size.name)
                                                        setDateToEdit(new Date(new Date().setHours(size.date.slice(0, 2), 0, 0)))
                                                    }}
                                        >
                                            <EditIcon/>
                                        </IconButton>
                                    </Tooltip>
                                </ListItem>
                            )
                        })}
                </List>
                <CreateSize open={createVisible}
                            alertMessage={alertMessage}
                            onClose={() => {
                                setCreateVisible(false)
                            }}/>
                {editVisible ? <EditSize
                    open={editVisible}
                    onClose={() => setEditVisible(false)}
                    idToEdit={idToEdit}
                    alertMessage={alertMessage}
                    nameToEdit={nameToEdit}
                    dateToEdit={dateToEdit}
                /> : null}
            </Box>
            <Box sx={{display: "flex", justifyContent: "center"}}>
                <Pages context={size}/>
            </Box>
        </Box>
    );
})
export default SizeList;
