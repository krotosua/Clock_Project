import {makeAutoObservable} from "mobx";

export default class OrderStore {
    constructor() {
        this._cities = []
        this._isEmpty = false
        this._selectedCity = null
        makeAutoObservable(this)
    }

    setCities(cities) {
        this._cities = cities
    }

    setSelectedCity(type) {
        this._selectedCity = type
    }

    setIsEmpty(bool) {
        this._isEmpty = bool
    }


    get cities() {
        return this._cities
    }

    get IsEmpty() {
        return this._isEmpty
    }

    get selectedCity() {
        return this._selectedCity
    }
}