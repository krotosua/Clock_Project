import {fetchMasters} from "../http/masterAPI";
import {setIsEmptyMasterAction, setMasterAction, setTotalCountMasterAction} from "../store/MasterStore";


export const getMasters = (page) => {
    return async dispatch => {
        try {
            const res = await fetchMasters(null, page, 10)
            if (res.status === 204) {
                return dispatch(setIsEmptyMasterAction(true))
            }
            dispatch(setMasterAction(res.data.rows))
            dispatch(setTotalCountMasterAction(res.data.count))
            dispatch(setIsEmptyMasterAction(false))
        } catch (e) {
            return dispatch(setIsEmptyMasterAction(true))
        }
    }
}

