import {order, master, sizeClock, rating, user, city} from '../models/models'
import ApiError from '../error/ApiError'
import MailService from "../service/mailService"
import {Op} from "sequelize";
import {NextFunction, Request, Response} from "express";

const statusList: { WAITING: string, REJECTED: string, ACCEPTED: string, DONE: string } = {
    WAITING: "WAITING",
    REJECTED: "REJECTED",
    ACCEPTED: "ACCEPTED",
    DONE: "DONE",
}

class OrderLogic {


    async create(req: Request, next: NextFunction, userId: number, time: Date, endTime: Date): Promise<order | void> {
        try {
            const {
                name,
                sizeClockId,
                masterId,
                cityId,
                price
            }: { name: string, masterId: number, sizeClockId: number, cityId: number, price: number } = req.body
            const newOrder = await order.create(
                {name, sizeClockId, userId, time, endTime, masterId, cityId, price})
            return newOrder
        } catch (e) {
            return next(ApiError.badRequest((e as Error).message))
        }
    }

    async getUserOrders(req: any, res: Response, next: NextFunction): Promise<Response | undefined> {
        try {
            const userId: string = req.params.userId
            let {limit, page}: { limit: number, page: number } = req.query
            page = page || 1
            limit = limit || 12
            let offset: number = page * limit - limit
            let orders: { rows: order[], count: number }
            orders = await order.findAndCountAll({
                order: [['id', 'DESC']],
                where: {userId: userId},
                include: [{
                    model: master,
                    attributes: ['name'],
                }, {
                    model: sizeClock,
                    attributes: ['name'],
                },
                    {
                        model: rating,
                        attributes: ["rating"],

                    }], limit, offset
            })
            if (!orders.count) {
                return res.status(204).json({message: "List is empty"})
            }
            return res.status(200).json(orders)
        } catch (e) {
            next(ApiError.badRequest((e as Error).message))
        }
    }

    async getMasterOrders(req: any, res: Response, next: NextFunction): Promise<void | Response> {
        try {
            const userId: string = req.params.userId
            let {limit, page}: { limit: number, page: number } = req.query
            page = page || 1
            limit = limit || 12
            const offset: number = page * limit - limit
            let orders: { rows: order[], count: number }
            let masterFind: master | null = await master.findOne({
                where: {userId: userId},
                attributes: ['id', "isActivated"]
            })

            if (masterFind === null || !masterFind.isActivated) {
                return next(ApiError.forbidden("Doesn`t activated"))
            }
            orders = await order.findAndCountAll({
                order: [['id', 'DESC']],
                where: {
                    masterId: masterFind.id,
                    status: {
                        [Op.or]: ["ACCEPTED", "DONE"]
                    }
                },
                include: [{
                    model: master,
                    attributes: ['name'],
                }, {
                    model: sizeClock,
                    attributes: ['name'],

                }], limit, offset
            })
            if (!orders.count) {
                return res.status(204).json({message: "List is empty"})
            }
            return res.status(200).json(orders)
        } catch (e) {
            next(ApiError.badRequest((e as Error).message))
        }
    }

    async getAllOrders(req: any, res: Response, next: NextFunction): Promise<void | Response> {
        try {
            let {limit, page}: { limit: number, page: number } = req.query
            page = page || 1
            limit = limit || 12
            let offset = page * limit - limit
            let orders: { rows: order[], count: number }
            orders = await order.findAndCountAll({
                order: [['id', 'DESC']],
                include: [{
                    model: master,
                }, {
                    model: sizeClock,
                    attributes: ['name'],

                }, {
                    model: user,
                    attributes: ['email'],

                }], limit, offset
            })
            if (!orders.count) {
                return res.status(204).json({message: "List is empty"})
            }
            return res.status(200).json(orders)
        } catch (e) {
            return next(ApiError.badRequest((e as Error).message))
        }

    }

    async update(req: any, res: Response, next: NextFunction, userId: number, time: Date, endTime: Date): Promise<[number, order[]] | void> {
        try {
            const orderId: number = req.params.orderId
            const {
                name,
                sizeClockId,
                masterId,
                cityId,
                price
            }: { name: string, sizeClockId: number, masterId: number, cityId: number, price: number } = req.body
            if (orderId <= 0) {
                next(ApiError.badRequest("cityId is wrong"))
            }
            const orderUpdate: [number, order[]] = await order.update({
                name,
                sizeClockId,
                time,
                endTime,
                masterId,
                cityId,
                userId,
                price
            }, {where: {id: orderId}})

            return orderUpdate
        } catch (e) {
            return next(ApiError.badRequest((e as Error).message))
        }
    }

    async statusChange(req: Request, res: Response, next: NextFunction) {
        try {
            const orderId: string = req.params.orderId
            const status: string = req.body.status
            if (!(status in statusList)) {
                return next(ApiError.badRequest("INVALID STATUS"))
            }
            if (orderId <= "0") {
                return next(ApiError.badRequest("cityId is wrong"))
            }
            const orderUpdate: [number, order[]] = await order.update({
                status: status,
            }, {where: {id: orderId}})

            return orderUpdate
        } catch (e) {
            next(ApiError.badRequest((e as Error).message))
        }
    }

    async deleteOne(req: any, res: Response, next: NextFunction) {
        try {
            const orderId: string = req.params.orderId
            await order.destroy({where: {id: orderId}})
            return res.status(204).json({message: "success"})
        } catch (e) {
            return next(ApiError.badRequest((e as Error).message))
        }
    }

    async sendMessage(req: any, next: NextFunction, result: void | { order: order, city: city, clock: sizeClock, user: user }) {
        try {
            const cityName = result!.city.name
            const size = result!.clock.name
            let {
                name,
                email,
                masterId,
                password
            }: { name: string, email: string, masterId: number, password: string } = req.body
            let {time}: { time: Date | string } = req.body
            const masterMail: master | null = await master.findByPk(masterId)
            if (!masterMail) {
                return next(ApiError.badRequest("masterId is wrong"))
            }
            time = new Date(time).toLocaleString("uk-UA")
            MailService.sendMail(name, time, email, size, masterMail.name, cityName, password, next)

        } catch (e) {
            return next(ApiError.badRequest((e as Error).message))
        }
    }

}

export default new OrderLogic()