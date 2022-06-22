import {makeAutoObservable} from "mobx";

export const STATUS_LIST = {
    WAITING: "WAITING",
    REJECTED: "REJECTED",
    ACCEPTED: "ACCEPTED",
    DONE: "DONE",
}

export default class OrderStore {
    constructor() {
        this._orders = []
        this._isEmpty = false
        this._page = 1
        this._totalCount = 0
        this._limit = 8
        makeAutoObservable(this)
    }

    setOrders(orders) {
        this._orders = orders
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

    get orders() {
        return this._orders
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