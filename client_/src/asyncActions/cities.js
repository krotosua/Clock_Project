import {fetchCity} from "../http/cityAPI";
import {setCitiesAction, setEmptyCityAction, setTotalCountCitiesAction} from "../store/CityStore";

export const getCities = (page) => {
    return async dispatch => {
        try {
            const res = await fetchCity(page, 10)
            if (res.status === 204) {
                dispatch(setEmptyCityAction(true))
                return
            }
            dispatch(setEmptyCityAction(false))
            dispatch(setTotalCountCitiesAction(res.data.count))
            dispatch(setCitiesAction(res.data.rows))
        } catch (e) {
            dispatch(setEmptyCityAction(true))
        }
    }
}