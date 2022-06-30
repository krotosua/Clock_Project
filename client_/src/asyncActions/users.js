import {check, login} from "../http/userAPI";
import {
    setIsAuthUserAction,
    setIsEmptyUserAction,
    setUserAction,
    setUserNameAction,
    setUserRoleAction
} from "../store/UserStore";

export const loginUser = (email, password) => {
    return async dispatch => {
        try {
            const dataUser = await login(email, password)
            dispatch(setUserAction(dataUser))
            dispatch(setIsAuthUserAction(true))
            dispatch(setUserNameAction(dataUser.name))
            dispatch(setUserRoleAction(dataUser.role))
            return dataUser
        } catch (e) {
            dispatch(setIsEmptyUserAction(true))
            if (e.message === "Request failed with status code 401") {
                throw new Error("401")
            } else if (e.message === "Request failed with status code 404") {
                throw new Error("404")
            }
        }
    }
}
export const checkUser = () => {
    return async dispatch => {
        if (localStorage.getItem('token')) {
            try {
                const data = await check()
                dispatch(setUserAction(data))
                dispatch(setUserNameAction(data.name))
                dispatch(setIsAuthUserAction(true))
                dispatch(setUserRoleAction(data.role))
            } catch {
                localStorage.removeItem('token')
            }
        }
    }
}
