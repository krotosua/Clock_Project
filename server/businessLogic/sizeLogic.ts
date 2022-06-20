import {NextFunction, Request, Response} from "express";
import {Order, SizeClock, SizeClockInput} from '../models/models'
import ApiError from '../error/ApiError'
import {CreateSizeClockDTO} from "../dto/sizeClock.dto";
import {GetRowsDB, Pagination, ReqQuery, UpdateDB} from "../dto/global";


class SizeLogic {
    async create(req: Request, res: Response, next: NextFunction): Promise<Response<SizeClock> | void> {
        try {
            const sizeInfo: CreateSizeClockDTO = req.body
            const size: SizeClock = await SizeClock.create(sizeInfo)
            return res.status(201).json(size)
        } catch (e) {
            next(ApiError.badRequest((e as Error).message))
            return
        }
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<Response<SizeClock> | void> {
        try {
            const sizeId: number = Number(req.params.sizeId)
            const updateSize: SizeClockInput = req.body
            const size: UpdateDB<SizeClock> = await SizeClock.update(updateSize, {where: {id: sizeId}})
            return res.status(201).json(size)
        } catch (e) {
            next(ApiError.badRequest((e as Error).message))
            return
        }
    }


    async getAll(req: ReqQuery<{ page: number, limit: number }>, res: Response, next: NextFunction): Promise<Response<GetRowsDB<SizeClock> | { message: string }> | void> {
        try {
            const pagination: Pagination = req.query
            pagination.page = pagination.page || 1
            pagination.limit = pagination.limit || 12
            const offset = pagination.page * pagination.limit - pagination.limit
            const sizes: GetRowsDB<SizeClock> = await SizeClock.findAndCountAll({
                limit: pagination.limit, offset
            })
            if (!sizes.count) {
                return res.status(204).json({message: "List is empty"})
            }
            return res.status(200).json(sizes)
        } catch (e) {
            next(ApiError.badRequest((e as Error).message))
            return
        }
    }

    async CheckClock(next: NextFunction, sizeClockId: number): Promise<void | SizeClock> {
        const clock: SizeClock | null = await SizeClock.findOne({where: {id: sizeClockId}})
        if (!clock) {
            return next(ApiError.badRequest('WRONG sizeClockId'))
        }
        return clock
    }

    async deleteOne(req: Request, res: Response, next: NextFunction): Promise<Response<{ message: string }> | void> {
        try {
            const sizeId: string = req.params.sizeId
            if (sizeId) {
                const size: SizeClock | null = await SizeClock.findOne({
                    where: {id: sizeId},
                    include: Order,
                    attributes: ["id"]
                })
                if (size === null || size.orders === undefined) {
                    next(ApiError.badRequest("Id is empty"))
                    return
                }
                if (size.orders.length === 0) {
                    await size.destroy()
                    return res.status(204).json({message: "success"})
                } else {
                    next(ApiError.Conflict("Clock has orders"))
                    return
                }
            } else {
                next(ApiError.badRequest("Id is empty"))
                return
            }
        } catch (e) {
            next(ApiError.badRequest((e as Error).message))
            return
        }
    }


}


export default new SizeLogic()

