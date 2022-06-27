import {Master, Order, Rating, SizeClock, User} from '../models/models'
import ApiError from '../error/ApiError'
import MailService from "../service/mailService"
import {NextFunction, Request, Response} from "express";
import {CreateOrderDTO, ResultOrderDTO, SendMassageDTO, statusList, UpdateMasterDTO} from "../dto/order.dto";
import {GetRowsDB, Pagination, ReqQuery, UpdateDB} from "../dto/global";
import {v5 as uuidv5} from 'uuid';

class OrderLogic {
    async create(req: Request, next: NextFunction, userId: number, time: Date, endTime: Date): Promise<Order> {
        const {
            name,
            sizeClockId,
            masterId,
            cityId,
            price
        }: CreateOrderDTO = req.body
        return await Order.create({name, sizeClockId, userId, time, endTime, masterId, cityId, price})
    }

    async getUserOrders(req: ReqQuery<{ page: number, limit: number }> & Request<{ userId: number }>, res: Response, next: NextFunction): Promise<Response<GetRowsDB<Order> | { message: string }> | void> {
        try {
            const userId: number = req.params.userId
            const pagination: Pagination = req.query
            pagination.page = pagination.page || 1
            pagination.limit = pagination.limit || 12
            const offset: number = pagination.page * pagination.limit - pagination.limit
            const orders: GetRowsDB<Order> = await Order.findAndCountAll({
                order: [['id', 'DESC']],
                where: {userId: userId},
                include: [{
                    model: Master,
                    attributes: ['name'],
                }, {
                    model: SizeClock,
                    attributes: ['name'],
                },
                    {
                        model: Rating,
                        attributes: ["rating"],

                    }], limit: pagination.limit, offset
            })
            if (!orders.count) {
                return res.status(204).json({message: "List is empty"})
            }
            return res.status(200).json(orders)
        } catch (e) {
            next(ApiError.badRequest((e as Error).message))
            return
        }
    }

    async getMasterOrders(req: ReqQuery<{ page: number, limit: number }> & Request<{ userId: number }>, res: Response, next: NextFunction): Promise<void | Response<GetRowsDB<Order> | { message: string }>> {
        try {
            const userId: number = req.params.userId
            const pagination: Pagination = req.query
            pagination.page = pagination.page || 1
            pagination.limit = pagination.limit || 12
            const offset: number = pagination.page * pagination.limit - pagination.limit
            const masterFind: Master | null = await Master.findOne({
                where: {userId: userId},
                attributes: ['id', "isActivated"]
            })

            if (masterFind === null || !masterFind.isActivated) {
                return next(ApiError.forbidden("Not activated"))
            }
            const orders: GetRowsDB<Order> = await Order.findAndCountAll({
                order: [['id', 'DESC']],
                where: {
                    masterId: masterFind.id,
                },
                include: [{
                    model: Master,
                    attributes: ['name'],
                }, {
                    model: SizeClock,
                    attributes: ['name'],

                }], limit: pagination.limit, offset
            })
            if (!orders.count) {
                return res.status(204).json({message: "List is empty"})
            }
            return res.status(200).json(orders)
        } catch (e) {
            next(ApiError.badRequest((e as Error).message))
        }
    }

    async getAllOrders(req: ReqQuery<{ page: number, limit: number }>, res: Response, next: NextFunction): Promise<void | Response<GetRowsDB<Order> | { message: string }>> {
        try {
            const pagination: Pagination = req.query
            pagination.page = pagination.page || 1
            pagination.limit = pagination.limit || 12
            const offset: number = pagination.page * pagination.limit - pagination.limit
            const orders: GetRowsDB<Order> = await Order.findAndCountAll({
                order: [['id', 'DESC']],
                include: [{
                    model: Master,
                }, {
                    model: SizeClock,
                    attributes: ['date'],

                }, {
                    model: User,
                    attributes: ['email'],

                }], limit: pagination.limit, offset
            })
            if (!orders.count) {
                return res.status(204).json({message: "List is empty"})
            }
            return res.status(200).json(orders)
        } catch (e) {
            next(ApiError.badRequest((e as Error).message))
            return
        }

    }

    async update(req: any, res: Response, next: NextFunction, userId: number, time: Date, endTime: Date): Promise<UpdateDB<Order> | void> {
        try {
            const orderId: number = req.params.orderId
            const {
                name,
                sizeClockId,
                masterId,
                cityId,
                price
            }: UpdateMasterDTO = req.body
            if (orderId <= 0) {
                next(ApiError.badRequest("cityId is wrong"))
            }
            const orderUpdate: UpdateDB<Order> = await Order.update({
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
            next(ApiError.badRequest((e as Error).message))
            return
        }
    }

    async statusChange(req: Request, res: Response, next: NextFunction): Promise<void | UpdateDB<Order>> {
        try {
            const orderId: string = req.params.orderId
            const status: string = req.body.status
            if (!(status in statusList)) {
                return next(ApiError.badRequest("INVALID STATUS"))
            }
            const orderUpdate: UpdateDB<Order> = await Order.update({
                status: status,
            }, {where: {id: orderId}})
            if (status === "DONE") {
                const mailInfo: Order | null = await Order.findOne({
                    where: {id: orderId},
                    attributes: ["masterId", "id"],
                    include: [{
                        model: User,
                        attributes: ["email"],
                    }]
                })
                if (!mailInfo || !mailInfo.user) {
                    next(ApiError.badRequest("Wrong request"));
                    return
                }

                const activationLink = uuidv5(`${process.env.API_URL}api/orders/rating/:masterId=${mailInfo.masterId}`, uuidv5.URL)
                // const email: string = mailInfo.user.email
                // MailService.sendOrderDone(email, orderId, next)
            }
            return orderUpdate
        } catch (e) {
            next(ApiError.badRequest((e as Error).message))
            return
        }
    }

    async deleteOne(req: any, res: Response, next: NextFunction): Promise<void | Response<{ message: string }>> {
        try {
            const orderId: string = req.params.orderId
            await Order.destroy({where: {id: orderId}})
            return res.status(204).json({message: "success"})
        } catch (e) {
            next(ApiError.badRequest((e as Error).message))
            return
        }
    }

    async sendMessage(req: any, next: NextFunction, result: void | ResultOrderDTO): Promise<void> {
        try {
            const cityName: string = result!.city.name
            const size: string = result!.clock.name
            const orderNumber: number = result!.order.id
            const {
                name,
                email,
                masterId,
                password
            }: SendMassageDTO = req.body
            let {time}: { time: Date | string } = req.body
            const masterMail: Master | null = await Master.findByPk(masterId)
            if (!masterMail) {
                next(ApiError.badRequest("masterId is wrong"))
                return
            }
            time = new Date(time).toLocaleString("uk-UA")
            const mailInfo = {
                name,
                time,
                email,
                password,
                size,
                masterName: masterMail.name,
                cityName,
                orderNumber,
            }
            MailService.sendMail(mailInfo, next)
            if (password) {
                MailService.userInfo(mailInfo, next)
            }
        } catch (e) {
            next(ApiError.badRequest((e as Error).message))
            return
        }
    }

}

export default new OrderLogic()