import * as React from 'react';
import {useEffect} from 'react';
import Cards from "../components/startPageComponents/cards"
import AboutCompany from "../components/startPageComponents/aboutCompany";
import {Box, Button} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import {ORDER_ROUTE} from "../utils/consts";
import {check} from "../http/userAPI";
import {setIsAuthUserAction, setUserAction, setUserNameAction, setUserRoleAction} from "../store/UserStore";
import {fetchCity} from "../http/cityAPI";
import {setCitiesAction, setEmptyCityAction, setTotalCountCitiesAction} from "../store/CityStore";
import {fetchSize} from "../http/sizeAPI";
import {setIsEmptySizeAction, setSizesAction, setTotalCountSizeAction} from "../store/SizeStore";
import {useDispatch} from "react-redux";

const Start = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    useEffect(async () => {
        if (localStorage.getItem('token') !== "" ||
            localStorage.getItem('token')) {
            try {
                const data = await check()
                dispatch(setUserAction(data))
                dispatch(setUserNameAction(data.name))
                dispatch(setIsAuthUserAction(true))
                dispatch(setUserRoleAction(data.role))
            } catch {
                localStorage.setItem('token', "")
            }
        }
        try {
            const cityRes = await fetchCity()
            if (cityRes.status === 204) {
                dispatch(setEmptyCityAction(true))
            } else {
                dispatch(setEmptyCityAction(false))
                dispatch(setCitiesAction(cityRes.data.rows))
                dispatch(setTotalCountCitiesAction(cityRes.data.count))
            }
            const sizeRes = await fetchSize()
            if (sizeRes.status === 204) {
                dispatch(setIsEmptySizeAction(true))
            }
            dispatch(setIsEmptySizeAction(false))
            dispatch(setSizesAction(sizeRes.data.rows))
            dispatch(setTotalCountSizeAction(sizeRes.data.count))


        } catch (e) {
            dispatch(setEmptyCityAction(true))
            dispatch(setIsEmptySizeAction(true))
        }
    }, [])
    return (

        <Box sx={{display: 'flex', flexDirection: 'column'}}>
            <AboutCompany/>
            <Cards/>
            <Box>
                <Link to={ORDER_ROUTE}
                      style={{textDecoration: 'none', color: 'white'}}>
                    <Button fullWidth sx={{mt: 5, mb: 2}} variant="outlined" color={"warning"}
                            onClick={() => navigate(ORDER_ROUTE)}>
                        Сделать заказ
                    </Button>
                </Link>
            </Box>

        </Box>

    );
};

export default Start