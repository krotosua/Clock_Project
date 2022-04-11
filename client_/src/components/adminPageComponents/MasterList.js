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
import {deleteMaster, fetchMaster} from "../../http/masterAPI";
import CreateMaster from "./modals/CreateMaster";
import EditMaster from "./modals/EditMaster";
import {Tooltip} from "@mui/material";
import Pages from "../Pages";


const MasterList = observer(({alertMessage, getValue}) => {
    let {masters} = useContext(Context)
    const [masterVisible, setMasterVisible] = useState(false)
    const [editVisible, setEditVisible] = useState(false)
    const [idToEdit, setIdToEdit] = useState(null);
    const [nameToEdit, setNameToEdit] = useState(null)
    const [ratingToEdit, setRatingToEdit] = useState(null)
    const [cityToEdit, setCityToEdit] = useState(null);


    function getMasters() {
        fetchMaster(null, null, masters.page, 10).then(res => {
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

    useEffect(() => {
        getMasters()
    }, [masters.page])

//Удаление мастера
    const delMaster = (id) => {
        deleteMaster(id).then((res) => {
                masters.setMasters(masters.masters.filter(obj => obj.id !== id));
                alertMessage('Успешно удаленно', false)
                getMasters()
            }, (err) => {
                alertMessage('Не удалось удалить, так как у мастера есть еще заказы', true)
            }
        )


    }


    return (
        <Box>
            <Box sx={{flexGrow: 1, maxWidth: "1fr", height: 700}}>
                <Typography sx={{mt: 4, mb: 2}} variant="h6" component="div">
                    Мастера
                </Typography>
                <List disablePadding>

                    <ListItem
                        key={1}
                        divider
                        secondaryAction={
                            <Tooltip title={'Добавить мастера'}
                                     placement="top"
                                     arrow>
                                <IconButton sx={{width: 20}}
                                            edge="end"
                                            aria-label="Add"
                                            onClick={() => setMasterVisible(true)}>

                                    <AddIcon/>
                                </IconButton>
                            </Tooltip>
                        }
                    >
                        <ListItemText sx={{width: 10}}
                                      primary="№"/>
                        <ListItemText sx={{width: 10}}
                                      primary="Имя мастера"/>
                        <ListItemText sx={{width: 10}}
                                      primary="Рейтинг"/>
                        <ListItemText sx={{width: 10}}
                                      primary="Город"/>
                    </ListItem>

                    <Divider orientation="vertical"/>
                    {masters.IsEmpty ? <h1>Список пуст</h1> :
                        masters.masters.map((master, index) => {

                            return (<ListItem
                                    key={master.id}
                                    divider
                                    secondaryAction={
                                        <IconButton sx={{width: 10}}
                                                    edge="end"
                                                    aria-label="delete"
                                                    onClick={() => delMaster(master.id)}
                                        >
                                            <DeleteIcon/>
                                        </IconButton>}>
                                    <ListItemText sx={{width: 10}}
                                                  primary={index + 1}
                                    />
                                    <ListItemText sx={{width: 10}}
                                                  primary={master.name}/>
                                    <ListItemText sx={{width: 10}}
                                                  primary={master.rating}/>
                                    <ListItemText sx={{width: 10}}
                                                  primary={master.city.name}/>
                                    <IconButton sx={{width: 5}}
                                                edge="end"
                                                aria-label="Edit"
                                                onClick={() => {
                                                    setEditVisible(true)
                                                    setIdToEdit(master.id)
                                                    setNameToEdit(master.name)
                                                    setRatingToEdit(master.rating)
                                                    setCityToEdit(master.cityId)
                                                }}
                                    >
                                        <EditIcon/>
                                    </IconButton>
                                </ListItem>
                            )
                        })}
                </List>
                <EditMaster open={editVisible}
                            onClose={() => setEditVisible(false)}
                            idToEdit={idToEdit}
                            alertMessage={alertMessage}
                            nameToEdit={nameToEdit}
                            ratingToEdit={ratingToEdit}
                            cityChosen={cityToEdit}/>

                <CreateMaster open={masterVisible}
                              alertMessage={alertMessage}
                              onClose={() => setMasterVisible(false)}/>
            </Box>
            <Box sx={{position: "relative", left: "35%"}}>
                <Pages context={masters}/>
            </Box>
        </Box>
    );
})
export default MasterList;
