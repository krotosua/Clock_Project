import * as React from 'react';
import {useContext, useEffect, useState} from 'react';
import {Box, Divider, IconButton, List, ListItem, ListItemText, Tooltip, Typography,} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import {Context} from "../../index";
import {deleteSize, fetchSize} from "../../http/sizeAPI";
import CreateSize from "./modals/CreateSize";
import EditSize from "./modals/EditSize";
import {observer} from "mobx-react-lite";
import Pages from "../Pages";
import {set} from 'date-fns'

const SizeList = observer(({alertMessage, getValue}) => {
    let {size} = useContext(Context)
    const [createVisible, setCreateVisible] = useState(false);
    const [editVisible, setEditVisible] = useState(false);
    const [idToEdit, setIdToEdit] = useState(null);
    const [sizeToEdit, setSizeToEdit] = useState(null);
    const [dateToEdit, setDateToEdit] = useState(null);
    const getSize = async () => {
        try {
            const res = await fetchSize(size.page, 10)
            if (res.status === 204) {
                return size.setIsEmpty(true)
            }
            size.setIsEmpty(false)
            size.setSize(res.data.rows)
            size.setTotalCount(res.data.count)
        } catch (e) {
            size.setIsEmpty(true)
        }
    }
    useEffect(async () => {
        await getSize()
    }, [size.page])


    const removeSize = async (id) => {
        try {
            await deleteSize(id)
            size.setSize(size.size.filter(obj => obj.id !== id));
            alertMessage('Успешно удаленно', false)
            await getSize()
        } catch (e) {
            alertMessage('Не удалось удалить', true)
        }
    }

    return (<Box>
        <Box sx={{flexGrow: 1, maxWidth: "1fr", minHeight: "700px"}}>
            <Typography sx={{mt: 4, mb: 2}} variant="h6" component="div">
                Размеры часов
            </Typography>
            <List disablePadding>
                <ListItem
                    key={1}
                    divider
                    secondaryAction={<Tooltip title={'Добавить размер часов'}
                                              placement="top"
                                              arrow>
                        <IconButton sx={{width: 20}}
                                    edge="end"
                                    aria-label="addSize"
                                    onClick={() => setCreateVisible(true)}
                        >
                            <AddIcon/>
                        </IconButton>
                    </Tooltip>}
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

                {size.IsEmpty ? <h1>Список пуст</h1> : size.size.map((size, index) => {

                    return (<ListItem
                        key={size.id}
                        divider

                        secondaryAction={<Tooltip title={'Удалить часы'}
                                                  placement="right"
                                                  arrow>
                            <IconButton sx={{width: 10}}
                                        edge="end"
                                        aria-label="delete"
                                        onClick={() => removeSize(size.id)}
                            >
                                <DeleteIcon/>
                            </IconButton>
                        </Tooltip>}
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
                                            setSizeToEdit(size)
                                            setDateToEdit(set(new Date(), {
                                                hours: size.date.slice(0, 2),
                                                minutes: 0,
                                                seconds: 0
                                            }))
                                        }}
                            >
                                <EditIcon/>
                            </IconButton>
                        </Tooltip>
                    </ListItem>)
                })}
            </List>
            {createVisible ? <CreateSize open={createVisible}
                                         getSize={() => getSize()}
                                         alertMessage={alertMessage}
                                         onClose={() => {
                                             setCreateVisible(false)
                                         }}/> : null}
            {editVisible ? <EditSize
                getSize={() => getSize()}
                open={editVisible}
                onClose={() => setEditVisible(false)}
                idToEdit={idToEdit}
                alertMessage={alertMessage}
                sizeToEdit={sizeToEdit}
                dateToEdit={dateToEdit}
            /> : null}
        </Box>
        <Box sx={{display: "flex", justifyContent: "center"}}>
            <Pages context={size}/>
        </Box>
    </Box>);
})
export default SizeList;
