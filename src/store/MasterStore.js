import {makeAutoObservable} from "mobx";

export default class OrderStore {
    constructor() {

        this._masters = [
            {id: 1, name: 'Валера', rating: 4, cityId: 1},
            {id: 2, name: 'Никита', rating: 4, cityId: 1},
            {id: 3, name: 'Игорь', rating: 5, cityId: 1},
            {id: 4, name: 'БогданЭ', rating: 5, cityId: 2},
            {id: 5, name: 'Кирилл', rating: 3, cityId: 2},

        ]

        makeAutoObservable(this)
    }

    setMasters(masters) {
        this._masters = masters
    }

    get masters() {
        return this._masters
    }

}