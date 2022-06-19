import userLogic from '../businessLogic/userLogic'
import orderLogic from '../businessLogic/orderLogic'
import masterLogic from "../businessLogic/masterLogic";
import sizeLogic from "../businessLogic/sizeLogic"
import ApiError from "../error/ApiError";
import sequelize from "../db";
import cityLogic from "../businessLogic/cityLogic";
import {validationResult} from "express-validator";
import {City, Order, SizeClock, User} from '../models/models'
import {NextFunction, Request, Response} from "express";
import {CreateOrderDTO, ResultOrderDTO, UpdateMasterDTO} from "../dto/order.dto";
import {UpdateDB} from "../dto/global";


class OrderController {

    async create(req: Request, res: Response, next: NextFunction): Promise<void | Response | Order> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        try {
            const result: void | ResultOrderDTO = await sequelize.transaction(async () => {
                const {
                    sizeClockId,
                    masterId,
                    cityId
                }: CreateOrderDTO = req.body
                let {time}: { time: Date | string } = req.body
                const clock: void | SizeClock = await sizeLogic.CheckClock(next, sizeClockId)
                if (!clock) {
                    return next(ApiError.badRequest("Clock`s wrong"))
                }
                const endHour: number = Number(new Date(time).getUTCHours()) + Number(clock.date.slice(0, 2))
                const endTime: Date = new Date(new Date(time).setUTCHours(endHour, 0, 0))
                time = new Date(time)
                const city: void | City = await cityLogic.checkCityId(cityId, next)
                if (!city) {
                    return next(ApiError.badRequest("City`s wrong"))
                }
                await masterLogic.checkOrders(next, masterId, time, endTime)
                const user: User = await userLogic.GetOrCreateUser(req)
                if (!user) {
                    return next(ApiError.badRequest("Customer is wrong"))
                }
                const userId: number = user.getDataValue("id")
                const order: void | Order = await orderLogic.create(req, next, userId, time, endTime)
                if (!order) {
                    return next(ApiError.badRequest("Customer is wrong"))
                }
                const data = {
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
            const result: void | UpdateDB<Order> = await sequelize.transaction(async () => {
                const {
                    sizeClockId,
                    masterId,
                    cityId,
                    changedMaster
                }: UpdateMasterDTO = req.body
                let {time}: { time: Date | string } = req.body
                const clock: void | SizeClock = await sizeLogic.CheckClock(next, sizeClockId)
                if (!clock) {
                    return next(ApiError.badRequest("Clock`s wrong"))
                }
                const endHour: number = Number(new Date(time).getUTCHours()) + Number(clock.date.slice(0, 2))
                const endTime: Date = new Date(new Date(time).setUTCHours(endHour, 0, 0))
                time = new Date(time)
                const city: void | City = await cityLogic.checkCityId(cityId, next)
                if (!city) {
                    return next(ApiError.badRequest("City`s wrong"))
                }
                if (changedMaster) {
                    await masterLogic.checkOrders(next, masterId, time, endTime)
                }
                const user: User = await userLogic.GetOrCreateUser(req)
                if (!user) {
                    return next(ApiError.badRequest("Customer is wrong"))
                }
                const userId: number = user.getDataValue("id")
                const orders: void | UpdateDB<Order> = await orderLogic.update(req, res, next, userId, time, endTime)
                return orders
            })
            return res.status(201).json(result)
        } catch (e) {
            return next(ApiError.badRequest((e as Error).message))
        }
    }

    async statusChange(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        try {
            const orders: void | UpdateDB<Order> = await orderLogic.statusChange(req, res, next)

            return res.status(201).json(orders)
        } catch (e) {
            return next(ApiError.badRequest((e as Error).message))
        }
    }

    async getUserOrders(req: Request, res: Response, next: NextFunction): Promise<Response | undefined> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        await orderLogic.getUserOrders(req, res, next)
    }

    async getMasterOrders(req: Request, res: Response, next: NextFunction): Promise<Response | undefined> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        await orderLogic.getMasterOrders(req, res, next)
    }

    async getAllOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
        await orderLogic.getAllOrders(req, res, next)
    }


    async deleteOne(req: Request, res: Response, next: NextFunction): Promise<Response | undefined> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        await orderLogic.deleteOne(req, res, next)
    }

}

export default new OrderController()