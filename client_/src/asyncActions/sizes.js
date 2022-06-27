import {fetchSize} from "../http/sizeAPI";
import {setIsEmptySizeAction, setSizesAction, setTotalCountSizeAction} from "../store/SizeStore";

export const getSizes = (page) => {
    return async dispatch => {
        try {
            const res = await fetchSize(page, 10)
            if (res.status === 204) {
                return dispatch(setIsEmptySizeAction(true))
            }
            dispatch(setIsEmptySizeAction(false))
            dispatch(setSizesAction(res.data.rows))
            dispatch(setTotalCountSizeAction(res.data.count))
        } catch (e) {
            dispatch(setIsEmptySizeAction(true))
        }
    }
}