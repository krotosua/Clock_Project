import {makeAutoObservable} from "mobx";

export default class OrderStore {
    constructor() {
        this._cities = []
        this._isEmpty = false
        makeAutoObservable(this)
    }

    setCities(cities) {
        this._cities = cities
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

}