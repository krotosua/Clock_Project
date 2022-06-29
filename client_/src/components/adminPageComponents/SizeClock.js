import * as React from 'react';
import {useEffect, useState} from 'react';
import {
    Box,
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
import {deleteSize, fetchSize} from "../../http/sizeAPI";
import CreateSize from "./modals/CreateSize";
import EditSize from "./modals/EditSize";
import TablsPagination from "../TablsPagination";
import {set} from 'date-fns'

const SizeList = ({alertMessage, getValue}) => {
    const [createVisible, setCreateVisible] = useState(false);
    const [editVisible, setEditVisible] = useState(false);
    const [idToEdit, setIdToEdit] = useState(null);
    const [sizeToEdit, setSizeToEdit] = useState(null);
    const [dateToEdit, setDateToEdit] = useState(null);
    const [sizesList, setSizesList] = useState(null)
    const [page, setPage] = useState(1)
    const [totalCount, setTotalCount] = useState(null)
    const [limit, setLimit] = useState(10)
    const [loading, setLoading] = useState(true)
    const getSizes = async () => {
        try {
            const res = await fetchSize(page, 10)
            if (res.status === 204) {
                setSizesList([])
            }
            setSizesList(res.data.rows)
            setTotalCount(res.data.count)
        } catch (e) {
            setSizesList([])
        } finally {
            setLoading(false)
        }
    }
    useEffect(async () => {
        await getSizes()
    }, [page, limit])


    const removeSize = async (id) => {
        try {
            await deleteSize(id)
            await getSizes()
            alertMessage('Успешно удаленно', false)
        } catch (e) {
            alertMessage('Не удалось удалить', true)
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

                {sizesList.length === 0 ? <h1>Список пуст</h1> : sizesList.map((size, index) => {

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
                                         getSize={() => getSizes()}
                                         alertMessage={alertMessage}
                                         onClose={() => {
                                             setCreateVisible(false)
                                         }}/> : null}
            {editVisible ? <EditSize
                getSize={() => getSizes()}
                open={editVisible}
                onClose={() => setEditVisible(false)}
                idToEdit={idToEdit}
                alertMessage={alertMessage}
                sizeToEdit={sizeToEdit}
                dateToEdit={dateToEdit}
            /> : null}
        </Box>
        <Box sx={{display: "flex", justifyContent: "center"}}>
            <TablsPagination page={page} totalCount={totalCount} limit={limit} pagesFunction={(page) => setPage(page)}/>
        </Box>
    </Box>);
}
export default SizeList;
