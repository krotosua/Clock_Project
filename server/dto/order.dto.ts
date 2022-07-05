import {Optional} from "sequelize/types"
import {City, Order, SizeClock, User} from "../models/models";


export type CreateOrderDTO = {
    name: string;
    sizeClockId: number;
    masterId: number
    cityId: number;
    price: number;
    changedMaster?: boolean
    isPaid?: boolean
}

export enum STATUS {
    WAITING = "WAITING",
    REJECTED = "REJECTED",
    ACCEPTED = "ACCEPTED",
    DONE = "DONE",
}

export type ResultOrderDTO = {
    order: Order,
    city: City,
    clock: SizeClock,
    user: User
}
export type SendMassageDTO = {
    name: string,
    email: string,
    masterId: number,
    password: string
}

export enum statusList {
    WAITING = "WAITING",
    REJECTED = "REJECTED",
    ACCEPTED = "ACCEPTED",
    DONE = "DONE",
}


export type UpdateMasterDTO = Optional<CreateOrderDTO, 'name'>
