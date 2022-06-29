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
import {deleteCity, fetchCities} from "../../http/cityAPI";
import CreateCity from "./modals/CreateCity";
import EditCity from "./modals/EditCity";
import TablsPagination from "../TablsPagination";


const CityList = ({alertMessage}) => {
    const [cityVisible, setCityVisible] = useState(false)
    const [editVisible, setEditVisible] = useState(false)
    const [cityToEdit, setCityToEdit] = useState(null);
    const [citiesList, setCitiesList] = useState(null)
    const [page, setPage] = useState(1)
    const [totalCount, setTotalCount] = useState(null)
    const [limit, setLimit] = useState(10)
    const [loading, setLoading] = useState(true)

    const getCities = async (page, limit) => {
        try {
            const res = await fetchCities(page, limit)
            if (res.status === 204) {
                setCitiesList([])
                return
            }
            setTotalCount(res.data.count)
            setCitiesList(res.data.rows)
        } catch (e) {
            setCitiesList([])
        } finally {
            setLoading(false)
        }
    }
    useEffect(async () => {
        await getCities(page, limit)
    }, [page, limit])

    const removeCity = async (id) => {
        try {
            await deleteCity(id)
            await getCities(page, limit)
            alertMessage('Успешно удаленно', false)
        } catch (e) {
            alertMessage('Не удалось удалить, так как в городе присутствуют мастера', true)
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
                Города
            </Typography>
            <List disablePadding>
                <ListItem
                    key={1}
                    divider
                    secondaryAction={<Tooltip title={'Добавить город'}
                                              placement="top"
                                              arrow>
                        <IconButton sx={{width: 20}}
                                    edge="end"
                                    aria-label="addCity"
                                    onClick={() => setCityVisible(true)}
                        >
                            <AddIcon/>
                        </IconButton>
                    </Tooltip>}
                >
                    <ListItemText sx={{width: 10}}
                                  primary="№"
                    />
                    <ListItemText sx={{width: 10}}
                                  primary="Название города"
                    />
                    <ListItemText sx={{width: 10}}
                                  primary="Цена за час"
                    />
                </ListItem>
                <Divider orientation="vertical"/>
                {citiesList.length === 0 ? <h1>Список пуст</h1> : citiesList.map((city, index) => {
                    return (<ListItem
                            key={city.id}
                            divider
                            secondaryAction={<Tooltip title={'Удалить город'}
                                                      placement="right"
                                                      arrow>
                                <IconButton sx={{width: 10}}
                                            edge="end"
                                            aria-label="delete"
                                            onClick={() => removeCity(city.id)}
                                >
                                    <DeleteIcon/>
                                </IconButton>
                            </Tooltip>}
                        >
                            <ListItemText sx={{width: 10}}
                                          primary={index + 1}
                            />
                            <ListItemText sx={{width: 10}}
                                          primary={city.name}
                            />
                            <ListItemText sx={{width: 10}}
                                          primary={city.price + " грн"}
                            />
                            <Tooltip title={'Изменить навзвание города'}
                                     placement="left"
                                     arrow>
                                <IconButton sx={{width: 5}}
                                            edge="end"
                                            aria-label="Edit"
                                            onClick={() => {
                                                setEditVisible(true)
                                                setCityToEdit(city)
                                            }}
                                >
                                    <EditIcon/>
                                </IconButton>
                            </Tooltip>
                        </ListItem>

                    )
                })}
            </List>

            {editVisible ? <EditCity
                open={editVisible}
                onClose={() => {
                    setEditVisible(false)
                }}
                getCities={() => getCities()}
                cityToEdit={cityToEdit}
                alertMessage={alertMessage}
            /> : null}

            {cityVisible ? <CreateCity open={cityVisible}
                                       getCities={() => getCities(page, limit)}
                                       onClose={() => setCityVisible(false)}
                                       alertMessage={alertMessage}/> : null}
        </Box>
        <Box style={{display: "flex", justifyContent: "center"}}>
            <TablsPagination page={page} totalCount={totalCount} limit={limit} pagesFunction={(page) => setPage(page)}/>
        </Box>
    </Box>);
}
export default CityList;
