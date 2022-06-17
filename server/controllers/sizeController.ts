import sizeLogic from '../businessLogic/sizeLogic'
import {validationResult} from "express-validator";
import {Request, Response, NextFunction} from "express";


class sizeController {
    async create(req: Request, res: Response, next: NextFunction): Promise<Response | undefined> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        await sizeLogic.create(req, res, next)
    }

    async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        await sizeLogic.getAll(req, res, next)
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<Response | undefined> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        await sizeLogic.update(req, res, next)
    }

    async deleteOne(req: Request, res: Response, next: NextFunction): Promise<Response | undefined> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        await sizeLogic.deleteOne(req, res, next)
    }
}


export default new sizeController()

