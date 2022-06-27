import * as React from 'react';
import {useEffect, useState} from 'react';
import {
    Box,
    Button,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Rating,
    Tooltip,
    Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import {activateMaster, deleteMaster} from "../../http/masterAPI";
import CreateMaster from "./modals/CreateMaster";
import EditMaster from "./modals/EditMaster";
import Pages from "../Pages";
import ReviewsIcon from "@mui/icons-material/Reviews";
import ReviewModal from "../ReviewModal";
import {useDispatch, useSelector} from "react-redux";
import {activationMasterAction, removeMasterAction, setPageMasterAction} from "../../store/MasterStore";
import {getMasters} from '../../asyncActions/masters'


const MasterList = ({alertMessage}) => {
    const dispatch = useDispatch()
    const cities = useSelector(state => state.city)
    const masters = useSelector(state => state.masters)
    const [createVisible, setCreateVisible] = useState(false)
    const [editVisible, setEditVisible] = useState(false)
    const [idToEdit, setIdToEdit] = useState(null);
    const [nameToEdit, setNameToEdit] = useState(null)
    const [ratingToEdit, setRatingToEdit] = useState(null)
    const [cityToEdit, setCityToEdit] = useState([]);
    const [openReview, setOpenReview] = useState(false)
    const [masterId, setMasterId] = useState(null)
    useEffect(() => {
        dispatch(getMasters(masters.page))
    }, [masters.page])


    const changeActiveted = async (master) => {
        let changeInfo = {
            id: master.id,
            isActivated: !master.isActivated
        }
        try {
            await activateMaster(changeInfo)
            dispatch(activationMasterAction(changeInfo))
            alertMessage('Данные мастера успешно изменены', false)
        } catch (e) {
            alertMessage('Не удалось изменить данные мастера', true)
        }
    }


    const removeMaster = async (id) => {
        try {
            await deleteMaster(id)
            dispatch(removeMasterAction(id))
            alertMessage('Успешно удаленно', false)
            await getMasters()
        } catch (e) {
            alertMessage('Не удалось удалить, так как у мастера есть еще заказы', true)
        }
    }

    const createCityList = (master) => {
        return master.cities
            .reduce((cityList, masterCity, index) => {
                if (index === 0) {
                    cityList += masterCity.name
                } else {
                    cityList += `, ${masterCity.name}`
                }
                return cityList
            }, '')
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
    const getReviews = (id) => {
        setMasterId(id)
        setOpenReview(true)
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
                    <ListItemText sx={{width: 10, textAlign: "center"}}
                                  primary="Имя мастера"/>
                    <ListItemText sx={{width: 10, textAlign: "center"}}
                                  primary="Рейтинг"/>
                    <ListItemText sx={{width: 10, textAlign: "center"}}
                                  primary="Город"/>
                    <ListItemText sx={{width: 10}}
                                  primary="Комментарии"/>
                    <ListItemText sx={{width: 10}}
                                  primary="Статус"/>
                </ListItem>

                <Divider orientation="vertical"/>
                {masters.isEmpty ? <h1>Список пуст</h1> :
                    masters.masters.map((master, index) => {
                        return (
                            <ListItem
                                key={master.id}
                                divider
                                secondaryAction={
                                    <IconButton sx={{width: 10}}
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

                                <ListItemText sx={{width: 10, textAlign: "center"}}
                                              primary={master.name}/>

                                <ListItemText sx={{width: 10}}
                                              primary={
                                                  <Rating name="read-only" size="small" value={master.rating}
                                                          precision={0.2} readOnly/>}/>
                                <ListItemText sx={{width: 10, textAlign: "center"}}
                                              primary={createCityList(master)}/>
                                <ListItemText sx={{width: 10, textAlign: "center"}}
                                              primary={
                                                  <IconButton sx={{width: 5}}
                                                              aria-label="Reviews"
                                                              onClick={() => getReviews(master.id)}
                                                  >
                                                      <ReviewsIcon/>
                                                  </IconButton>
                                              }/>
                                <ListItemText sx={{width: 10}}
                                              primary={
                                                  <Button color={master.isActivated ? "success" : "error"}
                                                          size="small"
                                                          variant="outlined"
                                                          onClick={() => changeActiveted(master)}>
                                                      {master.isActivated ? "Активный" : "Не активный"}
                                                  </Button>
                                              }
                                />
                                <IconButton sx={{width: 5}}
                                            edge="end"
                                            aria-label="Edit"
                                            onClick={() => forEdit(master)}
                                >
                                    <EditIcon/>
                                </IconButton>


                            </ListItem>
                        )
                    })}
            </List>
            {editVisible ? <EditMaster open={editVisible}
                                       onClose={() => setEditVisible(false)}
                                       idToEdit={idToEdit}
                                       alertMessage={alertMessage}
                                       nameToEdit={nameToEdit}
                                       ratingToEdit={ratingToEdit}
                                       getMasters={() => dispatch(getMasters(masters.page))}
                                       cityChosen={cityToEdit}/> : null}
            {openReview ? <ReviewModal open={openReview}
                                       masterId={masterId}
                                       onClose={() => setOpenReview(false)}/> : null}

            <CreateMaster open={createVisible}
                          getMasters={() => dispatch(getMasters(masters.page))}
                          alertMessage={alertMessage}
                          onClose={() => setCreateVisible(false)}/>
        </Box>
        <Box sx={{display: "flex", justifyContent: "center"}}>
            <Pages store={masters} pagesFunction={setPageMasterAction}/>
        </Box>
    </Box>);
}
export default MasterList;
