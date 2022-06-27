const defaultState = {
    cities: [],
    isEmpty: false,
    selectedCity: [],
    page: 1,
    totalCount: 0,
    limit: 10
}
const SET_CITIES = "SET_CITIES"
const SET_SELECTED_CITY = "SET_SELECTED_CITY"
const SET_IS_EMPTY = "SET_IS_EMPTY"
const SET_PAGE = "SET_PAGE"
const SET_TOTAL_COUNT = "SET_TOTAL_COUNT"
const REMOVE_CITY = "REMOVE_CITY"
const CHANGE_CITY = "CHANGE_CITY"
const GET_CITIES = "GET_CITIES"
const RESET = "RESET"

export const cityReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_CITIES:
            return {...state, cities: action.payload}
        case GET_CITIES:
            return state.cities
        case SET_SELECTED_CITY:
            return {...state, selectedCity: action.payload}

        case SET_IS_EMPTY:
            return {...state, isEmpty: action.payload}

        case SET_PAGE:
            return {...state, page: action.payload}

        case SET_TOTAL_COUNT:
            return {...state, totalCount: action.payload}

        case CHANGE_CITY:
            return {
                ...state,
                cities: state.cities.map(city => city.id === action.payload.id ? city = action.payload : city)
            }

        case REMOVE_CITY:
            return {...state, cities: state.cities.filter(city => city.id !== action.payload)}
        
        default:
            return state
    }
}

export const setCitiesAction = (payload) => ({type: SET_CITIES, payload})
export const setSelectedCityAction = (payload) => ({type: SET_SELECTED_CITY, payload})
export const setEmptyCityAction = (payload) => ({type: SET_IS_EMPTY, payload})
export const setPageCityAction = (payload) => ({type: SET_PAGE, payload})
export const setTotalCountCitiesAction = (payload) => ({type: SET_TOTAL_COUNT, payload})
export const setChangeCityAction = (payload) => ({type: CHANGE_CITY, payload})
export const removeCityAction = (payload) => ({type: REMOVE_CITY, payload})
