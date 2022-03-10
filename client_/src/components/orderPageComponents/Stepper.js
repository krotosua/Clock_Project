import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {START_ROUTE} from "../../utils/consts";
import {useNavigate} from "react-router-dom";
import {FormControlLabel, Radio, RadioGroup, TextField, Tooltip} from "@mui/material";
import SelectorSize from "./SelectorSize";
import SelectorCity from "../SelectorCity";
import {useContext, useState} from "react";
import {Context} from "../../index";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DateTimePicker from "@mui/lab/DateTimePicker";
import {observer} from "mobx-react-lite";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import {fetchMaster} from "../../http/masterAPI";
import IconButton from "@mui/material/IconButton";
import * as PropTypes from "prop-types";
import {createOrder} from "../../http/orderAPI";

const steps = ["Заолните форму заказа", "Выбор мастера", "Отправка заказа"];


function MyFormControlLabel(props) {
    return null;
}

MyFormControlLabel.propTypes = {
    label: PropTypes.string,
    control: PropTypes.element,
    value: PropTypes.string
};
const HorizontalLinearStepper = observer(() => {
    const [activeStep, setActiveStep] = useState(0);
    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);

    const {cities, size, masters} = useContext(Context);
    const [time, setTime] = useState(new Date().setHours(9, 0, 0));
    console.log(time)
    const [chosenMaster, setMaster] = useState(null);
    const navigate = useNavigate();
    const handleNext = () => {
        if (activeStep === 0) {
            if (name.length < 3 || !time && !email || !cities.selectedCity || !size.selectedSize) {
                return
            }
            let startOrder = time
            let endHour = Number(time.getHours()) + Number(size.selectedSize.date.slice(0, 2))
            let endOfOrder = new Date(new Date(time).setHours(endHour, 0, 0))
            fetchMaster(cities.selectedCity, endOfOrder, startOrder).then(
                (res) => {
                    if (res.status === 204) {
                        return masters.setIsEmpty(true);
                    }
                    masters.setIsEmpty(false)
                    return masters.setMasters(res.data.rows);
                },
                (err) => {
                    masters.setIsEmpty(true);
                    return;
                }
            );
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        } else if (activeStep === 1 && chosenMaster) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        } else {
            let order = {
                name: name,
                date: time,
                email: email,
                cityId: cities.selectedCity,
                masterId: chosenMaster,
                sizeClockId: size.selectedSize.id
            }
            createOrder(order).then(res => console.log('success'))
        }
    };

    const handleBack = () => {
        setTime(new Date().setHours(9, 0, 0))
        cities.setSelectedCity(null)
        size.setSelectedSize(null)
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
    

    const pageOne = (
        <Box component="form">
            <TextField
                required
                id="Name"
                label="Ваше имя"
                variant="outlined"
                value={name}
                fullWidth
                onChange={(e) => setName(e.target.value)}
            />
            <TextField
                required
                sx={{mt: 2}}
                id="Email"
                label="Ващ Email"
                type="email"
                variant="outlined"
                value={email}
                fullWidth
                onChange={(e) => setEmail(e.target.value)}
            />
            <Box
                sx={{display: "grid", gridTemplateColumns: "repeat(2, 1fr)", my: 2}}
            >
                <SelectorSize/>
                <SelectorCity/>
            </Box>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                    renderInput={(props) => <TextField {...props} />}
                    label="Время заказа"
                    ampm={false}
                    value={time}
                    views={["day", "hours"]}
                    onChange={(newValue) => {
                        setTime(newValue)
                    }}
                    minDate={new Date()}
                    minTime={new Date(0, 0, 0, 8)}
                    maxTime={new Date(0, 0, 0, 22)}
                />
            </LocalizationProvider>
        </Box>
    );


    const choseMaster = (event) => {
        setMaster(event.target.value);
    };
    const nextPage = (
        <Box sx={{flexGrow: 1, maxWidth: "1fr"}}>
            <Typography sx={{mt: 4, mb: 2}} variant="h6" component="div">
                Свободные мастера
            </Typography>
            <List disablePadding>
                <ListItem key={1} divider
                          secondaryAction={

                              <IconButton sx={{width: 20}}>
                              </IconButton>
                          }>

                    <ListItemText sx={{width: 10}} primary="№"/>
                    <ListItemText sx={{width: 10}} primary="Имя мастера"/>
                    <ListItemText sx={{width: 10}} primary="Рейтинг"/>
                    <ListItemText sx={{width: 10}} primary="Город"/>
                </ListItem>

                <Divider orientation="vertical"/>
                <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={chosenMaster}
                    onChange={choseMaster}
                >
                    {masters.IsEmpty ? (
                        <h1>Список пуст</h1>
                    ) : (
                        masters.masters.map((master, index) => {
                            return (
                                <ListItem key={master.id}
                                          divider
                                          secondaryAction={
                                              <Tooltip title={'Выбрать мастера'}
                                                       placement="right"
                                                       arrow>
                                                  <FormControlLabel value={master.id} control={<Radio/>} label=""/>
                                              </Tooltip>
                                          }
                                >

                                    <ListItemText sx={{width: 10}} primary={index + 1}/>
                                    <ListItemText sx={{width: 10}} primary={master.name}/>
                                    <ListItemText sx={{width: 10}} primary={master.rating}/>
                                    <ListItemText sx={{width: 10}} primary={master.city.name}/>
                                </ListItem>
                            );
                        })
                    )}
                </RadioGroup>
            </List>
        </Box>
    );


    return (
        <Box sx={{width: "100%"}}>
            <Stepper activeStep={activeStep}>
                {steps.map((label) => {
                    const stepProps = {};
                    const labelProps = {};
                    return (
                        <Step key={label} {...stepProps}>
                            <StepLabel {...labelProps}>{label}</StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
            {activeStep === steps.length - 1 ? (
                <React.Fragment>
                    <Typography sx={{mt: 2, mb: 1}}>Форму успешно заполнено</Typography>
                    <Box sx={{display: "flex", flexDirection: "row", pt: 2}}>
                        <Button
                            color="inherit"
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            sx={{mr: 1}}
                        >
                            Назад
                        </Button>
                        <Box sx={{flex: "1 1 auto"}}/>
                        <Button onClick={handleNext}>
                            Отправить заказ
                        </Button>
                    </Box>
                </React.Fragment>
            ) : activeStep === 0 ? (
                <React.Fragment>
                    <Typography sx={{mt: 2, mb: 1}}>{pageOne}</Typography>
                    <Box sx={{display: "flex", flexDirection: "row", pt: 2}}>
                        <Button
                            color="inherit"
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            sx={{mr: 1}}
                        >
                            Назад
                        </Button>
                        <Box sx={{flex: "1 1 auto"}}/>

                        <Button onClick={handleNext}>
                            {activeStep === steps.length - 1 ? "Отправить заказ" : "Дальше"}
                        </Button>
                    </Box>
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <Typography sx={{mt: 2, mb: 1}}>{nextPage}</Typography>
                    <Box sx={{display: "flex", flexDirection: "row", pt: 2}}>
                        <Button
                            color="inherit"
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            sx={{mr: 1}}
                        >
                            Назад
                        </Button>
                        <Box sx={{flex: "1 1 auto"}}/>

                        <Button onClick={handleNext}>
                            {activeStep === steps.length - 1 ? "0" : "Дальше"}
                        </Button>
                    </Box>
                </React.Fragment>
            )}
        </Box>
    );
});
export default HorizontalLinearStepper;
