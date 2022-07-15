import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    CircularProgress,
    Divider,
    FormControlLabel,
    List,
    ListItem,
    ListItemText,
    Modal,
    Radio,
    RadioGroup,
    Rating,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";
import SelectorSize from "../../orderPageComponents/SelectorSize";
import SelectorCity from "../../SelectorCity";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import ruLocale from "date-fns/locale/ru";
import {DatePicker, TimePicker} from "@mui/lab";
import {fetchMastersForOrder} from "../../../http/masterAPI";
import {addHours, getHours, isToday, set} from "date-fns";
import TablsPagination from "../../TablsPagination";
import {Controller, FormProvider, useForm} from "react-hook-form";
import {updateOrder} from "../../../http/orderAPI";


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};
const EditOrder = ({
                       open, onClose, alertMessage,
                       idToEdit,
                       dateToEdit,
                       timeToEdit,
                       orderToEdit,
                       getOrders
                   }) => {
    const [chosenMaster, setChosenMaster] = useState(orderToEdit.masterId);
    const [chosenSize, setChosenSize] = useState({id: null});
    const [chosenCity, setChosenCity] = useState({id: null});
    const [loading, setLoading] = useState(false)
    const [mastersList, setMastersList] = useState([])
    const [totalCount, setTotalCount] = useState(0)
    const [limit, setLimit] = useState(3)
    const [page, setPage] = useState(1)
    const {
        register,
        handleSubmit,
        trigger,
        setValue,
        watch,
        control,
        clearErrors,
        getValues, setError,
        formState: {errors, dirtyFields, isValid}
    } = useForm({
        defaultValues: {
            openTime: false,
            openDate: false,
            openList: true,
            email: orderToEdit.user.email ?? "",
            time: new Date(new Date().setUTCHours(new Date(orderToEdit.time).getUTCHours(), 0, 0)),
            date: new Date(orderToEdit.time),
            name: orderToEdit.name,
            city: orderToEdit.cityId,
            size: orderToEdit.sizeClockId
        }
    });
    const openList = watch("openList", false)
    const getMasters = async () => {
        setLoading(true)
        try {
            const res = await fetchMastersForOrder(chosenCity.id ?? orderToEdit.cityId, set(new Date(getValues("date")), {
                hours: getHours(getValues("time")),
                minutes: 0,
                seconds: 0
            }),
                chosenSize.id ?? orderToEdit.sizeClockId, page, limit)
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
        if (openList) {
            await getMasters()
        } else (setChosenMaster(null))
    }, [page, limit, openList])
    const changeOrder = async (formInfo) => {
        const {city, date, email, name, size, time} = formInfo

        const changeInfo = {
            id: idToEdit,
            name: name.trim(),
            email: email.trim(),
            time: set(new Date(date), {hours: getHours(time), minutes: 0, seconds: 0}),
            cityId: city,
            masterId: chosenMaster,
            sizeClockId: Number(size),
            changedMaster: (dirtyFields.data || dirtyFields.time || dirtyFields.city || dirtyFields.size) ?? false,
            price: chosenSize.date.slice(0, 2) * chosenCity.price
        }
        try {
            await updateOrder(changeInfo)
            close()
            alertMessage('Заказ успешно изменен', false)
            await getOrders()
        } catch (e) {
            setError(true)
            alertMessage('Не удалось изменить заказ.Мастер занят', true)
        }
    }
    const choseMaster = (event, master) => {
        event ? setChosenMaster(event.target.value) : setChosenMaster(master);
    };
    const close = () => {
        setError(false)
        onClose()
    }
    return (
        <div>
            <Modal
                open={open}
                onClose={close}
            >
                <Box sx={style}>
                    <FormProvider register={register} control={control} errors={errors} trigger={trigger}
                                  setValue={setValue}>
                        <form onSubmit={handleSubmit(changeOrder)}>
                            <Box sx={{display: "flex", flexDirection: "column", mt: 2}}>
                                <h3 style={{textAlign: "center"}}>Изменение заказа</h3>
                                <TextField
                                    {...register("name", {
                                        required: "Введите имя заказчика",
                                        minLength: {
                                            value: 3,
                                            message: "Введите имя длинее 3-ех символов"
                                        }
                                    })}
                                    error={Boolean(errors.name)}
                                    helperText={errors.name?.message}
                                    sx={{my: 1}}
                                    id="name"
                                    label={`Укажите имя`}
                                    variant="outlined"
                                    required
                                    onBlur={() => trigger("name")}
                                />
                                <Controller
                                    name={"email"}
                                    rules={{
                                        required: "Введите email",
                                        shouldFocusError: false,
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Введите email формата: clock@clock.com"
                                        }
                                    }}
                                    render={({field: {onChange, value, onBlur}, fieldState: {error}}) => {
                                        return (
                                            <TextField
                                                error={!!error}

                                                id="Email"
                                                label="Email"
                                                variant="outlined"
                                                helperText={error?.message}
                                                onChange={onChange}
                                                value={value}
                                                type={"email"}
                                                onBlur={() => trigger("email")}
                                            />
                                        );
                                    }}
                                    control={control}
                                />
                                <Box
                                    sx={{display: "grid", gridTemplateColumns: "repeat(2, 1fr)", my: 2}}
                                >
                                    <SelectorSize chosenSize={chosenSize}
                                                  sizeToEdit={orderToEdit.sizeClockId}
                                                  editOpen={open}
                                                  setChosenSize={(size) => setChosenSize(size)}/>
                                    <SelectorCity chosenCity={chosenCity ?? orderToEdit.cityId}
                                                  cityToEdit={orderToEdit.cityId}
                                                  editOpen={open}
                                                  setChosenCity={(city) => setChosenCity(city)}/>
                                </Box>
                                <Box>
                                    <Controller
                                        name="date"
                                        control={control}
                                        render={({field: {onChange, value}, fieldState: {error}}) => (
                                            <LocalizationProvider sx={{cursor: "pointer"}} dateAdapter={AdapterDateFns}
                                                                  locale={ruLocale}>
                                                <DatePicker
                                                    mask='__.__.____'
                                                    label="Выберите день заказа"
                                                    disableHighlightToday
                                                    value={value}
                                                    open={watch("openDate", false)}
                                                    onChange={(newDate) => {
                                                        onChange(newDate);
                                                        setValue("openDate", false)
                                                        setValue("openList", false)
                                                    }}
                                                    onError={(e) =>
                                                        setError("date", {
                                                            type: "manual",
                                                            message: "Неверная дата"
                                                        })}
                                                    minDate={new Date()}
                                                    renderInput={(params) =>
                                                        <TextField
                                                            onClick={() => setValue("openDate", true)}
                                                            helperText={errors.date?.message}
                                                            sx={{
                                                                mr: 2,
                                                                '& .MuiInputBase-input': {
                                                                    cursor: "pointer",
                                                                }
                                                            }}
                                                            {...params} />}
                                                />
                                            </LocalizationProvider>)}
                                        rules={{required: 'Укажите время'}}
                                    />
                                    <Controller
                                        name="time"
                                        control={control}
                                        render={({field: {onChange, value}, fieldState: {error}}) => (
                                            <LocalizationProvider dateAdapter={AdapterDateFns} locale={ruLocale}>
                                                <TimePicker
                                                    readOnly
                                                    label="Выберите время"
                                                    value={value}
                                                    open={watch("openTime", false)}
                                                    onChange={(newValue) => {
                                                        onChange(newValue)
                                                        setValue("openTime", false)
                                                        setValue("openList", false)
                                                    }}
                                                    onError={() =>
                                                        setError("time", {
                                                            type: "manual",
                                                            message: "Неверное время"
                                                        })}
                                                    onBlur={() => trigger("time")}
                                                    ampm={false}
                                                    views={["hours"]}
                                                    minTime={isToday(getValues("date")) ?
                                                        addHours(set(new Date(), {minutes: 0, seconds: 0}), 1) :
                                                        new Date(0, 0, 0, 8)}
                                                    maxTime={new Date(0, 0, 0, 22)}
                                                    renderInput={(params) =>
                                                        <TextField helperText="Заказы принимаются с 8:00 до 22:00"
                                                                   sx={{
                                                                       '& .MuiInputBase-input': {
                                                                           cursor: "pointer"
                                                                       }
                                                                   }}
                                                                   onClick={() => {
                                                                       setValue("openTime", true)
                                                                   }}
                                                                   {...params} />}
                                                />
                                            </LocalizationProvider>)}
                                        rules={{
                                            required: 'Укажите время'
                                        }}
                                    />

                                </Box>
                                {!(dirtyFields.data || dirtyFields.time || dirtyFields.city || dirtyFields.size) &&
                                    <Box>
                                        Текущий мастер:
                                        <ListItem key={orderToEdit.master.id}
                                                  divider
                                                  style={{cursor: 'pointer'}}
                                                  selected={chosenMaster === orderToEdit.master.id}
                                                  onClick={() => choseMaster(null, orderToEdit.master.id)}
                                        >
                                            <ListItemText sx={{width: 10}}
                                                          primary={1}/>
                                            <ListItemText sx={{width: 10}}
                                                          primary={orderToEdit.master.name}/>
                                            <ListItemText sx={{width: 10}}
                                                          primary={<Rating
                                                              value={orderToEdit.master.rating}
                                                              readOnly/>}/>

                                        </ListItem>

                                    </Box>}
                                {loading ?
                                    <Box sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        mt: 2
                                    }}>
                                        <CircularProgress/>
                                    </Box>
                                    : openList && mastersList.length === 0 ? (
                                        <Typography variant="h5" sx={{my: 2, textAlign: "center"}}>
                                            В текущее время все мастера заняты
                                        </Typography>) : (
                                        <Box sx={{flexGrow: 1, maxWidth: "1fr", position: "relative"}}>
                                            <Typography sx={{my: 2,}}>
                                                Свободные мастера
                                            </Typography>
                                            <List disablePadding>
                                                <ListItem key={1} divider>
                                                    <ListItemText sx={{width: 10}} primary="№"/>
                                                    <ListItemText sx={{width: 10}} primary="Имя мастера"/>
                                                    <ListItemText sx={{width: 10,}} primary="Рейтинг"/>
                                                    <ListItemText sx={{width: 10, pr: 5}} primary="Город"/>
                                                </ListItem>

                                                <Divider orientation="vertical"/>
                                                <RadioGroup
                                                    aria-labelledby="demo-controlled-radio-buttons-group"
                                                    name="controlled-radio-buttons-group"

                                                    value={chosenMaster}
                                                    onChange={choseMaster}
                                                >
                                                    {(openList ? mastersList.map((master, index) => {
                                                            return (
                                                                <ListItem key={master.id}
                                                                          divider
                                                                          style={{cursor: 'pointer'}}
                                                                          selected={chosenMaster === master.id}
                                                                          onClick={() => choseMaster(null, master.id)}
                                                                          secondaryAction={
                                                                              <Tooltip title={'Выбрать мастера'}
                                                                                       placement="right"
                                                                                       arrow>
                                                                                  <FormControlLabel
                                                                                      value={master.id}
                                                                                      control={<Radio/>}
                                                                                      label=""/>
                                                                              </Tooltip>
                                                                          }>
                                                                    <ListItemText sx={{width: 10}}
                                                                                  primary={index + 1}/>
                                                                    <ListItemText sx={{width: 10}}
                                                                                  primary={master.name}/>
                                                                    <ListItemText sx={{width: 10}}
                                                                                  primary={<Rating
                                                                                      value={master.rating}
                                                                                      readOnly/>}/>
                                                                    <ListItemText sx={{width: 10}}
                                                                                  primary={master.cities[0].name}/>
                                                                </ListItem>
                                                            );
                                                        }) : <Button color="primary" sx={{flexGrow: 1,}}
                                                                     variant="outlined"
                                                                     disabled={!isValid && Object.keys(errors).length !== 0}
                                                                     onClick={() => setValue("openList", true)}>
                                                            Проверить свобоных мастеров в текущее время
                                                        </Button>

                                                    )}

                                                </RadioGroup>
                                                {openList &&
                                                    <Box sx={{display: "flex", justifyContent: "center"}}>
                                                        <TablsPagination page={page} totalCount={totalCount}
                                                                         limit={limit}
                                                                         pagesFunction={(page) => setPage(page)}/>
                                                    </Box>}

                                            </List>
                                            {loading ? <CircularProgress size={30}
                                                                         sx={{
                                                                             position: "absolute",
                                                                             right: 10,
                                                                             bottom: 30
                                                                         }}/> : ""}
                                        </Box>)}

                                <Box
                                    sx={{mt: 2, display: "flex", justifyContent: "space-between"}}
                                >
                                    <Button color="success" sx={{flexGrow: 1,}} variant="outlined"
                                            disabled={!isValid && Object.keys(errors).length !== 0 || !chosenMaster}
                                            type="submit"> Изменить</Button>
                                    <Button color="error" sx={{flexGrow: 1, ml: 2}} variant="outlined"
                                            onClick={close}> Закрыть</Button>
                                </Box>
                            </Box>
                        </form>
                    </FormProvider>
                </Box>
            </Modal>
        </div>
    );
}

export default EditOrder;
