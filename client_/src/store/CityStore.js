import {makeAutoObservable} from "mobx";

export default class CityStore {
    constructor() {
        this._cities = []
        this._isEmpty = false
        this._selectedCity = null
        this._page = 1
        this._totalCount = 0
        this._limit = 10
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

    setPage(page) {
        this._page = page
    }

    setTotalCount(count) {
        this._totalCount = count
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