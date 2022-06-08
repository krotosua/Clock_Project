import * as React from 'react';
import {
    Box, List, ListItem, ListItemText, IconButton, Typography, Divider, Tooltip, Rating, Button
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import {useContext, useEffect, useState} from "react";
import {Context} from "../../index";
import {observer} from "mobx-react-lite";
import {activateMaster, deleteMaster, fetchMasters} from "../../http/masterAPI";
import CreateMaster from "./modals/CreateMaster";
import EditMaster from "./modals/EditMaster";
import Pages from "../Pages";


const MasterList = observer(({alertMessage}) => {
    let {masters, cities} = useContext(Context)
    const [createVisible, setCreateVisible] = useState(false)
    const [editVisible, setEditVisible] = useState(false)
    const [idToEdit, setIdToEdit] = useState(null);
    const [nameToEdit, setNameToEdit] = useState(null)
    const [ratingToEdit, setRatingToEdit] = useState(null)
    const [cityToEdit, setCityToEdit] = useState([]);


    useEffect(() => {
        getMasters()
    }, [masters.page])


    const getMasters = () => {
        fetchMasters(null, null, masters.page, 10).then(res => {
            if (res.status === 204) {
                return masters.setIsEmpty(true)
            }
            masters.setIsEmpty(false)
            masters.setMasters(res.data.rows)
            masters.setTotalCount(res.data.count)
        }, (err) => {
            return masters.setIsEmpty(true)

        })
    }

    const changeActiveted = (master) => {
        let changeInfo = {
            id: master.id, isActivated: !master.isActivated
        }

        activateMaster(changeInfo)
            .then(res => {
                alertMessage('Данные мастера успешно изменены', false)
                return master.isActivated = !master.isActivated
            }, err => {
                alertMessage('Не удалось изменить данные мастера', true)
            })
    }


    const removeMaster = (id) => {
        deleteMaster(id).then((res) => {
            masters.setMasters(masters.masters.filter(master => master.id !== id));
            alertMessage('Успешно удаленно', false)
            getMasters()
        }, (err) => {
            alertMessage('Не удалось удалить, так как у мастера есть еще заказы', true)
        })
    }

    const createCityList = (master) => {
        let cityList = ""
        for (let i = 0; i < master.cities.length; i++) {
            if (i == 0) {
                cityList += `${master.cities[i].name}`
            } else {
                cityList = `${cityList}, ${master.cities[i].name}`
            }
        }
        return cityList
    }

    const forEdit = (master) => {
        let changeCity = []
        setEditVisible(true)
        setIdToEdit(master.id)
        setNameToEdit(master.name)
        setRatingToEdit(master.rating)
        changeCity = master.cities.map(item => item.id)
        setCityToEdit(cities.cities.filter(cities => changeCity.indexOf(cities.id) > -1))
    }

    return (<Box sx={{position: "relative"}}>
        <Box sx={{flexGrow: 1, maxWidth: "1fr", minHeight: "700px"}}>
            <Typography sx={{mt: 4, mb: 2}} variant="h6" component="div">
                Мастера
            </Typography>
            <List disablePadding>

                <ListItem
                    key={1}
                    divider
                    secondaryAction={<Tooltip title={'Добавить мастера'}
                                              placement="top"
                                              arrow>
                        <IconButton sx={{width: 20}}
                                    edge="end"
                                    aria-label="Add"
                                    onClick={() => setCreateVisible(true)}>

                            <AddIcon/>
                        </IconButton>
                    </Tooltip>}
                >
                    <ListItemText sx={{width: 10}}
                                  primary="№"/>
                    <ListItemText sx={{width: 10}}
                                  primary="ID пользователя"/>
                    <ListItemText sx={{width: 10}}
                                  primary="Имя мастера"/>
                    <ListItemText sx={{width: 10}}
                                  primary="Рейтинг"/>
                    <ListItemText sx={{width: 10}}
                                  primary="Город"/>
                    <ListItemText sx={{width: 10}}
                                  primary="Статус"/>
                </ListItem>

                <Divider orientation="vertical"/>
                {masters.IsEmpty ? <h1>Список пуст</h1> : masters.masters.map((master, index) => {
                    let cityList = createCityList(master)
                    return (<ListItem
                        key={master.id}
                        divider
                        secondaryAction={<IconButton sx={{width: 10}}
                                                     edge="end"
                                                     aria-label="delete"
                                                     onClick={() => removeMaster(master.id)}
                        >
                            <DeleteIcon/>
                        </IconButton>}>
                        <ListItemText sx={{width: 10}}
                                      primary={index + 1}
                        />
                        <ListItemText sx={{width: 10}}
                                      primary={master.user.id}/>

                        <ListItemText sx={{width: 10}}
                                      primary={master.name}/>

                        <ListItemText sx={{width: 10}}
                                      primary={
                                          <Rating name="read-only" size="small" value={master.rating} precision={0.2}
                                                  readOnly/>}/>
                        <ListItemText sx={{width: 10}}
                                      primary={cityList}/>
                        <ListItemText sx={{width: 10}}
                                      primary={
                                          <Button color={master.isActivated ? "success" : "error"}
                                                  size="small"
                                                  variant="outlined"
                                                  onClick={() => changeActiveted(master)}>
                                              {master.isActivated ? "Актив" : "Не актив"}
                                          </Button>
                                      }
                        />
                        <IconButton sx={{width: 5}}
                                    edge="end"
                                    aria-label="Edit"
                                    onClick={() => {
                                        forEdit(master)

                                    }}
                        >
                            <EditIcon/>
                        </IconButton>
                    </ListItem>)
                })}
            </List>
            {editVisible ? <EditMaster open={editVisible}
                                       onClose={() => setEditVisible(false)}
                                       idToEdit={idToEdit}
                                       alertMessage={alertMessage}
                                       nameToEdit={nameToEdit}
                                       ratingToEdit={ratingToEdit}
                                       cityChosen={cityToEdit}/> : null}
            <CreateMaster open={createVisible}
                          alertMessage={alertMessage}
                          onClose={() => setCreateVisible(false)}/>
        </Box>
        <Box sx={{display: "flex", justifyContent: "center"}}>
            <Pages context={masters}/>
        </Box>
    </Box>);
        })
        export default MasterList;
