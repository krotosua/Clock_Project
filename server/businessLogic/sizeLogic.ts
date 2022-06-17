import {NextFunction, Request, Response} from "express";
import {SizeClockInput, sizeClock, order} from '../models/models'
import ApiError from '../error/ApiError'


class SizeLogic {
    async create(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const {name, date}: SizeClockInput = req.body
            const size = await sizeClock.create({name, date})
            return res.status(201).json(size)
        } catch (e) {
            next(ApiError.badRequest((e as Error).message))
        }
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const sizeId: string = req.params.sizeId
            const {name, date}: SizeClockInput = req.body
            const size: [number, sizeClock[]] = await sizeClock.update({
                name: name,
                date: date
            }, {where: {id: sizeId}})
            return res.status(201).json(size)
        } catch (e) {
            return next(ApiError.badRequest((e as Error).message))
        }
    }


    async getAll(req: any, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            let {limit, page}: { limit: number, page: number } = req.query;
            page = page || 1
            limit = limit || 12
            let offset = page * limit - limit
            let sizes: { rows: sizeClock[], count: number }
            sizes = await sizeClock.findAndCountAll({
                limit, offset
            })
            if (!sizes.count) {
                return res.status(204).json({message: "List is empty"})
            }
            return res.status(200).json(sizes)
        } catch (e) {
            next(ApiError.badRequest((e as Error).message))
        }
    }

    async CheckClock(next: NextFunction, sizeClockId: number): Promise<void | sizeClock> {
        const clock: sizeClock | null = await sizeClock.findOne({where: {id: sizeClockId}})
        if (!clock) {
            return next(ApiError.badRequest('WRONG sizeClockId'))
        }
        return clock
    }

    async deleteOne(req: Request, res: Response, next: NextFunction): Promise<Response | Promise<any>> {
        try {
            const sizeId: string = req.params.sizeId
            if (sizeId) {
                const size: sizeClock | null = await sizeClock.findOne({
                    where: {id: sizeId},
                    include: order,
                    attributes: ["id"]
                })
                if (size == null || size.orders == undefined) {
                    return next(ApiError.badRequest("Id is empty"))
                }
                if (size.orders.length == 0) {
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

