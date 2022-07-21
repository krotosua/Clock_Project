import {City, Master, Order, Rating, SizeClock, User} from '../models/models'
import ApiError from '../error/ApiError'
import MailService from "../service/mailService"
import {NextFunction, Request, Response} from "express";
import {
    CreateOrderDTO,
    forGetOrders,
    ResultOrderDTO,
    SendMassageDTO,
    SORTING,
    STATUS,
    statusList,
    UpdateMasterDTO
} from "../dto/order.dto";
import {DIRECTION, GetRowsDB, ReqQuery, UpdateDB} from "../dto/global";
import {v4 as uuidv4} from 'uuid';
import {Op} from "sequelize";
import XLSX from "xlsx";
import {getDate, getHours, getMonth, isPast, setHours} from "date-fns";
import cron = from;

'node-cron'

const {between, gte} = Op;

class OrderLogic {
    async create(req: Request, next: NextFunction, userId: number, time: Date, endTime: Date): Promise<Order> {
        const {
            name,
            sizeClockId,
            masterId,
            cityId,
            price,
            isPaid
        }: CreateOrderDTO = req.body
        return await Order.create({
            name,
            sizeClockId,
            userId,
            time,
            endTime,
            masterId,
            cityId,
            price,
            status: isPaid ? STATUS.ACCEPTED : STATUS.WAITING
        })
    }

