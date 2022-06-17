import masterLogic from '../businessLogic/masterLogic'
import cityLogic from '../businessLogic/cityLogic'
import ApiError from "../error/ApiError";
import sequelize from "../db";
import {validationResult} from"express-validator";
import {Request, Response, NextFunction} from "express";

class MasterController {
    async create(req: Request, res: Response, next: NextFunction): Promise<any> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        try {
            const {cityId} = req.body
            await cityLogic.checkMasterCityId(cityId)
            const master = await masterLogic.create(req, res, next)
            return master
        } catch (e) {
            next(ApiError.badRequest("WRONG request"))
        }
    }


    async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        await masterLogic.getAll(req, res, next)
    }

    async getMastersForOrder(req: Request, res: Response, next: NextFunction): Promise<Response | undefined>  {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        await masterLogic.getMastersForOrder(req, res, next)
    }


    async update(req: Request, res: Response, next: NextFunction): Promise<Response | undefined>  {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        try {
            const result = await sequelize.transaction(async () => {
                const {cityId} = req.body
                await cityLogic.checkMasterCityId(cityId)
                const master = await masterLogic.update(req, res, next)
                return master
            })
            return res.status(201).json(result)
        } catch (e) {
            next(ApiError.badRequest(( e as Error).message))
        }
    }

    async activate(req: Request, res: Response, next: NextFunction): Promise<Response | undefined>  {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        try {
            const master = await masterLogic.activate(req, res, next)
            return res.status(201).json(master)
        } catch (e) {
            next(ApiError.badRequest((e as Error).message))
        }
    }

    async ratingUpdate(req: Request, res: Response, next: NextFunction): Promise<Response | undefined>  {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        try {
            const result = await sequelize.transaction(async () => {
                const master = await masterLogic.ratingUpdate(req, res, next)
                return master
            })
            return res.status(201).json(result)
        } catch (e) {
            next(ApiError.badRequest((e as Error).message))
        }
    }

    async deleteOne(req: Request, res: Response, next: NextFunction): Promise<Response | undefined> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        await masterLogic.deleteOne(req, res, next)
    }

}

export default new MasterController()