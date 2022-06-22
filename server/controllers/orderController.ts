import userLogic from '../businessLogic/userLogic'
import orderLogic from '../businessLogic/orderLogic'
import masterLogic from "../businessLogic/masterLogic";
import sizeLogic from "../businessLogic/sizeLogic"
import ApiError from "../error/ApiError";
import sequelize from "../db";
import cityLogic from "../businessLogic/cityLogic";
import {Result, ValidationError, validationResult} from "express-validator";
import {City, Order, SizeClock, User} from '../models/models'
import {NextFunction, Request, Response} from "express";
import {CreateOrderDTO, ResultOrderDTO, UpdateMasterDTO} from "../dto/order.dto";
import {ReqQuery, UpdateDB} from "../dto/global";
import {addHours} from "date-fns";


class OrderController {

    async create(req: Request, res: Response, next: NextFunction): Promise<void | Response<Result<ValidationError> | Order>> {
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
                    next(ApiError.badRequest("Clock`s wrong"))
                    return
                }
                const endTime: Date = addHours(new Date(time), Number(clock.date.slice(0, 2)))
                time = new Date(time)
                const city: void | City = await cityLogic.checkCityId(cityId, next)
                if (!city) {
                    next(ApiError.badRequest("City`s wrong"))
                    return
                }
                await masterLogic.checkOrders(next, masterId, time, endTime)
                const user: User = await userLogic.GetOrCreateUser(req)
                if (!user) {
                    next(ApiError.badRequest("Customer is wrong"))
                    return
                }
                const userId: number = user.getDataValue("id")
                const order: void | Order = await orderLogic.create(req, next, userId, time, endTime)
                if (!order) {
                    next(ApiError.badRequest("Customer is wrong"))
                    return
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

    async update(req: Request, res: Response, next: NextFunction): Promise<void | Response<Result<ValidationError> | UpdateDB<Order>>> {
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
                const endTime: Date = addHours(new Date(time), Number(clock.date.slice(0, 2)))
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

    async statusChange(req: Request, res: Response, next: NextFunction): Promise<void | Response<Result<ValidationError> | UpdateDB<Order>>> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        try {
            const orders: void | UpdateDB<Order> = await orderLogic.statusChange(req, res, next)
            if (!orders) {
                next(ApiError.badRequest("Empty"))
                return
            }
            return res.status(201).json(orders)
        } catch (e) {
            next(ApiError.badRequest((e as Error).message))
            return
        }
    }

    async getUserOrders(req: ReqQuery<{ page: number, limit: number }> & Request<{ userId: number }>, res: Response, next: NextFunction): Promise<Response<Result<ValidationError>> | void> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        await orderLogic.getUserOrders(req, res, next)
    }

    async getMasterOrders(req: ReqQuery<{ page: number, limit: number }> & Request<{ userId: number }>, res: Response, next: NextFunction): Promise<Response<Result<ValidationError>> | void> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        await orderLogic.getMasterOrders(req, res, next)
    }

    async getAllOrders(req: ReqQuery<{ page: number, limit: number }>, res: Response, next: NextFunction): Promise<void> {
        await orderLogic.getAllOrders(req, res, next)
    }


    async deleteOne(req: Request, res: Response, next: NextFunction): Promise<Response<Result<ValidationError>> | void> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        await orderLogic.deleteOne(req, res, next)
    }

}

export default new OrderController()