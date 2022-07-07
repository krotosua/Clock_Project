import * as React from 'react';
import {useEffect, useState} from 'react';
import {
    Box,
    Button,
    ButtonGroup,
    Checkbox,
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
    OutlinedInput,
    Rating,
    Select,
    Slider,
    Tooltip,
    Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import {activateMaster, deleteMaster, fetchMasters} from "../../http/masterAPI";
import CreateMaster from "./modals/CreateMaster";
import EditMaster from "./modals/EditMaster";
import TablsPagination from "../TablsPagination";
import ReviewsIcon from "@mui/icons-material/Reviews";
import ReviewModal from "../ReviewModal";
import {useSelector} from "react-redux";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import {fetchCities} from "../../http/cityAPI";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};
const marks = [
    {
        value: 0,
        label: '0',
    },
    {
        value: 1,
        label: '1',
    },
    {
        value: 2,
        label: '2',
    },
    {
        value: 3,
        label: '3',
    }, {
        value: 4,
        label: '4',
    }, {
        value: 5,
        label: '5',
    },
];
const valuetext = (value) => {
    return `${value}°C`;
}

const MasterList = ({alertMessage}) => {
    const cities = useSelector(state => state.cities)
    const [createVisible, setCreateVisible] = useState(false)
    const [editVisible, setEditVisible] = useState(false)
    const [idToEdit, setIdToEdit] = useState(null);
    const [nameToEdit, setNameToEdit] = useState(null)
    const [ratingToEdit, setRatingToEdit] = useState(null)
    const [cityToEdit, setCityToEdit] = useState(null);
    const [citiesList, setCitiesList] = useState([])
    const [openReview, setOpenReview] = useState(false)
    const [masterId, setMasterId] = useState(null)
    const [mastersList, setMastersList] = useState(null)
    const [page, setPage] = useState(1)
    const [totalCount, setTotalCount] = useState()
    const [limit, setLimit] = useState(10)
    const [ascending, setAscending] = useState(true)
    const [sorting, setSorting] = useState("name")
    const [loading, setLoading] = useState(true)
    const [openCityList, setOpenCityList] = useState(null)
    const [openFilters, setOpenFilters] = useState(false)
    const [filters, setFilters] = useState({})
    const [cityChacked, setCityChacked] = React.useState([]);
    const [rating, setRating] = React.useState([0, 5]);
    const citiesLimit = 2
    const getMasters = async (page, limit, sorting, ascending, filters) => {

        try {
            const res = await fetchMasters(null, page, limit, sorting, ascending, filters)
            if (res.status === 204) {
                setMastersList([])
                return
            }
            setMastersList(res.data.rows)
            setTotalCount(res.data.count)
        } catch (e) {
            setMastersList([])
        } finally {
            setLoading(false)
        }
    }
    useEffect(async () => {
        try {
            const res = await fetchCities(null, null)
            if (res.status === 204) {
                setCitiesList([])
                return
            }
            setCitiesList(res.data.rows)
        } catch (e) {
            setCitiesList([])
        }
    }, [])
    useEffect(async () => {
        await getMasters(page, limit, sorting, ascending, filters)
    }, [page, limit, sorting, ascending, filters])
    if (loading && !openFilters) {
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
    const changeActiveted = async (master) => {
        let changeInfo = {
            id: master.id,
            isActivated: !master.isActivated
        }
        try {
            await activateMaster(changeInfo)
            master.isActivated = !master.isActivated
            alertMessage('Данные мастера успешно изменены', false)
        } catch (e) {
            alertMessage('Не удалось изменить данные мастера', true)
        }
    }

    const removeMaster = async (id) => {
        try {
            await deleteMaster(id)
            alertMessage('Успешно удаленно', false)
            await getMasters(page, limit, sorting, ascending)
        } catch (e) {
            alertMessage('Не удалось удалить, так как у мастера есть еще заказы', true)
        }
    }

    const createCityList = (master, all) => {
        return master.cities
            .reduce((cityList, masterCity, index) => {
                if (index === 0) {
                    cityList += masterCity.name
                } else if (index < citiesLimit) {
                    cityList += `, ${masterCity.name}`
                } else if (all) {
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
    const sortingList = (param) => {
        if (sorting === param) {
            setAscending(!ascending)
            return
        }
        setAscending(true)
        setSorting(param)
    }

    const cityChange = (event) => {
        const {target: {value}} = event
        setCityChacked(
            typeof value === 'string' ? value.split(',') : value,
        );
    };
    const ratingChange = (event, newValue) => {
        setRating(newValue);
    };
    const createFilter = async () => {
        const filter = {
            cityId: cityChacked.map(city => city.id),
            rating: rating
        }
        setLoading(true)
        setFilters(filter)
    };

    return (<Box sx={{position: "relative"}}>
        <Box sx={{flexGrow: 1, maxWidth: "1fr", minHeight: "700px"}}>
            <Box sx={{display: "flex", justifyContent: "space-between"}}>
                <Typography sx={{mt: 4, mb: 2}} variant="h6" component="div">
                    Мастера
                </Typography>
                <FormControl variant="standard" sx={{m: 1, maxWidth: 60}} size="small">
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
            {openFilters && <Box sx={{display: "flex", justifyContent: "space-evenly"}}>
                <Typography>
                    Выберите фильтр:
                </Typography>
                <FormControl sx={{m: 1, width: 300}}>
                    <InputLabel size={"small"} id="demo-multiple-checkbox-label">Выберите город(а) работы
                        мастера</InputLabel>
                    <Select
                        size={"small"}
                        labelId="demo-multiple-checkbox-label"
                        id="demo-multiple-checkbox"
                        multiple
                        value={cityChacked}
                        onChange={cityChange}
                        input={<OutlinedInput label="Выберите город(а) работы мастера"/>}
                        renderValue={(selected) => selected.map(sels => sels.name).join(', ')}
                        MenuProps={MenuProps}
                    >
                        {citiesList.map((city, index) => (
                            <MenuItem key={index} value={city}>
                                <Checkbox checked={cityChacked.indexOf(city) > -1}/>
                                <ListItemText primary={city.name}/>
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Box sx={{width: 300, mt: -2}}>
                    <Typography id="rating-slider" gutterBottom>
                        Рейтинг
                    </Typography>
                    <Slider
                        sx={{width: 150}}
                        min={0}
                        max={5}
                        getAriaLabel={() => 'Temperature range'}
                        value={rating}
                        onChange={ratingChange}
                        valueLabelDisplay="auto"
                        marks={marks}
                        getAriaValueText={valuetext}
                    />
                </Box>
                <ButtonGroup
                    sx={{mt: -2}}
                    orientation="vertical"
                    aria-label="vertical contained button group"
                    variant="contained"
                >
                    <Button sx={{mb: 1}} color={"error"} key="one">Сбросить фильтр</Button>
                    <Button color={"success"} onClick={() => createFilter()} key="two">Подтвердить фильтр</Button>
                </ButtonGroup>

            </Box>
            } <Divider/>
            {<Button onClick={() => setOpenFilters(!openFilters)}
                     variant="text">{!openFilters ? "Добавить фильтрацию" : "Убрать фильтрацию"}</Button>}
            {loading ? <Box sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: window.innerHeight - 60,
                }}>
                    <CircularProgress/>
                </Box> :
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
                        </Tooltip>}>
                        <ListItemButton
                            selected={sorting === "id"}
                            sx={{ml: -2, maxWidth: 100}}
                            onClick={() => sortingList("id")}>
                            ID мастера
                            {ascending ? sorting === "id" && <ExpandMoreIcon/> : sorting === "id" && <ExpandLessIcon/>}
                        </ListItemButton>
                        <ListItemButton
                            selected={sorting === "userId"}
                            sx={{width: 120}}
                            onClick={() => sortingList("userId")}>
                            ID пользователя
                            {ascending ? sorting === "userId" && <ExpandMoreIcon/> : sorting === "userId" &&
                                <ExpandLessIcon/>}
                        </ListItemButton>
                        <ListItemButton
                            selected={sorting === "name"}
                            sx={{maxWidth: 100, mr: 5}}
                            onClick={() => sortingList("name")}>
                            Имя мастера
                            {ascending ? sorting === "name" && <ExpandMoreIcon/> : sorting === "name" &&
                                <ExpandLessIcon/>}
                        </ListItemButton>

                        <ListItemButton
                            selected={sorting === "rating"}
                            sx={{maxWidth: 100, mr: 2}}
                            onClick={() => sortingList("rating")}
                        >
                            Рейтинг
                            {ascending ? sorting === "rating" && <ExpandMoreIcon/> : sorting === "rating" &&
                                <ExpandLessIcon/>}
                        </ListItemButton>

                        <ListItemText sx={{minWidth: 100, ml: 6}}
                                      primary="Город(а)"
                        />
                        <ListItemText sx={{minWidth: 100, mr: -8}}
                                      primary="Комментарии"
                        />
                        <ListItemButton
                            selected={sorting === "isActivated"}
                            sx={{mr: 4, width: 100}}
                            onClick={() => sortingList("isActivated")}>
                            Статус
                            {ascending ? sorting === "isActivated" && <ExpandMoreIcon/> : sorting === "isActivated" &&
                                <ExpandLessIcon/>}
                        </ListItemButton>
                    </ListItem>

                    <Divider orientation="vertical"/>
                    {mastersList.length === 0 ? <h1>Список пуст</h1> :
                        mastersList.map((master) => {
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
                                                  primary={master.id}
                                    />
                                    <ListItemText sx={{width: 10}}
                                                  primary={master.user.id}/>

                                    <ListItemText sx={{width: 10,}}
                                                  primary={master.name}/>

                                    <ListItemText sx={{width: 10}}
                                                  primary={
                                                      <Rating name="read-only" size="small" value={master.rating}
                                                              precision={0.2} readOnly/>}/>
                                    <ListItemText sx={{
                                        width: 10,
                                        pl: openCityList === master ? 5 : 0,
                                        maxHeight: 150,
                                        overflowY: "auto",
                                        wordBreak: "break-word"
                                    }}
                                                  primary={
                                                      <Box>
                                                          {openCityList === master ?
                                                              <Box>
                                                                  {createCityList(master, true)}
                                                                  <Button
                                                                      onClick={() => setOpenCityList({})}>скрыть</Button>
                                                              </Box>
                                                              :
                                                              <Box>
                                                                  {createCityList(master)}
                                                                  {master.cities.length > citiesLimit ?
                                                                      <Button size="small"
                                                                              onClick={() => setOpenCityList(master)}>больше</Button> : null}</Box>
                                                          }
                                                      </Box>
                                                  }/>
                                    <ListItemText sx={{width: 10, textAlign: "center"}}
                                                  primary={
                                                      <IconButton sx={{width: 5}}
                                                                  aria-label="Reviews"
                                                                  onClick={() => getReviews(master.id)}
                                                      >
                                                          <ReviewsIcon/>
                                                      </IconButton>
                                                  }/>
                                    <ListItemText sx={{width: 10, mr: 5}}
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
                </List>}
            {editVisible ? <EditMaster open={editVisible}
                                       onClose={() => setEditVisible(false)}
                                       idToEdit={idToEdit}
                                       alertMessage={alertMessage}
                                       nameToEdit={nameToEdit}
                                       ratingToEdit={ratingToEdit}
                                       getMasters={() => getMasters(page, limit, sorting, ascending)}
                                       cityChosen={cityToEdit}/> : null}
            {openReview ? <ReviewModal open={openReview}
                                       masterId={masterId}
                                       onClose={() => setOpenReview(false)}/> : null}

            {createVisible ? <CreateMaster open={createVisible}
                                           getMasters={() => getMasters(page, limit, sorting, ascending)}
                                           alertMessage={alertMessage}
                                           onClose={() => setCreateVisible(false)}/> : null}
        </Box>
        <Box sx={{display: "flex", justifyContent: "center"}}>
            <TablsPagination page={page} totalCount={totalCount} limit={limit} pagesFunction={(page) => setPage(page)}/>
        </Box>
    </Box>);
}
export default MasterList;
