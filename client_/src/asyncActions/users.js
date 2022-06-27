import {check, fetchUsers, login} from "../http/userAPI";
import {
    setIsAuthUserAction,
    setIsEmptyUserAction,
    setTotalCountUserAction,
    setUserAction,
    setUserNameAction,
    setUserRoleAction,
    setUsersAction
} from "../store/UserStore";

export const getUsers = (page) => {
    return async dispatch => {
        try {
            const res = await fetchUsers(page, 10)
            if (res.status === 204) {
                dispatch(setIsEmptyUserAction(true))
            }
            dispatch(setIsEmptyUserAction(false))
            dispatch(setUsersAction(res.data.rows))
            dispatch(setTotalCountUserAction(res.data.count))
        } catch (e) {
            dispatch(setIsEmptyUserAction(true))
        }
    }
}
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
        }
    }
}
export const checkUser = () => {
    return async dispatch => {
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
    }
}
