import {City, Master, Order, Rating, SizeClock, User} from '../models/models'
import ApiError from '../error/ApiError'
import {Op} from "sequelize";
import sizeLogic from "./sizeLogic"
import sequelize from "../db"
import {NextFunction, Request, Response} from "express";
import {CreateMasterDTO, GetMasterDTO, UpdateMasterDTO} from "../dto/master.dto";
import {CreateRatingDTO} from "../dto/rating.dto";
import {GetRowsDB, Pagination, ReqQuery, UpdateDB} from "../dto/global";

const {and, lt, lte, not, is, or, gt, gte} = Op;

class MasterLogic {
    async create(req: Request, res: Response, next: NextFunction): Promise<Master | void> {
        try {
            const masterInfo: CreateMasterDTO = req.body;
            const newMaster: Master = await Master.create(masterInfo);
            await newMaster.addCities(masterInfo.cityId);
            return newMaster;
        } catch (e) {
            next(ApiError.badRequest((e as Error).message));
            return
        }
    }

    async getAll(req: ReqQuery<{ page: number, limit: number }>, res: Response, next: NextFunction): Promise<Response<GetRowsDB<Master> | { message: string }> | void> {
        try {
            let {limit, page}: Pagination = req.query;
            page = page || 1;
            limit = limit || 12;
            const offset = page * limit - limit;
            let masters: GetRowsDB<Master> = await Master.findAndCountAll({
                order: [['id', 'DESC']],
                attributes: ['name', "rating", "id", "isActivated"],
                include: [{
                    model: City, through: {
                        attributes: []
                    },

                }, {model: User}],
            })

            if (!masters.count) {
                return res.status(204).json({message: "List is empty"});
            }
            masters.count = masters.rows.length;
            masters.rows = masters.rows.slice(offset, page * limit);
            return res.json(masters);
        } catch (e) {
            next(ApiError.NotFound((e as Error).message));
            return
        }
    }

    async getMastersForOrder(req: Request<{ cityId: string }> & ReqQuery<{ page: number, limit: number, time: Date, sizeClock: number }>,
                             res: Response, next: NextFunction): Promise<void | Response<GetRowsDB<Master> | { message: string }>> {
        try {
            const cityId: string = req.params.cityId;
            let {
                time,
                limit,
                page
            }: GetMasterDTO = req.query;
            const sizeClock: number = req.query.sizeClock;
            const clock: void | SizeClock = await sizeLogic.CheckClock(next, sizeClock);
            if (clock === undefined) {
                return next(ApiError.NotFound("clock not found"));
            }
            const endHour = Number(new Date(time).getUTCHours()) + Number(clock.date.slice(0, 2));
            const endTime = new Date(new Date(time).setUTCHours(endHour, 0, 0));
            page = page || 1;
            limit = limit || 12;
            const offset = page * limit - limit;
            let masters: GetRowsDB<Master>;
            masters = await Master.findAndCountAll({
                order: [['id', 'DESC']],
                where: {
                    isActivated: {[is]: true}
                }, include: [{
                    model: City,
                    where: {id: cityId},
                    through: {
                        attributes: []
                    }
                }, {
                    model: Order, where: {
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
            masters.rows = masters.rows.filter(master => master.orders!.length === 0);
            masters.count = masters.rows.length;
            masters.rows = masters.rows.slice(offset, page * limit);
            if (!masters.count) {
                return res.status(204).json({message: "List is empty"});
            }
            return res.status(200).json(masters);
        } catch (e) {
            next(ApiError.NotFound((e as Error).message));
            return
        }
    }

    async checkOrders(next: NextFunction, masterId: number, time: Date, endTime: Date): Promise<Master | void | null> {
        const masterCheck: Master | null = await Master.findOne({
            where: {id: masterId}, include: [{
                model: Order, where: {
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
            next(ApiError.NotFound('Master not found'));
            return
        }
        return masterCheck;
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<void | Master> {
        try {
            const masterId: number = Number(req.params.masterId);
            const updateInfo: UpdateMasterDTO = req.body;
            const masterUpdate = await Master.findOne({where: {id: masterId}});
            if (masterUpdate === null) {
                return next(ApiError.badRequest("Wrong request"));
            }
            await Master.update(updateInfo, {where: {id: masterId}})
            await masterUpdate.setCities(updateInfo.cityId);
            return masterUpdate
        } catch (e) {
            next(ApiError.badRequest("Wrong request"));
            return
        }
    }

    async ratingUpdate(req: Request, res: Response, next: NextFunction): Promise<void | Response<UpdateDB<Master> | void>> {
        try {
            const result: UpdateDB<Master> | void = await sequelize.transaction(async () => {
                const masterId: number = Number(req.params.masterId);
                const {orderId, userId, review}: CreateRatingDTO = req.body;
                let newRating: number = req.body.rating;
                const existsRating: Rating | null = await Rating.findOne({where: {orderId: orderId}});
                if (existsRating) {
                    next(ApiError.badRequest("Wrong request"));
                    return
                }
                await Rating.create({rating: newRating, review, userId, masterId, orderId});
                let allRating: GetRowsDB<Rating> = await Rating.findAndCountAll({
                    where: {masterId: masterId},
                    attributes: ["rating"]
                })
                newRating = allRating.rows.reduce((sum, current) => sum + current.rating, 0) / allRating.count;
                const masterUpdate: UpdateDB<Master> = await Master.update({
                    rating: newRating,
                }, {where: {id: masterId}})
                return masterUpdate;
            })
            return res.status(201).json(result);
        } catch (e) {
            next(ApiError.badRequest("Wrong request"));
            return
        }
    }

    async getRatingReviews(req: Request<{ masterId: number }> & ReqQuery<{ page: number, limit: number }>,
                           res: Response, next: NextFunction) {
        try {
            const {masterId} = req.params
            let {limit, page} = req.query
            page = page || 1
            limit = limit || 5
            const offset = page * limit - limit
            const ratingReviews: any = await Rating.findAndCountAll({
                where: {masterId: masterId},
                order: [['id', 'DESC']],
                include: [{
                    model: User,
                    attributes: ["id"],

                }]
            })
            return res.status(200).json(ratingReviews)
        } catch (e) {
            return next(ApiError.badRequest("Wrong request"))
        }
    }


    async activate(req: Request, res: Response, next: NextFunction): Promise<void | UpdateDB<Master>> {
        try {
            const masterId: number = Number(req.params.masterId);
            const {isActivated}: UpdateMasterDTO = req.body;
            const masterUpdate: UpdateDB<Master> = await Master.update({
                isActivated,
            }, {where: {id: masterId}})
            return masterUpdate;
        } catch (e) {
            return next(ApiError.badRequest("Wrong request"));
        }
    }

    async deleteOne(req: Request, res: Response, next: NextFunction): Promise<void | Response<{ message: string }>> {
        try {
            const masterId: number = Number(req.params.masterId);
            const masterDelete: User | null = await User.findOne({
                include: {
                    model: Master, where: {id: masterId}, attributes: ['id'],
                    include: [Master.associations.orders]
                }
            })
            if (masterDelete === null || masterDelete.master === undefined
                || masterDelete.master.orders === undefined) {
                next(ApiError.Conflict("City isn`t empty"));
                return
            }
            if (masterDelete.master.orders.length === 0) {
                await masterDelete.destroy();
                return res.status(204).json({message: "success"});
            } else {
                next(ApiError.Conflict("Master isn`t empty"));
                return
            }
        } catch (e) {
            next(ApiError.badRequest((e as Error).message));
            return
        }
    }

}

export default new MasterLogic();