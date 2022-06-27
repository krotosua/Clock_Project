import {fetchAlLOrders, fetchCustomerOrders, fetchMasterOrders} from "../http/orderAPI";
import {setIsEmptyOrderAction, setOrdersAction, setTotalCountOrderAction} from "../store/OrderStore";

export const getOrders = (page) => {
    return async dispatch => {
        try {
            const res = await fetchAlLOrders(page, 8)
            if (res.status === 204) {
                dispatch(setIsEmptyOrderAction(true))
                return
            }
            dispatch(setIsEmptyOrderAction(false))
            dispatch(setOrdersAction(res.data.rows))
            dispatch(setTotalCountOrderAction(res.data.count))
        } catch (e) {
            dispatch(setIsEmptyOrderAction(true))
        }
    }
}
export const getCustomerOrders = (id, page) => {
    return async dispatch => {
        try {
            const res = await fetchCustomerOrders(id, page, 8)
            if (res.status === 204) {
                dispatch(setIsEmptyOrderAction(true))
                return
            }
            dispatch(setIsEmptyOrderAction(false))
            dispatch(setOrdersAction(res.data.rows))
            dispatch(setTotalCountOrderAction(res.data.count))
        } catch (e) {
            dispatch(setIsEmptyOrderAction(true))
        }
    }
}
export const getMasterOrders = (id, page) => {
    return async dispatch => {
        try {
            const res = await fetchMasterOrders(id, page, 8)
            if (res.status === 204) {
                dispatch(setIsEmptyOrderAction(true))
                return
            }
            dispatch(setIsEmptyOrderAction(false))
            dispatch(setOrdersAction(res.data.rows))
            dispatch(setTotalCountOrderAction(res.data.count))
        } catch (e) {
            dispatch(setIsEmptyOrderAction(true))
        }
    }
}
