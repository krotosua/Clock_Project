import * as React from 'react';
import {useEffect, useState} from 'react';
import {
    Box,
    CircularProgress,
    Divider,
    FormControl,
    IconButton,
    InputLabel,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    MenuItem,
    Select,
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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';


const CityList = ({alertMessage}) => {
    const [cityVisible, setCityVisible] = useState(false)
    const [editVisible, setEditVisible] = useState(false)
    const [cityToEdit, setCityToEdit] = useState(null);
    const [citiesList, setCitiesList] = useState(null)
    const [page, setPage] = useState(1)
    const [totalCount, setTotalCount] = useState(null)
    const [limit, setLimit] = useState(10)
    const [sorting, setSorting] = useState("name")
    const [ascending, setAscending] = useState(false)
    const [loading, setLoading] = useState(true)

    const getCities = async (page, limit, sorting, ascending) => {
        try {
            const res = await fetchCities(page, limit, sorting, ascending)
            if (res.status === 204) {
                setCitiesList([])
                setTotalCount(0)
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
        await getCities(page, limit, sorting, ascending)
    }, [page, limit, sorting, ascending])

    const removeCity = async (id) => {
        try {
            await deleteCity(id)
            await getCities(page, limit, sorting, ascending)
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
    const sortingList = (param) => {
        if (sorting === param) {
            setAscending(!ascending)
            return
        }
        setAscending(true)
        setSorting(param)
    }

    return (<Box>
        <Box sx={{flexGrow: 1, maxWidth: "1fr", minHeight: document.documentElement.clientHeight - 135}}>
            <Box sx={{display: "flex", justifyContent: "space-between"}}>
                <Typography sx={{mt: 4, mb: 2}} variant="h6" component="div">
                    Города
                </Typography>

            </Box>
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

                    <ListItemButton
                        selected={sorting === "id"}
                        sx={{ml: -2}}
                        onClick={() => sortingList("id")}
                    >
                        <ListItemText primary="ID"/>
                        {!ascending ? sorting === "id" && <ExpandMoreIcon/> : sorting === "id" && <ExpandLessIcon/>}
                    </ListItemButton>

                    <ListItemButton
                        selected={sorting === "name"}
                        onClick={() => sortingList("name")}
                    >
                        <ListItemText primary="Название города"/>
                        {!ascending ? sorting === "name" && <ExpandMoreIcon/> : sorting === "name" && <ExpandLessIcon/>}
                    </ListItemButton>
                    <ListItemButton
                        selected={sorting === "price"}
                        onClick={() => sortingList("price")}
                    >
                        <ListItemText primary="Цена за час"/>
                        {!ascending ? sorting === "price" && <ExpandMoreIcon/> : sorting === "price" &&
                            <ExpandLessIcon/>}
                    </ListItemButton>
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
                            <ListItemText sx={{width: 10,}}
                                          primary={city.id}
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
                getCities={() => getCities(page, limit, sorting, ascending)}
                cityToEdit={cityToEdit}
                alertMessage={alertMessage}
            /> : null}

            {cityVisible ? <CreateCity open={cityVisible}
                                       getCities={() => getCities(page, limit, sorting, ascending)}
                                       onClose={() => setCityVisible(false)}
                                       alertMessage={alertMessage}/> : null}
        </Box>
        <Box style={{display: "flex", justifyContent: "center"}}>
            <TablsPagination page={page} totalCount={totalCount} limit={limit} pagesFunction={(page) => setPage(page)}/>
            <FormControl variant="standard" sx={{m: 1, width: 60, position: "absolute", left: 1450}} size="small">
                <InputLabel id="limit">Лимит</InputLabel>
                <Select
                    labelId="limit"
                    id="limit"
                    value={limit}
                    onChange={(e) => setLimit(e.target.value)}
                    label="Лимит"
                >
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                </Select>
            </FormControl>
        </Box>

    </Box>);
}
export default CityList;
