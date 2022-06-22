import {makeAutoObservable} from "mobx";

export const ROLE_LIST = {
    ADMIN: "ADMIN",
    CUSTOMER: "CUSTOMER",
    MASTER: "MASTER"
}
export default class UserStore {
    constructor() {
        this._isAuth = false
        this._user = {}
        this._userRole = ""
        this._userName = ""
        this._usersList = []
        this._isEmpty = false
        this._page = 1
        this._totalCount = 0
        this._limit = 10
        makeAutoObservable(this)
    }

    setIsAuth(bool) {
        this._isAuth = bool
    }

    setUser(user) {
        this._user = user
    }

    setUserRole(role) {
        this._userRole = role
    }

    setUserName(name) {
        this._userName = name
    }

    setUsersList(users) {
        this._usersList = users
    }

    setIsEmpty(bool) {
        this._isEmpty = bool
    }

    setPage(page) {
        this._page = page
    }

    setTotalCount(count) {
        this._totalCount = count
    }

    get isAuth() {
        return this._isAuth
    }

    get IsEmpty() {
        return this._isEmpty
    }

    get user() {
        return this._user
    }

    get userRole() {
        return this._userRole
    }

    get userName() {
        return this._userName
    }

    get usersList() {
        return this._usersList
    }

    get totalCount() {
        return this._totalCount
    }

    get page() {
        return this._page
    }

    get limit() {
        return this._limit
    }
}