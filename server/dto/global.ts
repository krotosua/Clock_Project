import {Request} from "express";

export type UpdateDB<T> = [number, T[]];

export type GetRowsDB<T> = {
    rows: T[],
    count: number
}

export type Pagination = {
    limit: number;
    page: number;
}
export type ReqQuery<T> = Request<{}, {}, {}, T>