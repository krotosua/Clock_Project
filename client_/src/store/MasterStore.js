const defaultState = {
    masters: [],
    isEmpty: false,
    page: 1,
    totalCount: 0,
    limit: 10
}
const SET_MASTERS = "SET_MASTERS"
const SET_IS_EMPTY = "SET_IS_EMPTY"
const SET_PAGE = "SET_PAGE"
const SET_TOTAL_COUNT = "SET_TOTAL_COUNT"
const REMOVE_MASTER = "REMOVE_MASTER"
const RESET = "RESET"
const MASTER_ACTIVATION = "MASTER_ACTIVATION"

export const masterReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_MASTERS:
            return {...state, masters: action.payload}

        case SET_IS_EMPTY:
            return {...state, isEmpty: action.payload}

        case SET_PAGE:
            return {...state, page: action.payload}

        case SET_TOTAL_COUNT:
            return {...state, totalCount: action.payload}

        case REMOVE_MASTER:
            return {...state, masters: state.masters.filter(master => master.id !== action.payload)}

        case MASTER_ACTIVATION:
            return {
                ...state,
                masters: state.masters.map(master =>
                    master.id === action.payload.id ? {...master, isActivated: action.payload.isActivated} : master)
            }
        default:
            return state

    }
}

export const setMasterAction = (payload) => ({type: SET_MASTERS, payload})
export const setIsEmptyMasterAction = (payload) => ({type: SET_IS_EMPTY, payload})
export const setPageMasterAction = (payload) => ({type: SET_PAGE, payload})
export const setTotalCountMasterAction = (payload) => ({type: SET_TOTAL_COUNT, payload})
export const removeMasterAction = (payload) => ({type: REMOVE_MASTER, payload})
export const activationMasterAction = (payload) => ({type: MASTER_ACTIVATION, payload})
