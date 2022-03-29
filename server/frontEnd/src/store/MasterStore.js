import {makeAutoObservable} from "mobx";

export default class MasterStore {
    constructor() {

        this._masters = []
        this._isEmpty = false
        this._page = 1
        this._totalCount = 0
        this._limit = 10
        makeAutoObservable(this)
    }

    setMasters(masters) {
        this._masters = masters
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

    get masters() {
        return this._masters
    }

    get IsEmpty() {
        return this._isEmpty
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