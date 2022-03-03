import {makeAutoObservable} from "mobx";

export default class UserStore {
    constructor() {
        this._isAuth = false
        this._user = {}
        this._userRole = ""
        this._usersList = []
        this._isEmpty = false
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

    setUsersList(users) {
        this._usersList = users
    }

    setIsEmpty(bool) {
        this._isEmpty = bool
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

    get usersList() {
        return this._usersList
    }
}