    async getUserOrders(req: ReqQuery<{ page: number, limit: number, sorting: string, ascending: string, filters: string }> & Request<{ userId: number }>, res: Response, next: NextFunction): Promise<Response<GetRowsDB<Order> | { message: string }> | void> {
        try {
            const userId: number = req.params.userId
            const sorting: string = req.query.sorting ?? "name"
            const directionUp: string = req.query.ascending === "true" ? DIRECTION.DOWN : DIRECTION.UP
            const page = req.query.page ?? 1;
            const limit = req.query.limit ?? 10;
            const {
                cityIDes,
                masterIDes,
                sizeIDes,
                time,
                status,
                minPrice,
                maxPrice
            }: forGetOrders = req.query.filters ? JSON.parse(req.query.filters)
                : {
                    cityIDes: null,
                    masterIDes: null,
                    sizeIDes: null,
                    time: null,
                    status: null, minPrice: null, maxPrice: null
                }
            const offset: number = page * limit - limit
            const orders: GetRowsDB<Order> = await Order.findAndCountAll({
                order: [sorting === SORTING.MASTER_NAME ? [Master, "name", directionUp]
                    : sorting === SORTING.SIZE_NAME ? [SizeClock, "name", directionUp] :
                        sorting === SORTING.CITY_NAME ? [City, "name", directionUp]
                            : [sorting, directionUp]],
                where: {
                    userId: userId,
                    status: status ?? Object.keys(STATUS),
                    time: time ? {[between]: time} : {[Op.ne]: 0},
                    price: !!maxPrice ? {[between]: [minPrice ?? 0, maxPrice]} : {[gte]: minPrice ?? 0}
                },
                include: [{
                    model: Master,
                    attributes: ['name'],
                    where: {
                        id: masterIDes ?? {[Op.ne]: 0}
                    }
                }, {
                    model: SizeClock,
                    where: {
                        id: sizeIDes ?? {[Op.ne]: 0}
                    },
                    attributes: ['name']
                },
                    {
                        model: Rating,
                        attributes: ["rating"],
                    },
                    {
                        model: City,
                        where: {
                            id: cityIDes ?? {[Op.ne]: 0}
                        }
                    }], limit, offset
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

    async getMasterOrders(req: ReqQuery<{ page: number, limit: number, sorting: string, ascending: string, filters: string }> & Request<{ userId: number }>, res: Response, next: NextFunction): Promise<void | Response<GetRowsDB<Order> | { message: string }>> {
        try {
            const userId: number = req.params.userId
            const sorting: string = req.query.sorting ?? "name"
            const directionUp: string = req.query.ascending === "true" ? DIRECTION.DOWN : DIRECTION.UP
            const page = req.query.page ?? 1;
            const limit = req.query.limit ?? 10;
            const {
                cityIDes,
                userIDes,
                sizeIDes,
                time,
                status,
                minPrice,
                userEmails,
                userName,
                maxPrice
            }: forGetOrders = req.query.filters ? JSON.parse(req.query.filters)
                : {
                    cityIDes: null,
                    userIDes: null,
                    sizeIDes: null,
                    time: null,
                    status: null, minPrice: null, maxPrice: null, userEmails: null,
                    userName: null
                }
            const offset: number = page * limit - limit
            const masterFind: Master | null = await Master.findOne({
                where: {userId: userId},
                attributes: ['id', "isActivated"]
            })
            if (masterFind === null || !masterFind.isActivated) {
                return next(ApiError.forbidden("Not activated"))
            }
            const orders: GetRowsDB<Order> = await Order.findAndCountAll({
                order: [sorting === SORTING.SIZE_NAME ? [SizeClock, "name", directionUp] :
                    sorting === SORTING.CITY_NAME ? [City, "name", directionUp] :
                        sorting === SORTING.USER_ID ? [User, "id", directionUp]
                            : [sorting, directionUp]],
                where: {
                    name: userName ? {[Op.or]: [{[Op.substring]: userName}, {[Op.iRegexp]: userName}]} : {[Op.ne]: ""},
                    masterId: masterFind.id,
                    status: status ?? Object.keys(STATUS),
                    time: time ? {[between]: time} : {[Op.ne]: 0},
                    price: !!maxPrice ? {[between]: [minPrice ?? 0, maxPrice]} : {[gte]: minPrice ?? 0}
                },
                include: [{
                    model: Master,
                    attributes: ['name'],
                }, {
                    model: SizeClock,
                    where: {
                        id: sizeIDes ?? {[Op.ne]: 0}
                    },
                    attributes: ['name']
                }, {
                    model: City,
                    where: {
                        id: cityIDes ?? {[Op.ne]: 0}
                    },
                }, {
                    model: User,
                    where: {
                        email: userEmails ?? {[Op.ne]: ""},
                        id: userIDes ?? {[Op.ne]: 0}
                    },
                    attributes: ["id"],
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

    async getAllOrders(req: ReqQuery<{ page: number, limit: number, sorting: string, ascending: string, filters: string }>, res: Response, next: NextFunction): Promise<void | Response<GetRowsDB<Order> | { message: string }>> {
        try {
            const sorting: string = req.query.sorting ?? "name"
            const direction: string = req.query.ascending === "true" ? DIRECTION.DOWN : DIRECTION.UP
            const {
                cityIDes,
                masterIDes,
                time,
                status,
                minPrice,
                maxPrice,
                userName
            }: forGetOrders = req.query.filters ? JSON.parse(req.query.filters)
                : {
                    cityIDes: null,
                    masterIDes: null,
                    time: null,
                    status: null, minPrice: null, maxPrice: null, userName: null
                }
            const page = req.query.page ?? 1;
            const limit = req.query.limit ?? 10;
            const offset: number = page * limit - limit
            const orders: GetRowsDB<Order> = await Order.findAndCountAll({
                where: {
                    name: userName ? {[Op.or]: [{[Op.substring]: userName}, {[Op.iRegexp]: userName}]} : {[Op.ne]: ""},
                    status: status ?? Object.keys(STATUS),
                    time: time ? {[between]: time} : {[Op.ne]: 0},
                    price: !!maxPrice ? {[between]: [minPrice ?? 0, maxPrice]} : {[gte]: minPrice ?? 0}
                },
                order: [sorting === SORTING.MASTER_NAME ? [Master, "name", direction]
                    : sorting === SORTING.DATE ? [SizeClock, sorting, direction] :
                        sorting === SORTING.CITY_NAME ? [City, "name", direction] :
                            sorting === SORTING.CITY_PRICE ? [City, "price", direction]
                                : [sorting, direction]],
                include: [{
                    model: Master,
                    where: {
                        id: masterIDes ?? {[Op.ne]: 0}
                    }
                }, {
                    model: SizeClock,
                    attributes: ['date'],

                }, {
                    model: User,
                    attributes: ['email'],
                },
                    {
                        model: City,
                        where: {
                            id: cityIDes ?? {[Op.ne]: 0}
                        }
                    }], limit, offset
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

    async exportToExcel(req: ReqQuery<{ sorting: string, ascending: string, filters: string }>, res: Response, next: NextFunction) {
        try {
            const sorting: string = req.query.sorting ?? "name"
            const direction: string = req.query.ascending === "true" ? DIRECTION.DOWN : DIRECTION.UP
            const {
                cityIDes,
                masterIDes,
                time,
                status,
                minPrice,
                maxPrice,
                userName
            }: forGetOrders = req.query.filters !== "null" ? JSON.parse(req.query.filters)
                : {
                    cityIDes: null,
                    masterIDes: null,
                    time: null,
                    status: null, minPrice: null, maxPrice: null, userName: null
                }
            const orders: Order[] = await Order.findAll({
                where: {
                    name: userName ? {[Op.substring]: userName ?? ""} : {[Op.ne]: ""},
                    status: status ?? Object.keys(STATUS),
                    time: time ? {[between]: time} : {[Op.ne]: 0},
                    price: !!maxPrice ? {[between]: [minPrice ?? 0, maxPrice]} : {[gte]: minPrice ?? 0}
                },
                order: [sorting === SORTING.MASTER_NAME ? [Master, "name", direction]
                    : sorting === SORTING.DATE ? [SizeClock, sorting, direction] :
                        sorting === SORTING.CITY_NAME ? [City, "name", direction] :
                            sorting === SORTING.CITY_PRICE ? [City, "price", direction]
                                : [sorting, direction]],
                include: [{
                    model: Master,
                    attributes: ["name"],
                    where: {
                        id: masterIDes ?? {[Op.ne]: 0}
                    }
                }, {
                    model: SizeClock,
                    attributes: ['date'],

                },
                    {
                        model: City,
                        attributes: ["price", "name"],
                        where: {
                            id: cityIDes ?? {[Op.ne]: 0}
                        }
                    }],
                attributes: ["id", "name", "time", "endTime", "status", "price"],
                raw: true
            })
            if (!orders) {
                return res.status(204).json({message: "List is empty"})
            }

            const rightOrders = orders.map((order: any) => ({
                id: order.id,
                name: order.name,
                startTime: new Date(order.time).toLocaleString(),
                endTime: new Date(order.endTime).toLocaleString(),
                masterName: order['master.name'],
                cityName: order['city.name'],
                priceForHour: order['city.price'],
                time: order['sizeClock.date'],
                totalPrice: order.price,
                status: order.status
            }))

            const headings = [
                ["id", "name", "startDate", "endDate", "masterName", "cityName", "priceForHour", "timeSize", "Total", "status"]
            ];
            const ws = await XLSX.utils.json_to_sheet(rightOrders, {});
            const wb = XLSX.utils.book_new()
            XLSX.utils.sheet_add_aoa(ws, headings);
            XLSX.utils.book_append_sheet(wb, ws, 'Orders')
            const buffer = XLSX.write(wb, {bookType: 'xlsx', type: 'buffer'});
            return res.send(buffer);
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
            if (status === STATUS.DONE) {
                const mailInfo: Order | null = await Order.findOne({
                    where: {id: orderId},
                    attributes: ["masterId", "id", "ratingLink"],
                    include: [{
                        model: User,
                        attributes: ["email"],
                    }]
                })
                if (!mailInfo || !mailInfo.user) {
                    next(ApiError.badRequest("Wrong request"));
                    return
                } else if (mailInfo.ratingLink) {
                    return orderUpdate
                }
                const ratingLink: string = uuidv4()
                mailInfo.ratingLink = ratingLink
                await mailInfo.save()
                const email: string = mailInfo.user.email
                MailService.sendOrderDone(email, orderId, `${process.env.RATING_URL}/${ratingLink}`, next)
            }
            return orderUpdate
        } catch (e) {
            next(ApiError.badRequest((e as Error).message))
            return
        }
    }

    async payPalChange(req: Request, res: Response, next: NextFunction): Promise<Order | [number, Order[]] | void> {
        try {
            if (req.body.event_type === "CHECKOUT.ORDER.APPROVED") {
                const orderId: string = req.body.resource.purchase_units[0].description
                const payPalId: string = req.body.resource.id
                const orderUpdate: [number, Order[]] = await Order.update({
                    payPalId: payPalId
                }, {where: {id: orderId}})
                return orderUpdate
            } else if (req.body.event_type === "PAYMENT.CAPTURE.COMPLETED") {
                const payPalId: string = req.body.resource.supplementary_data.related_ids.order_id
                const orderUpdate: Order | null = await Order.findOne(
                    {where: {payPalId: payPalId}}
                )
                if (!orderUpdate) {
                    next(ApiError.badRequest("Error event"))
                    return
                }
                await orderUpdate.update({
                    status: STATUS.ACCEPTED
                })
                return orderUpdate
            } else {
                next(ApiError.badRequest("Error event"))
                return
            }
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
            const masterMail: Master | null = await Master.findOne({
                where: {
                    id: masterId
                },
                include: {all: true, nested: true}
            })
            if (!masterMail || masterMail.user === undefined) {
                next(ApiError.badRequest("masterId is wrong"))
                return
            }
            if (isPast(setHours(new Date(time), getHours(new Date(time)) - 1))) {
                MailService.remindMail({email: masterMail.user!.email, orderNumber}, next);
            } else {
                cron.schedule(`0 ${getHours(new Date(time)) - 1} ${getDate(new Date(time))} ${getMonth(new Date(time)) + 1} *`, () => {
                    MailService.remindMail({email: masterMail.user!.email, orderNumber}, next);
                });
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