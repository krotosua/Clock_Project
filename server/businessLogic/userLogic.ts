import jwt from "jsonwebtoken"
import ApiError from "../error/ApiError"
import {user, order, master, customer, UserInput} from "../models/models"
import * as bcrypt from "bcrypt"
import {validationResult} from "express-validator"
import MailService from "../service/mailService"
import {v4 as uuidv4} from "uuid"
import masterController from "../controllers/masterController"
import sequelize from "../db"
import {Request, Response, NextFunction} from "express";


const generateJwt = (id: number, email: string, role: string, isActivated?: boolean, name?: string): string => {
    return jwt.sign({id, email, role, isActivated, name}, process.env.SECRET_KEY as string, {expiresIn: '24h'})
}

class UserLogic {
    async registration(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        try {
            const result: void | Response<any, Record<string, any>> = await sequelize.transaction(async () => {
                const {
                    email,
                    password,
                    isMaster,
                    name
                }: { email: string, password: string, isMaster: boolean, name: string } = req.body
                const role: string = isMaster ? "MASTER" : "CUSTOMER"
                const candidate: user | null = await user.findOne({where: {email}})
                if (candidate) {
                    if (candidate.password !== null) {
                        return next(ApiError.badRequest('user with this email already exists'))
                    }
                    await customer.create({userId: candidate.id, name: name})
                    const hashPassword: string = await bcrypt.hash(password, 5)
                    const activationLink = uuidv4()
                    await candidate.update({password: hashPassword, activationLink, role})
                    await MailService.sendActivationMail(email, `${process.env.API_URL}api/users/activate/${activationLink}`, next)
                    return res.status(201).json(candidate)
                }
                const hashPassword = await bcrypt.hash(password, 5)
                const activationLink = uuidv4()
                const newUser: user | null = await user.create({email, role, password: hashPassword, activationLink})
                if (isMaster) {
                    req.body.userId = newUser.id
                    await masterController.create(req, res, next)
                } else {
                    await customer.create({userId: newUser.id, name})
                }
                await MailService.sendActivationMail(email, `${process.env.API_URL}api/users/activate/${activationLink}`, next)
                return res.status(201).json({newUser})
            })
            return result
        } catch (e) {
            next(ApiError.badRequest((e as Error).message))
        }
    }


    async registrationFromAdmin(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>> {

        try {
            req.body.isActivated = true
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({errors: errors.array()});
            }
            const result: void | Response<any, Record<string, any>> = await sequelize.transaction(async () => {
                const {email, password, isMaster, name, isActivated} = req.body
                let role = isMaster ? "MASTER" : "CUSTOMER"
                const candidate = await user.findOne({where: {email}})
                if (candidate) {
                    if (candidate.password !== null) {
                        return next(ApiError.badRequest('user with this email already exists'))
                    } else {
                        await customer.create({userId: candidate.id, name: name})
                        const hashPassword: string = await bcrypt.hash(password, 5)
                        await candidate.update(candidate, password)
                        const token = generateJwt(candidate.id, candidate.email, candidate.role)
                        return res.json({token})
                    }
                }
                const hashPassword = await bcrypt.hash(password, 5)
                const newUser = await user.create({email, role, password: hashPassword, isActivated})
                if (isMaster) {
                    req.body.userId = newUser.id
                    await masterController.create(req, res, next)
                } else {
                    await customer.create({userId: newUser.id, name})
                }
                return res.status(201).json({newUser})
            })
            return result
        } catch (e) {
            next(ApiError.badRequest((e as Error).message))
        }
    }

    async GetOrCreateUser(req: Request): Promise<user> {
        try {
            const {
                email,
                name,
                regCustomer,
                changeName
            }: { email: string, name: string, regCustomer: boolean, changeName: boolean } = req.body
            const candidate: user | null = await user.findOne({where: {email}})
            if (candidate) {
                if (changeName && candidate.password !== null) {
                    await customer.update({name: name}, {where: {userId: candidate.id}})
                }
                return candidate
            }
            let newUser: user | null
            if (regCustomer) {
                const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
                const passwordLength = 8;
                let password = "";
                for (let i = 0; i <= passwordLength; i++) {
                    const randomNumber = Math.floor(Math.random() * chars.length);
                    password += chars.substring(randomNumber, randomNumber + 1);
                }
                const hashPassword = await bcrypt.hash(password, 5)
                req.body.password = password
                newUser = await user.create({email, password: hashPassword, isActivated: true})
                await customer.create({userId: newUser.id, name})
            } else {
                newUser = await user.create({email})
            }
            return newUser
        } catch (e) {
            throw new Error('Email is wrong')
        }
    }


