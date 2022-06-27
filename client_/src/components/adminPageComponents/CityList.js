import * as React from 'react';
import {useEffect, useState} from 'react';
import {Box, Divider, IconButton, List, ListItem, ListItemText, Tooltip, Typography,} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import {deleteCity} from "../../http/cityAPI";
import CreateCity from "./modals/CreateCity";
import EditCity from "./modals/EditCity";
import Pages from "../Pages";
import {useDispatch, useSelector} from "react-redux";
import {removeCityAction, setPageCityAction} from "../../store/CityStore";
import {getCities} from "../../asyncActions/cities";


const CityList = ({alertMessage}) => {
    const dispatch = useDispatch()
    const cities = useSelector(state => state.city)
    const [cityVisible, setCityVisible] = useState(false)
    const [editVisible, setEditVisible] = useState(false)
    const [cityToEdit, setCityToEdit] = useState(null);
    useEffect(async () => {
        dispatch(getCities(cities.page))
    }, [cities.page])

    const removeCity = async (id) => {
        try {
            await deleteCity(id)
            dispatch(removeCityAction(id))
            alertMessage('Успешно удаленно', false)
            dispatch(getCities(cities.page))
        } catch (e) {
            alertMessage('Не удалось удалить, так как в городе присутствуют мастера', true)
        }
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

                {cities.isEmpty ? <h1>Список пуст</h1> : cities.cities.map((city, index) => {

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
                cityToEdit={cityToEdit}
                alertMessage={alertMessage}
            /> : null}

            {cityVisible ? <CreateCity open={cityVisible}
                                       getCity={() => dispatch(getCities(cities.page))}
                                       onClose={() => setCityVisible(false)}
                                       alertMessage={alertMessage}/> : null}

        </Box>
        <Box style={{display: "flex", justifyContent: "center"}}>
            <Pages store={cities} pagesFunction={setPageCityAction}/>
        </Box>
    </Box>);
}
export default CityList;
