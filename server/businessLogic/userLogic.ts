import jwt from "jsonwebtoken"
import ApiError from "../error/ApiError"
import {Customer, Master, Order, User} from "../models/models"
import * as bcrypt from "bcrypt"
import {Result, ValidationError, validationResult} from "express-validator"
import MailService from "../service/mailService"
import {v4 as uuidv4} from "uuid"
import masterController from "../controllers/masterController"
import sequelize from "../db"
import {NextFunction, Request, Response} from "express";
import {CreateUserDTO, GetOrCreateUserDTO, LoginDTO, UpdateUserDTO} from "../dto/user.dto";
import {GetRowsDB, Pagination, ReqQuery, UpdateDB} from "../dto/global";


const generateJwt = (id: number, email: string, role: string, isActivated?: boolean, name?: string): string => {
    return jwt.sign({id, email, role, isActivated, name}, process.env.SECRET_KEY as string, {expiresIn: '24h'})
}

class UserLogic {
    async registration(req: Request, res: Response, next: NextFunction): Promise<void | Response<User | Result<ValidationError>>> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        try {
            const result: void | Response = await sequelize.transaction(async () => {
                const {
                    email,
                    password,
                    isMaster,
                    name
                }: CreateUserDTO = req.body
                const role: string = isMaster ? "MASTER" : "CUSTOMER"
                const candidate: User | null = await User.findOne({where: {email}})
                if (candidate) {
                    if (candidate.password !== null) {
                        return next(ApiError.badRequest('User with this email already exists'))
                    }
                    await Customer.create({userId: candidate.id, name: name})
                    const hashPassword: string = await bcrypt.hash(password, 5)
                    const activationLink: string = uuidv4()
                    await candidate.update({password: hashPassword, activationLink, role})
                    await MailService.sendActivationMail(email, `${process.env.API_URL}api/users/activate/${activationLink}`, next)
                    return res.status(201).json(candidate)
                }
                const hashPassword: string = await bcrypt.hash(password, 5)
                const activationLink: string = uuidv4()
                const newUser: User | null = await User.create({email, role, password: hashPassword, activationLink})
                if (isMaster) {
                    req.body.userId = newUser.id

                    await masterController.create(req, res, next)
                } else {
                    await Customer.create({userId: newUser.id, name})
                }
                await MailService.sendActivationMail(email, `${process.env.API_URL}api/users/activate/${activationLink}`, next)
                return res.status(201).json({newUser})
            })
            return result
        } catch (e) {
            next(ApiError.badRequest((e as Error).message))
        }
    }


    async registrationFromAdmin(req: Request, res: Response, next: NextFunction): Promise<void | Response<User | Result<ValidationError>>> {

        try {
            req.body.isActivated = true
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({errors: errors.array()});
            }
            const result: void | Response = await sequelize.transaction(async () => {
                const {email, password, isMaster, name, isActivated}: CreateUserDTO = req.body;
                const role: string = isMaster ? "MASTER" : "CUSTOMER";
                const candidate: User | null = await User.findOne({where: {email}})
                if (candidate) {
                    if (candidate.password !== null) {
                        return next(ApiError.badRequest('User with this email already exists'));
                    } else {
                        await Customer.create({userId: candidate.id, name: name});
                        const hashPassword: string = await bcrypt.hash(password, 5);
                        const token: string = generateJwt(candidate.id, candidate.email, candidate.role);
                        return res.json({token});
                    }
                }
                const hashPassword: string = await bcrypt.hash(password, 5)
                const newUser: User = await User.create({email, role, password: hashPassword, isActivated})
                if (isMaster) {
                    req.body.userId = newUser.id
                    await masterController.create(req, res, next)
                } else {
                    await Customer.create({userId: newUser.id, name})
                }
                return res.status(201).json({newUser})
            })
            return result
        } catch (e) {
            next(ApiError.badRequest((e as Error).message))
            return
        }
    }

    async GetOrCreateUser(req: Request): Promise<User> {
        try {
            const {
                email,
                name,
                regCustomer,
                changeName
            }: GetOrCreateUserDTO = req.body
            const candidate: User | null = await User.findOne({where: {email}})
            if (candidate) {
                if (changeName && candidate.password !== null) {
                    await Customer.update({name: name}, {where: {userId: candidate.id}})
                } else if (!regCustomer) {
                    return candidate
                }
            }
            let newUser: User | null
            if (regCustomer) {
                const chars: string = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
                const passwordLength: number = 8;
                let password: string = "";
                for (let i = 0; i <= passwordLength; i++) {
                    const randomNumber: number = Math.floor(Math.random() * chars.length);
                    password += chars.substring(randomNumber, randomNumber + 1);
                }
                const hashPassword: string = await bcrypt.hash(password, 5)
                req.body.password = password
                if (candidate) {
                    newUser = await candidate.update({password: hashPassword, isActivated: true})
                } else {
                    newUser = await User.create({email, password: hashPassword, isActivated: true})
                }
                await Customer.create({userId: newUser.id, name})
            } else {
                newUser = await User.create({email})
            }
            return newUser
        } catch (e) {
            throw new Error('Email is wrong')
        }
    }


    async login(req: Request, res: Response, next: NextFunction): Promise<void | Response<{ token: string }>> {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({errors: errors.array()});
            }
            const {email, password}: LoginDTO = req.body
            const userLogin: User | null = await User.findOne({
                where: {email},
            })
            if (!userLogin) {
                return next(ApiError.NotFound('Customer with this name not found'))
            }
            const comparePassword: boolean = bcrypt.compareSync(password, userLogin.password)
            if (!comparePassword) {
                return next(ApiError.Unauthorized('Wrong password'))
            }
            userLogin.role === "MASTER" ? await userLogin!.getMaster() : await userLogin!.getCustomer()
            let token: string
            if (userLogin.master !== undefined) {
                token = generateJwt(userLogin.id, userLogin.email, userLogin.role, userLogin.isActivated, userLogin.master.name)
            } else if (userLogin.customer !== undefined) {
                token = generateJwt(userLogin.id, userLogin.email, userLogin.role, userLogin.isActivated, userLogin.customer.name)
            } else {
                token = generateJwt(userLogin.id, userLogin.email, userLogin.role, userLogin.isActivated)
            }
            return res.status(201).json({token})
        } catch (e) {
            next(ApiError.badRequest((e as Error).message))
        }
    }

    async check(req: any, res: Response): Promise<Response<{ token: string }>> {
        const token: string = generateJwt(req.user.id, req.user.email, req.user.role, req.user.isActivated, req.user.name)
        return res.status(200).json({token})
    }

    async checkEmail(req: ReqQuery<{ email: string }>, res: Response): Promise<Response<User>> {
        const email: string = req.query.email
        const userCheck: User | null = await User.findOne({where: {email: email}})
        if (!userCheck || userCheck.password === null) {
            return res.status(204).send({message: "204"})
        }
        return res.status(200).json({userCheck})
    }

    async updateUser(req: Request, res: Response, next: NextFunction): Promise<void | Response<UpdateDB<User>>> {
        try {
            const userId: string = req.params.userId
            const {email, password}: UpdateUserDTO = req.body
            let hashPassword: string | undefined
            if (password) {
                hashPassword = await bcrypt.hash(password, 5)
            }
            const userUpdate: UpdateDB<User> = await User.update({
                email: email, password: hashPassword,
            }, {where: {id: userId}})
            await MailService.updateMail(email, password ?? undefined, next)
            return res.status(201).json({userUpdate})
        } catch (e) {
            next(ApiError.badRequest("Wrong request"))
            return
        }
    }

    async getAll(req: ReqQuery<{ page: number, limit: number }>, res: Response, next: NextFunction): Promise<void | Response<GetRowsDB<User> | { message: string }>> {
        try {
            let pagination: Pagination = req.query;
            pagination.page = pagination.page || 1;
            pagination.limit = pagination.limit || 9;
            const offset: number = pagination.page * pagination.limit - pagination.limit;
            const users: GetRowsDB<User> = await User.findAndCountAll({
                attributes: ["email", "id", "role", "isActivated"], include: [{
                    model: Master
                },], limit: pagination.limit, offset
            })
            if (!users.count) {
                return res.status(204).json({message: "List is empty"});
            }
            return res.status(200).json(users)
        } catch (e) {
            next(ApiError.badRequest((e as Error).message));
            return
        }
    }

    async deleteOne(req: Request, res: Response, next: NextFunction): Promise<void | Response<{ message: string }>> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        try {
            const userId: number = Number(req.params.userId);
            const userDelete: User | null = await User.findOne({
                where: {id: userId},
                include: [
                    {model: Order},
                    {
                        model: Master, attributes: ["id"],
                    }],
                attributes: ["id", "role"]
            })
            if (userDelete === null) return next(ApiError.Conflict("Customer has orders"));

            if (userDelete.role === "CUSTOMER" && userDelete.orders!.length === 0
                || userDelete.role === "MASTER" && userDelete.master!.orders!.length === 0) {
                await userDelete.destroy();
                return res.status(204).json({message: "success"});
            } else {
                next(ApiError.Conflict("Customer has orders"));
                return
            }
        } catch (e) {
            next(ApiError.badRequest((e as Error).message));
            return
        }
    }

    async activate(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const activationLink: string = req.params.link
            const userActivate: User | null = await User.findOne({where: {activationLink}})
            if (!userActivate) {
                next(ApiError.badRequest("Not activated"));
                return
            }
            userActivate.isActivated = true
            await userActivate.save()
            return res.redirect(process.env.CLIENT_URL as string)
        } catch (e) {
            next(ApiError.badRequest((e as Error).message))
            return
        }
    }

    async activateAdmin(req: Request, res: Response, next: NextFunction): Promise<void | Response<UpdateDB<User>>> {
        try {
            const userId: string = req.params.userId
            const isActivated: boolean = req.body.isActivated
            const userActivate: UpdateDB<User> = await User.update({
                isActivated: isActivated,
            }, {where: {id: userId}})
            return res.status(201).json(userActivate)
        } catch (e) {
            next(ApiError.badRequest("Wrong request"))
            return
        }
    }


}


export default new UserLogic()