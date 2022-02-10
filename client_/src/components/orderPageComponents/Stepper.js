import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import PageOneStepp from "./PageOneStepp";
import PageTwoStepp from "./PageTwoStepp";
import {ORDER_ROUTE, START_ROUTE} from "../../utils/consts";
import {useNavigate} from "react-router-dom";

const steps = ['Заолните форму заказа', 'Выбор мастера', 'Отправка заказа'];

export default function HorizontalLinearStepper() {
    const [activeStep, setActiveStep] = React.useState(0);
    const [skipped, setSkipped] = React.useState(new Set());

    const handleNext = () => {
        let newSkipped = skipped;
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };
    const navigate = useNavigate()

    return (
        <Box sx={{width: '100%'}}>
            <Stepper activeStep={activeStep}>
                {steps.map((label, index) => {
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
                    <Typography sx={{mt: 2, mb: 1}}>
                        Форму успешно заполнено
                    </Typography>
                    <Box sx={{display: 'flex', flexDirection: 'row', pt: 2}}>
                        <Button
                            color="inherit"
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            sx={{mr: 1}}
                        >
                            Назад
                        </Button>
                        <Box sx={{flex: '1 1 auto'}}/>
                        <Button onClick={() => navigate(START_ROUTE)}>Отправить заказ</Button>
                    </Box>
                </React.Fragment>
            ) : activeStep == 0 ? (
                <React.Fragment>
                    <Typography sx={{mt: 2, mb: 1}}><PageOneStepp/></Typography>
                    <Box sx={{display: 'flex', flexDirection: 'row', pt: 2}}>
                        <Button
                            color="inherit"
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            sx={{mr: 1}}
                        >
                            Назад
                        </Button>
                        <Box sx={{flex: '1 1 auto'}}/>


                        <Button onClick={handleNext}>
                            {activeStep === steps.length - 1 ? 'Отправить заказ' : 'Дальше'}
                        </Button>
                    </Box>
                </React.Fragment>
            ) : (<React.Fragment>
                <Typography sx={{mt: 2, mb: 1}}><PageTwoStepp/></Typography>
                <Box sx={{display: 'flex', flexDirection: 'row', pt: 2}}>
                    <Button
                        color="inherit"
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        sx={{mr: 1}}
                    >
                        Назад
                    </Button>
                    <Box sx={{flex: '1 1 auto'}}/>


                    <Button onClick={handleNext}>
                        {activeStep === steps.length - 1 ? '0' : 'Дальше'}
                    </Button>
                </Box>
            </React.Fragment>)}
        </Box>
    );
}