    async login(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>> {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({errors: errors.array()});
            }
            const {email, password}: { email: string, password: string } = req.body
            const userLogin: user | null = await user.findOne({
                where: {email},
            })
            if (!userLogin) {
                return next(ApiError.NotFound('customer with this name not found'))
            }
            const comparePassword: boolean = bcrypt.compareSync(password, userLogin.password)
            if (!comparePassword) {
                return next(ApiError.Unauthorized('Wrong password'))
            }
            userLogin.role == "MASTER" ? await userLogin!.getMaster() : await userLogin!.getCustomer()
            let token
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

    async check(req: any, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>> {
        const token = generateJwt(req.user.id, req.user.email, req.user.role, req.user.isActivated, req.user.name)
        return res.status(200).json({token})
    }

    async checkEmail(req: Request, res: Response, next: NextFunction) {
        const {email} = req.query
        const userCheck = await user.findOne({where: {email: email}})
        if (!userCheck || userCheck.password == null) {
            return res.status(204).send({message: "204"})
        }
        return res.status(200).json({userCheck})
    }

    async updateUser(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>> {
        try {
            const userId: string = req.params.userId
            const {email, password}: UserInput = req.body
            let hashPassword
            if (password) {
                hashPassword = await bcrypt.hash(password, 5)
            }
            const userUpdate = await user.update({
                email: email, password: hashPassword,
            }, {where: {id: userId}})
            await MailService.updateMail(email, password ?? undefined, next)
            return res.status(201).json({userUpdate})
        } catch (e) {
            return next(ApiError.badRequest("Wrong request"))
        }
    }

    async getAll(req: any, res: Response, next: NextFunction) {
        try {
            let {limit, page}: { limit: number, page: number } = req.query
            page = page || 1
            limit = limit || 12
            let offset = page * limit - limit
            let users
            users = await user.findAndCountAll({
                attributes: ["email", "id", "role", "isActivated"], include: [{
                    model: master
                },], limit, offset
            })
            if (!users.count) {
                return res.status(204).json({message: "List is empty"})
            }
            return res.status(200).json(users)
        } catch (e) {
            next(ApiError.badRequest((e as Error).message))
        }
    }

    async deleteOne(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        try {
            const userId: string = req.params.userId
            const userDelete: user | null = await user.findOne({
                where: {id: userId},
                include: [
                    {model: order},
                    {
                        model: master, attributes: ["id"],
                    }],
                attributes: ["id", "role"]
            })
            if (userDelete == null) return

            if (userDelete.role === "CUSTOMER" && userDelete.orders!.length === 0 || userDelete.role === "MASTER" && userDelete.master!.orders!.length === 0) {
                await userDelete.destroy()
                return res.status(204).json({message: "success"})
            } else {
                return next(ApiError.Conflict("customer has orders"))
            }
            return res.status(204).json("success")
        } catch (e) {
            return next(ApiError.badRequest((e as Error).message))
        }
    }

    async activate(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const activationLink: string = req.params.link
            const userActivate: user | null = await user.findOne({where: {activationLink}})
            if (!userActivate) {
                throw new Error('Wrong link')
            }
            userActivate.isActivated = true
            await userActivate.save()
            return res.redirect(process.env.CLIENT_URL as string)
        } catch (e) {
            return next(ApiError.badRequest((e as Error).message))
        }
    }

    async activateAdmin(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
        try {
            const userId: string = req.params.userId
            const isActivated: boolean = req.body.isActivated
            const userActivate: [number, user[]] = await user.update({
                isActivated: isActivated,
            }, {where: {id: userId}})
            return res.status(201).json(userActivate)
        } catch (e) {
            return next(ApiError.badRequest("Wrong request"))
        }
    }


}


export default new UserLogic()