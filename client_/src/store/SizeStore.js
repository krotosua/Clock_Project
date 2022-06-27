const defaultState = {
    sizes: [],
    isEmpty: false,
    selectedSize: {date: "00:00:00"},
    page: 1,
    totalCount: 0,
    limit: 10

}
const SET_SIZES = "SET_SIZES"
const SET_SELECTED_SIZE = "SET_SELECTED_SIZE"
const SET_IS_EMPTY = "SET_IS_EMPTY"
const SET_PAGE = "SET_PAGE"
const SET_TOTAL_COUNT = "SET_TOTAL_COUNT"
const REMOVE_SIZE = "REMOVE_SIZE"
const CHANGE_SIZE = "CHANGE_SIZE"
const RESET = "RESET"


export const sizeReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_SIZES:
            return {...state, sizes: action.payload}
        case SET_SELECTED_SIZE: {
            return {...state, selectedSize: action.payload}
        }
        case SET_IS_EMPTY: {
            return {...state, isEmpty: action.payload}
        }
        case SET_PAGE: {
            return {...state, page: action.payload}
        }
        case SET_TOTAL_COUNT: {
            return {...state, totalCount: action.payload}
        }
        case REMOVE_SIZE:
            return {...state, sizes: state.sizes.filter(size => size.id !== action.payload)}

        case CHANGE_SIZE:
            return {
                ...state,
                sizes: state.sizes.map(size => size.id === action.payload.id ? size = action.payload : size)
            }
            
        default:
            return state
    }
}
export const setSizesAction = (payload) => ({type: SET_SIZES, payload})
export const setIsEmptySizeAction = (payload) => ({type: SET_IS_EMPTY, payload})
export const setSelectedSizeAction = (payload) => ({type: SET_SELECTED_SIZE, payload})
export const setPageSizeAction = (payload) => ({type: SET_PAGE, payload})
export const setTotalCountSizeAction = (payload) => ({type: SET_TOTAL_COUNT, payload})
export const removeSizeAction = (payload) => ({type: REMOVE_SIZE, payload})
export const changeSizeAction = (payload) => ({type: CHANGE_SIZE, payload})
