import {makeAutoObservable} from "mobx";

export default class OrderStore {
    constructor() {

        this._masters = []
        this._isEmpty = false
        makeAutoObservable(this)
    }

    setMasters(masters) {
        this._masters = masters
    }

    setIsEmpty(bool) {
        this._isEmpty = bool
    }

    get masters() {
        return this._masters
    }

    get IsEmpty() {
        return this._isEmpty
    }

}