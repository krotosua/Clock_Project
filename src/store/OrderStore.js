import {makeAutoObservable} from "mobx";

export default class OrderStore {
    constructor() {

        this._orders = [
            {id: 1, name: 'Леха', date: '23.01.2015 22:00:00', sizeClock: '1', master: 'Игорь', city: 'Днепр'},

        ]
        makeAutoObservable(this)
    }

    setOrders(orders) {
        this._orders = orders
    }

    get orders() {
        return this._orders
    }
}