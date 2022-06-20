import userLogic from '../businessLogic/userLogic';
import {Result, ValidationError, validationResult} from "express-validator";
import {NextFunction, Request, Response} from "express";
import {ReqQuery} from "../dto/global";


class UserController {
    async registration(req: Request, res: Response, next: NextFunction): Promise<void> {
        await userLogic.registration(req, res, next)
    }


    async registrationFromAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
        await userLogic.registrationFromAdmin(req, res, next)
    }

    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        await userLogic.login(req, res, next)
    }

    async check(req: Request, res: Response): Promise<void> {
        await userLogic.check(req, res)
    }

    async checkEmail(req: ReqQuery<{ email: string }>, res: Response): Promise<void> {
        await userLogic.checkEmail(req, res)
    }

    async getAll(req: ReqQuery<{ page: number, limit: number }>, res: Response, next: NextFunction): Promise<void> {
        await userLogic.getAll(req, res, next)
    }

    async deleteOne(req: Request, res: Response, next: NextFunction): Promise<void> {
        await userLogic.deleteOne(req, res, next)
    }

    async activate(req: Request, res: Response, next: NextFunction): Promise<void> {
        await userLogic.activate(req, res, next)
    }


    async activateAdmin(req: Request, res: Response, next: NextFunction): Promise<Response<Result<ValidationError>> | void> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        await userLogic.activateAdmin(req, res, next)
    }

    async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        await userLogic.updateUser(req, res, next)
    }

}


export default new UserController()