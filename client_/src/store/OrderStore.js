export const STATUS_LIST = {
    WAITING: "WAITING",
    REJECTED: "REJECTED",
    ACCEPTED: "ACCEPTED",
    DONE: "DONE",
}

const defaultState = {
    orders: [],
    isEmpty: false,
    page: 1,
    totalCount: 0,
    limit: 10
}
const SET_ORDERS = "SET_ORDERS"
const SET_IS_EMPTY = "SET_IS_EMPTY"
const SET_PAGE = "SET_PAGE"
const SET_TOTAL_COUNT = "SET_TOTAL_COUNT"
const REMOVE_ORDER = "REMOVE_CITY"
const CHANGE_STATUS = "CHANGE_STATUS"
const RESET = "RESET"

export const orderReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_ORDERS:
            return {...state, orders: action.payload}

        case SET_IS_EMPTY:
            return {...state, isEmpty: action.payload}

        case SET_PAGE:
            return {...state, page: action.payload}

        case SET_TOTAL_COUNT:
            return {...state, totalCount: action.payload}

        case REMOVE_ORDER:
            return {...state, orders: state.orders.filter(city => city.id !== action.payload)}

        case CHANGE_STATUS:
            return {
                ...state,
                orders: state.orders.map(order =>
                    order.id === action.payload.id ? {...order, status: action.payload.status} : order)
            }

        default:
            return state
    }
}

export const setOrdersAction = (payload) => ({type: SET_ORDERS, payload})
export const setIsEmptyOrderAction = (payload) => ({type: SET_IS_EMPTY, payload})
export const setPageOrderAction = (payload) => ({type: SET_PAGE, payload})
export const setTotalCountOrderAction = (payload) => ({type: SET_TOTAL_COUNT, payload})
export const removeOrderAction = (payload) => ({type: REMOVE_ORDER, payload})
export const changeStatusOrderAction = (payload) => ({type: CHANGE_STATUS, payload})
