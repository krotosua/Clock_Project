import {makeAutoObservable} from "mobx";

export default class OrderStore {
    constructor() {
        this._cities = [
            {id: 1, name: 'Днепр'},
            {id: 2, name: 'Ужгород'}
        ]
        makeAutoObservable(this)
    }

    setCities(cities) {
        this._cities = cities
    }


    get cities() {
        return this._cities
    }

}