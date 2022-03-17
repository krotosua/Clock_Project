import {makeAutoObservable} from "mobx";

export default class SizeStore {
    constructor() {
        this._size = []
        this._isEmpty = false
        this._selectedSize = {date: "00:00:00"}
        makeAutoObservable(this)
    }

    setSize(sizes) {
        this._size = sizes
    }

    setSelectedSize(type) {
        this._selectedSize = type
    }

    setIsEmpty(bool) {
        this._isEmpty = bool
    }


    get size() {
        return this._size
    }

    get IsEmpty() {
        return this._isEmpty
    }

    get selectedSize() {
        return this._selectedSize
    }
}