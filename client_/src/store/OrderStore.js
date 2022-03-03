import {makeAutoObservable} from "mobx";

export default class OrderStore {
    constructor() {

        this._orders = []
        this._isEmpty = false
        makeAutoObservable(this)
    }

    setOrders(orders) {
        this._orders = orders
    }

    setIsEmpty(bool) {
        this._isEmpty = bool
    }

    get orders() {
        return this._orders
    }

    get IsEmpty() {
        return this._isEmpty
    }
}