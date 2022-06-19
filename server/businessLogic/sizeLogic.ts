import {NextFunction, Request, Response} from "express";
import {Order, SizeClock, SizeClockInput} from '../models/models'
import ApiError from '../error/ApiError'
import {CreateSizeClockDTO} from "../dto/sizeClock.dto";
import {GetRowsDB, Pagination, UpdateDB} from "../dto/global";


class SizeLogic {
    async create(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const sizeInfo: CreateSizeClockDTO = req.body
            const size = await SizeClock.create(sizeInfo)
            return res.status(201).json(size)
        } catch (e) {
            next(ApiError.badRequest((e as Error).message))
        }
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const sizeId: number = Number(req.params.sizeId)
            const updateSize: SizeClockInput = req.body
            const size: UpdateDB<SizeClock> = await SizeClock.update(updateSize, {where: {id: sizeId}})
            return res.status(201).json(size)
        } catch (e) {
            return next(ApiError.badRequest((e as Error).message))
        }
    }


    async getAll(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const pagination: Pagination = req.query as any
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
        }
    }

    async CheckClock(next: NextFunction, sizeClockId: number): Promise<void | SizeClock> {
        const clock: SizeClock | null = await SizeClock.findOne({where: {id: sizeClockId}})
        if (!clock) {
            return next(ApiError.badRequest('WRONG sizeClockId'))
        }
        return clock
    }

    async deleteOne(req: Request, res: Response, next: NextFunction): Promise<Response | Promise<any>> {
        try {
            const sizeId: string = req.params.sizeId
            if (sizeId) {
                const size: SizeClock | null = await SizeClock.findOne({
                    where: {id: sizeId},
                    include: Order,
                    attributes: ["id"]
                })
                if (size === null || size.orders === undefined) {
                    return next(ApiError.badRequest("Id is empty"))
                }
                if (size.orders.length === 0) {
                    await size.destroy()
                    return res.status(204).json("success")
                } else {
                    return next(ApiError.Conflict("Clock has orders"))
                }
            } else {
                return next(ApiError.badRequest("Id is empty"))
            }
        } catch (e) {
            return next(ApiError.badRequest((e as Error).message))
        }
    }


}


export default new SizeLogic()

