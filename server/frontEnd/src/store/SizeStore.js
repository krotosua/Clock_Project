import {makeAutoObservable} from "mobx";

export default class SizeStore {
    constructor() {
        this._size = []
        this._isEmpty = false
        this._selectedSize = {date: "00:00:00"}
        this._page = 1
        this._totalCount = 0
        this._limit = 10
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

    setPage(page) {
        this._page = page
    }

    setTotalCount(count) {
        this._totalCount = count
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