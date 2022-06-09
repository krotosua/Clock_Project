import * as React from 'react';
import {
    Box,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Typography,
    Divider,
    Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import {useContext, useEffect, useState} from "react";
import {Context} from "../../index";
import {observer} from "mobx-react-lite";
import {deleteCity, fetchCity} from "../../http/cityAPI";
import CreateCity from "./modals/CreateCity";
import EditCity from "./modals/EditCity";
import Pages from "../Pages";


const CityList = observer(({alertMessage}) => {
    let {cities} = useContext(Context)
    const [cityVisible, setCityVisible] = useState(false)
    const [editVisible, setEditVisible] = useState(false)
    const [idToEdit, setIdToEdit] = useState(null);
    const [nameToEdit, setNameToEdit] = useState("")

    useEffect(() => {
        getCity()
    }, [cities.page])

    const getCity = () => {
        fetchCity(cities.page, 10).then(res => {
            if (res.status === 204) {
                return cities.setIsEmpty(true)
            } else {
                cities.setIsEmpty(false)
                cities.setCities(res.data.rows)
                cities.setTotalCount(res.data.count)
            }
        }, error => cities.setIsEmpty(true))
    }
    const removeCity = (id) => {
        deleteCity(id).then((res) => {
            cities.setCities(cities.cities.filter(obj => obj.id !== id));
            alertMessage('Успешно удаленно', false)
            getCity()
        }, (err) => {
            alertMessage('Не удалось удалить, так как в городе присутствуют мастера', true)
        })

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
                </ListItem>
                <Divider orientation="vertical"/>

                {cities.IsEmpty ? <h1>Список пуст</h1> : cities.cities.map((city, index) => {

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
                            <Tooltip title={'Изменить навзвание города'}
                                     placement="left"
                                     arrow>
                                <IconButton sx={{width: 5}}
                                            edge="end"
                                            aria-label="Edit"
                                            onClick={() => {
                                                setNameToEdit(city.name)
                                                setEditVisible(true)
                                                setIdToEdit(city.id)
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
                idToEdit={idToEdit}
                alertMessage={alertMessage}

                nameToEdit={nameToEdit}
            /> : null}

            <CreateCity open={cityVisible}

                        onClose={() => setCityVisible(false)}
                        alertMessage={alertMessage}/>

        </Box>
        <Box style={{display: "flex", justifyContent: "center"}}>
            <Pages context={cities}/>
        </Box>
    </Box>);
})
export default CityList;
