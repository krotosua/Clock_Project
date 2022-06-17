import userLogic from '../businessLogic/userLogic'
import orderLogic from '../businessLogic/orderLogic'
import masterLogic from "../businessLogic/masterLogic";
import sizeLogic from "../businessLogic/sizeLogic"
import ApiError from "../error/ApiError";
import sequelize from "../db";
import cityLogic from "../businessLogic/cityLogic";
import {validationResult} from "express-validator";
import {order, sizeClock, city, user} from '../models/models'
import {NextFunction, Request, Response} from "express";


class OrderController {

    async create(req: Request, res: Response, next: NextFunction): Promise<void | Response | order>{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        try {
            const result: void | { order: order, city: city, clock: sizeClock, user: user } = await sequelize.transaction(async () => {
                const {
                    sizeClockId,
                    masterId,
                    cityId
                }: { sizeClockId: number, date: string, masterId: number, cityId: number } = req.body
                let {time}: { time: Date | string } = req.body
                const clock: void | sizeClock = await sizeLogic.CheckClock(next, sizeClockId)
                if (!clock) {
                    return next(ApiError.badRequest("Clock`s wrong"))
                }
                let endHour: number = Number(new Date(time).getUTCHours()) + Number(clock.date.slice(0, 2))
                const endTime: Date = new Date(new Date(time).setUTCHours(endHour, 0, 0))
                time = new Date(time)
                const city: void | city = await cityLogic.checkCityId(cityId, next)
                if (!city) {
                    return next(ApiError.badRequest("city`s wrong"))
                }
                await masterLogic.checkOrders(next, masterId, time, endTime)
                const user: user = await userLogic.GetOrCreateUser(req)
                if (!user) {
                    return next(ApiError.badRequest("customer is wrong"))
                }
                const userId: number = user.getDataValue("id")
                const order: void | order = await orderLogic.create(req, next, userId, time, endTime)
                if (!order) {
                    return next(ApiError.badRequest("customer is wrong"))
                }
                let data = {
                    order,
                    city,
                    clock,
                    user
                }
                return data
            })
            await orderLogic.sendMessage(req, next, result)
            return res.status(201).json(result!.order)
        } catch (e) {
            return next(ApiError.badRequest("Wrong request"))
        }

    }

    async update(req: Request, res: Response, next: NextFunction) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        try {
            const result: void | [number, order[]] = await sequelize.transaction(async () => {
                const {
                    sizeClockId,
                    date,
                    masterId,
                    cityId,
                    changedMaster
                }: { sizeClockId: number, date: string, masterId: number, cityId: number, changedMaster: boolean } = req.body
                let {time}: { time: Date | string } = req.body
                const clock: void | sizeClock = await sizeLogic.CheckClock(next, sizeClockId)
                if (!clock) {
                    return next(ApiError.badRequest("Clock`s wrong"))
                }
                let endHour: number = Number(new Date(time).getUTCHours()) + Number(clock.date.slice(0, 2))
                let endTime: Date = new Date(new Date(time).setUTCHours(endHour, 0, 0))
                time = new Date(time)
                const city: void | city = await cityLogic.checkCityId(cityId, next)
                if (!city) {
                    return next(ApiError.badRequest("city`s wrong"))
                }
                if (changedMaster) {
                    await masterLogic.checkOrders(next, masterId, time, endTime)
                }
                const user = await userLogic.GetOrCreateUser(req)
                if (!user) {
                    return next(ApiError.badRequest("customer is wrong"))
                }
                const userId: number = user.getDataValue("id")
                const orders: void | [number, order[]] = await orderLogic.update(req, res, next, userId, time, endTime)
                return orders
            })
            return res.status(201).json(result)
        } catch (e) {
            return next(ApiError.badRequest((e as Error).message))
        }
    }

    async statusChange(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        try {
            const orders: void | [number, order[]] = await orderLogic.statusChange(req, res, next)

            return res.status(201).json(orders)
        } catch (e) {
            return next(ApiError.badRequest((e as Error).message))
        }
    }

    async getUserOrders(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        await orderLogic.getUserOrders(req, res, next)
    }

    async getMasterOrders(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        await orderLogic.getMasterOrders(req, res, next)
    }

    async getAllOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
        await orderLogic.getAllOrders(req, res, next)
    }


    async deleteOne(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        await orderLogic.deleteOne(req, res, next)
    }

}

export default new OrderController()