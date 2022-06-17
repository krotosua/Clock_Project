import {master, city, CityInput} from '../models/models'
import ApiError from '../error/ApiError'
import {validationResult} from 'express-validator'
import {Request, Response, NextFunction} from "express";


class CityLogic {

    async create(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({errors: errors.array()});
            }
            const {name, price}: CityInput = req.body;
            const newCity: city = await city.create({name, price});
            return res.status(200).json({newCity});
        } catch (e) {
            next(ApiError.badRequest((e as Error).message));
        }
    }

    async getAll(req: any, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            let {limit, page}: { limit: number, page: number } = req.query;
            page = page || 1;
            limit = limit || 9;
            let offset = page * limit - limit;
            const cities: { count: number, rows: Array<city> } = await city.findAndCountAll({
                order: [['id', 'DESC']],
                limit, offset
            })
            if (!cities.count) {
                return res.status(204).json({message: "List is empty"})
            }
            return res.status(200).json(cities)
        } catch (e) {
            next(ApiError.badRequest((e as Error).message))
        }
    }

    async checkMasterCityId(id: number[]): Promise<void | object> {
        const cityCheck: city[] = await city.findAll({where: {id}})
        if (cityCheck.length !== id.length || cityCheck.length === 0) {
            return ApiError.badRequest("WRONG CityId")
        }
    }

    async checkCityId(id: number, next: NextFunction): Promise<void | city> {
        const cityCheck: city | null = await city.findByPk(id)
        if (!cityCheck) {
            return next(ApiError.badRequest("WRONG CityId"))
        }
        return cityCheck
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<Response | Promise<any>> {
        try {
            const cityId: string = req.params.cityId
            const {name, price}: CityInput = req.body
            const cityUpdate = await city.update({name, price}, {where: {id: cityId}})
            return res.status(201).json(cityUpdate)
        } catch (e) {
            return next(ApiError.badRequest((e as Error).message))
        }
    }

    async deleteOne(req: Request, res: Response, next: NextFunction): Promise<Response | Promise<any>> {
        try {
            const cityId: string = req.params.cityId

            if (cityId) {
                const cityDelete: city | null = await city.findOne({
                    where: {id: cityId},
                    include: master,
                    attributes: ["id"]
                })
                if (cityDelete == null || cityDelete.masters == undefined) {
                    return next(ApiError.badRequest("Id is empty"))
                }
                if (cityDelete.masters.length === 0) {
                    await cityDelete.destroy()
                    return res.status(204).json({message: "success"})
                } else {
                    return next(ApiError.Conflict("city isn`t empty"))
                }
            } else {
                return next(ApiError.badRequest("Id is empty"))
            }
        } catch (e) {
            return next(ApiError.badRequest((e as Error).message))
        }
    }
}


export default new CityLogic()

