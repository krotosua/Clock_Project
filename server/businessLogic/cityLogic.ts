import {City, Master} from '../models/models';
import ApiError from '../error/ApiError';
import {validationResult} from 'express-validator';
import {NextFunction, Request, Response} from "express";
import {CreateCityDTO, UpdateCityDTO} from "../dto/city.dto";
import {GetRowsDB, Pagination} from "../dto/global";


class CityLogic {

    async create(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({errors: errors.array()});
            }
            const cityInfo: CreateCityDTO = req.body;
            const newCity: City = await City.create(cityInfo);
            return res.status(200).json({newCity});
        } catch (e) {
            next(ApiError.badRequest((e as Error).message));
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            let pagination: Pagination = req.query as any;
            pagination.page = pagination.page || 1;
            pagination.limit = pagination.limit || 9;
            const offset = pagination.page * pagination.limit - pagination.limit;
            const cities: GetRowsDB<City> = await City.findAndCountAll({
                order: [['id', 'DESC']],
                limit: pagination.limit, offset
            })
            if (!cities.count) {
                return res.status(204).json({message: "List is empty"});
            }
            return res.status(200).json(cities)
        } catch (e) {
            next(ApiError.badRequest((e as Error).message));
        }
    }

    async checkMasterCityId(id: number[]): Promise<void | object> {
        const cityCheck: City[] = await City.findAll({where: {id}})
        if (cityCheck.length !== id.length || cityCheck.length === 0) {
            return ApiError.badRequest("WRONG CityId")
        }
    }

    async checkCityId(id: number, next: NextFunction): Promise<void | City> {
        const cityCheck: City | null = await City.findByPk(id);
        if (!cityCheck) {
            return next(ApiError.badRequest("WRONG CityId"));
        }
        return cityCheck;
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<Response | Promise<any>> {
        try {
            const cityId: string = req.params.cityId;
            const cityInfo: UpdateCityDTO = req.body;
            const cityUpdate = await City.update(cityInfo, {where: {id: cityId}});
            return res.status(201).json(cityUpdate);
        } catch (e) {
            return next(ApiError.badRequest((e as Error).message));
        }
    }

    async deleteOne(req: Request, res: Response, next: NextFunction): Promise<Response | Promise<any>> {
        try {
            const cityId: string = req.params.cityId;

            if (cityId) {
                const cityDelete: City | null = await City.findOne({
                    where: {id: cityId},
                    include: Master,
                    attributes: ["id"]
                })
                if (cityDelete === null || cityDelete.masters === undefined) {
                    return next(ApiError.badRequest("Id is empty"));
                }
                if (cityDelete.masters.length === 0) {
                    await cityDelete.destroy();
                    return res.status(204).json({message: "success"});
                } else {
                    return next(ApiError.Conflict("City isn`t empty"));
                }
            } else {
                return next(ApiError.badRequest("Id is empty"));
            }
        } catch (e) {
            return next(ApiError.badRequest((e as Error).message));
        }
    }
}


export default new CityLogic();

