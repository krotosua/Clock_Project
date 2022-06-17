import {city, master, MasterInput, order, rating, sizeClock, user} from '../models/models'
import ApiError from '../error/ApiError'
import {Op} from "sequelize";
import sizeLogic from "./sizeLogic"
import sequelize from "../db"
import {NextFunction, Request, Response} from "express";
const {and, lt, lte, not, is, or, gt, gte} = Op;

class MasterLogic {
    async create(req: Request, res: Response, next: NextFunction): Promise<Response | Promise<any>> {
        try {
            const {name, rating, isActivated}: MasterInput = req.body
            const {userId,cityId}: {userId: number,cityId:number[] } = req.body
            const newMaster = await master.create({name, rating,userId, isActivated})
            await newMaster.addCities(cityId)
            return newMaster
        } catch (e) {
            next(ApiError.badRequest((e as Error).message))
        }
    }

    async getAll(req: any, res: Response, next: NextFunction): Promise<Response | Promise<any>> {
        try {
            let {limit, page}: { limit: number, page: number } = req.query;
            page = page || 1
            limit = limit || 12
            let offset = page * limit - limit
            let masters: { rows: master[], count: number } = await master.findAndCountAll({
                order: [['id', 'DESC']],
                attributes: ['name', "rating", "id", "isActivated"],
                include: [{
                    model: city, through: {
                        attributes: []
                    },

                }, {model: user,}],
            })

            if (!masters.count) {
                return res.status(204).json("List is empty")
            }
            masters.count = masters.rows.length
            masters.rows = masters.rows.slice(offset, page * limit)
            return res.json(masters)
        } catch (e) {
            return next(ApiError.NotFound((e as Error).message))
        }
    }

    async getMastersForOrder(req: any, res: Response, next: NextFunction) {
        try {
            const cityId: string = req.params.cityId
            let {
                time,
                sizeClock,
                limit,
                page
            }: { time: string, sizeClock: number, limit: number, page: number } = req.query
            const clock: void | sizeClock = await sizeLogic.CheckClock(next, sizeClock)
            if (clock === undefined) {
                return next(ApiError.NotFound("clock not found"))
            }
            let endHour = Number(new Date(time).getUTCHours()) + Number(clock.date.slice(0, 2))
            let endTime = new Date(new Date(time).setUTCHours(endHour, 0, 0))
            page = page || 1
            limit = limit || 12
            let offset = page * limit - limit
            let masters: { rows: master[]; count: number };

            masters = await master.findAndCountAll({
                order:[['id', 'DESC']],
                where: {
                    isActivated: {[is]: true}
                }, include: [{
                    model: city,
                    where: {id: cityId},
                    through: {
                        attributes: []
                    }
                }, {
                    model: order, where: {
                        [not]: [{
                            [or]: [{
                                [and]: [{time: {[lt]: time}}, {endTime: {[lte]: time}}]
                            }, {
                                [and]: [{time: {[gte]: endTime}}, {endTime: {[gt]: endTime}}]
                            }]
                        }]
                    }, required: false
                }]
            });

            masters.rows = masters.rows.filter(master => master.orders!.length == 0)
            masters.count = masters.rows.length
            masters.rows = masters.rows.slice(offset, page * limit)
            if (!masters.count) {
                return res.status(204).json({message: "List is empty"})
            }
            return res.status(200).json(masters)
        } catch (e) {
            next(ApiError.NotFound((e as Error).message))
        }
    }


    async checkOrders(next: NextFunction, masterId: number, time: Date, endTime: Date): Promise<master | null>{
        let masterCheck: master | null;
        masterCheck = await master.findByPk(masterId)
        if (!masterCheck) {
            next(ApiError.NotFound('master not found'))
        }
        masterCheck = await master.findOne({
            where: {id: masterId}, include: [{
                model: order, where: {
                    [not]: [{
                        [or]: [{
                            [and]: [{time: {[lt]: time}}, {endTime: {[lte]: time}}]
                        }, {
                            [and]: [{time: {[gte]: endTime}}, {endTime: {[gt]: endTime}}]
                        }]
                    }]
                },

            }],
        })
        if (masterCheck) {
            next(ApiError.NotFound('master not found'))
        }
        return masterCheck
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const {masterId} = req.params
            const {name, rating, cityId,} = req.body
            const masterUpdate = await master.findOne({where: {id: masterId}})
            if (masterUpdate == null) {
                return next(ApiError.badRequest("Wrong request"))
            }
            await master.update({
                name: name, rating: rating,
            }, {where: {id: masterId}})
            await masterUpdate.setCities(cityId)
            return master
        } catch (e) {
            return next(ApiError.badRequest("Wrong request"))
        }
    }

    async ratingUpdate(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>> {
        try {
            const result: [number, master[]] = await sequelize.transaction(async () => {
                const masterId: number = Number(req.params.masterId)
                let {orderId, userId}: { orderId: number, userId: number } = req.body
                let newRating: number = req.body.rating
                const existsRating: rating | null = await rating.findOne({where: {orderId: orderId}})
                if (existsRating) {
                    throw new Error("rating already exists")
                }
                await rating.create({rating: newRating, userId, masterId, orderId})
                let allRating: { rows: rating[], count: number } = await rating.findAndCountAll({
                    where: {masterId: masterId},
                    attributes: ["rating"]
                })
                newRating = allRating.rows.reduce((sum, current) => sum + current.rating, 0) / allRating.count

                const masterUpdate: [number, master[]] = await master.update({
                    rating: newRating,
                }, {where: {id: masterId}})
                return masterUpdate
            })
            return res.status(201).json(result)
        } catch (e) {
            return next(ApiError.badRequest("Wrong request"))
        }
    }


    async activate(req: Request, res: Response, next: NextFunction): Promise<void | [number, master[]] | null> {
        try {
            const {masterId} = req.params
            const {isActivated} = req.body
            const masterUpdate: [number, master[]] = await master.update({
                isActivated: isActivated,
            }, {where: {id: masterId}})
            return masterUpdate
        } catch (e) {
            return next(ApiError.badRequest("Wrong request"))
        }
    }

    async deleteOne(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>> {
        try {
            const masterId: string = req.params.masterId
            const masterDelete = await user.findOne({

                include: {
                    model: master, where: {id: masterId}, attributes: ['id'],
                    include: [master.associations.orders]
                }
            })
            if (masterDelete == null) {
                return next(ApiError.Conflict("city isn`t empty"))
            }
            if (masterDelete!.master!.orders!.length === 0) {
                await masterDelete.destroy()
                return res.status(204).json({message: "success"})
            } else {
                return next(ApiError.Conflict("city isn`t empty"))
            }
        } catch (e) {
            return next(ApiError.badRequest((e as Error).message))
        }
    }

}

export default new MasterLogic()