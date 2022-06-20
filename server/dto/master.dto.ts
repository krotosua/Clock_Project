import {Optional} from "sequelize/types"
import {City} from "../models/models";
import {Pagination} from "./global";


export type CreateMasterDTO = {
    name: string;
    rating: number;
    isActivated: boolean
    userId: number
    cityId: (number | City)[]
}

export type GetMasterDTO = Pagination & { time: Date }


export type UpdateMasterDTO = Optional<CreateMasterDTO, 'name'>
