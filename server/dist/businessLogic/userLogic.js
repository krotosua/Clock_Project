"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ApiError_1 = __importDefault(require("../error/ApiError"));
const models_1 = require("../models/models");
const bcrypt = __importStar(require("bcrypt"));
const express_validator_1 = require("express-validator");
const mailService_1 = __importDefault(require("../service/mailService"));
const uuid_1 = require("uuid");
const masterController_1 = __importDefault(require("../controllers/masterController"));
const db_1 = __importDefault(require("../db"));
const generateJwt = (id, email, role, isActivated, name) => {
    return jsonwebtoken_1.default.sign({ id, email, role, isActivated, name }, process.env.SECRET_KEY, { expiresIn: '24h' });
};
class UserLogic {
    registration(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            try {
                const result = yield db_1.default.transaction(() => __awaiter(this, void 0, void 0, function* () {
                    const { email, password, isMaster, name } = req.body;
                    const role = isMaster ? "MASTER" : "CUSTOMER";
                    const candidate = yield models_1.User.findOne({ where: { email } });
                    if (candidate) {
                        if (candidate.password !== null) {
                            return next(ApiError_1.default.badRequest('User with this email already exists'));
                        }
                        yield models_1.Customer.create({ userId: candidate.id, name: name });
                        const hashPassword = yield bcrypt.hash(password, 5);
                        const activationLink = (0, uuid_1.v4)();
                        yield candidate.update({ password: hashPassword, activationLink, role });
                        yield mailService_1.default.sendActivationMail(email, `${process.env.API_URL}api/users/activate/${activationLink}`, next);
                        return res.status(201).json(candidate);
                    }
                    const hashPassword = yield bcrypt.hash(password, 5);
                    const activationLink = (0, uuid_1.v4)();
                    const newUser = yield models_1.User.create({ email, role, password: hashPassword, activationLink });
                    if (isMaster) {
                        req.body.userId = newUser.id;
                        yield masterController_1.default.create(req, res, next);
                    }
                    else {
                        yield models_1.Customer.create({ userId: newUser.id, name });
                    }
                    yield mailService_1.default.sendActivationMail(email, `${process.env.API_URL}api/users/activate/${activationLink}`, next);
                    return res.status(201).json({ newUser });
                }));
                return result;
            }
            catch (e) {
                next(ApiError_1.default.badRequest(e.message));
            }
        });
    }
    registrationFromAdmin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                req.body.isActivated = true;
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ errors: errors.array() });
                }
                const result = yield db_1.default.transaction(() => __awaiter(this, void 0, void 0, function* () {
                    const { email, password, isMaster, name, isActivated } = req.body;
                    const role = isMaster ? "MASTER" : "CUSTOMER";
                    const candidate = yield models_1.User.findOne({ where: { email } });
                    if (candidate) {
                        if (candidate.password !== null) {
                            return next(ApiError_1.default.badRequest('User with this email already exists'));
                        }
                        else {
                            yield models_1.Customer.create({ userId: candidate.id, name: name });
                            const hashPassword = yield bcrypt.hash(password, 5);
                            const token = generateJwt(candidate.id, candidate.email, candidate.role);
                            return res.json({ token });
                        }
                    }
                    const hashPassword = yield bcrypt.hash(password, 5);
                    const newUser = yield models_1.User.create({ email, role, password: hashPassword, isActivated });
                    if (isMaster) {
                        req.body.userId = newUser.id;
                        yield masterController_1.default.create(req, res, next);
                    }
                    else {
                        yield models_1.Customer.create({ userId: newUser.id, name });
                    }
                    return res.status(201).json({ newUser });
                }));
                return result;
            }
            catch (e) {
                next(ApiError_1.default.badRequest(e.message));
            }
        });
    }
    GetOrCreateUser(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, name, regCustomer, changeName } = req.body;
                const candidate = yield models_1.User.findOne({ where: { email } });
                if (candidate) {
                    if (changeName && candidate.password !== null) {
                        yield models_1.Customer.update({ name: name }, { where: { userId: candidate.id } });
                    }
                    return candidate;
                }
                let newUser;
                if (regCustomer) {
                    const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
                    const passwordLength = 8;
                    let password = "";
                    for (let i = 0; i <= passwordLength; i++) {
                        const randomNumber = Math.floor(Math.random() * chars.length);
                        password += chars.substring(randomNumber, randomNumber + 1);
                    }
                    const hashPassword = yield bcrypt.hash(password, 5);
                    req.body.password = password;
                    newUser = yield models_1.User.create({ email, password: hashPassword, isActivated: true });
                    yield models_1.Customer.create({ userId: newUser.id, name });
                }
                else {
                    newUser = yield models_1.User.create({ email });
                }
                return newUser;
            }
            catch (e) {
                throw new Error('Email is wrong');
            }
        });
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ errors: errors.array() });
                }
                const { email, password } = req.body;
                const userLogin = yield models_1.User.findOne({
                    where: { email },
                });
                if (!userLogin) {
                    return next(ApiError_1.default.NotFound('Customer with this name not found'));
                }
                const comparePassword = bcrypt.compareSync(password, userLogin.password);
                if (!comparePassword) {
                    return next(ApiError_1.default.Unauthorized('Wrong password'));
                }
                userLogin.role == "MASTER" ? yield userLogin.getMaster() : yield userLogin.getCustomer();
                let token;
                if (userLogin.master !== undefined) {
                    token = generateJwt(userLogin.id, userLogin.email, userLogin.role, userLogin.isActivated, userLogin.master.name);
                }
                else if (userLogin.customer !== undefined) {
                    token = generateJwt(userLogin.id, userLogin.email, userLogin.role, userLogin.isActivated, userLogin.customer.name);
                }
                else {
                    token = generateJwt(userLogin.id, userLogin.email, userLogin.role, userLogin.isActivated);
                }
                return res.status(201).json({ token });
            }
            catch (e) {
                next(ApiError_1.default.badRequest(e.message));
            }
        });
    }
    check(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = generateJwt(req.user.id, req.user.email, req.user.role, req.user.isActivated, req.user.name);
            return res.status(200).json({ token });
        });
    }
    checkEmail(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const email = req.query.email;
            const userCheck = yield models_1.User.findOne({ where: { email: email } });
            if (!userCheck || userCheck.password == null) {
                return res.status(204).send({ message: "204" });
            }
            return res.status(200).json({ userCheck });
        });
    }
    updateUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                const { email, password } = req.body;
                let hashPassword;
                if (password) {
                    hashPassword = yield bcrypt.hash(password, 5);
                }
                const userUpdate = yield models_1.User.update({
                    email: email, password: hashPassword,
                }, { where: { id: userId } });
                yield mailService_1.default.updateMail(email, password !== null && password !== void 0 ? password : undefined, next);
                return res.status(201).json({ userUpdate });
            }
            catch (e) {
                return next(ApiError_1.default.badRequest("Wrong request"));
            }
        });
    }
    getAll(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let pagination = req.query;
                pagination.page = pagination.page || 1;
                pagination.limit = pagination.limit || 9;
                const offset = pagination.page * pagination.limit - pagination.limit;
                const users = yield models_1.User.findAndCountAll({
                    attributes: ["email", "id", "role", "isActivated"], include: [{
                            model: models_1.Master
                        },], limit: pagination.limit, offset
                });
                if (!users.count) {
                    return res.status(204).json({ message: "List is empty" });
                }
                return res.status(200).json(users);
            }
            catch (e) {
                next(ApiError_1.default.badRequest(e.message));
            }
        });
    }
    deleteOne(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            try {
                const userId = Number(req.params.userId);
                const userDelete = yield models_1.User.findOne({
                    where: { id: userId },
                    include: [
                        { model: models_1.Order },
                        {
                            model: models_1.Master, attributes: ["id"],
                        }
                    ],
                    attributes: ["id", "role"]
                });
                if (userDelete == null)
                    return next(ApiError_1.default.Conflict("Customer has orders"));
                if (userDelete.role === "CUSTOMER" && userDelete.orders.length === 0 || userDelete.role === "MASTER" && userDelete.master.orders.length === 0) {
                    yield userDelete.destroy();
                    return res.status(204).json({ message: "success" });
                }
                else {
                    return next(ApiError_1.default.Conflict("Customer has orders"));
                }
                return res.status(204).json("success");
            }
            catch (e) {
                return next(ApiError_1.default.badRequest(e.message));
            }
        });
    }
    activate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const activationLink = req.params.link;
                const userActivate = yield models_1.User.findOne({ where: { activationLink } });
                if (!userActivate) {
                    throw new Error('Wrong link');
                }
                userActivate.isActivated = true;
                yield userActivate.save();
                return res.redirect(process.env.CLIENT_URL);
            }
            catch (e) {
                return next(ApiError_1.default.badRequest(e.message));
            }
        });
    }
    activateAdmin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                const isActivated = req.body.isActivated;
                const userActivate = yield models_1.User.update({
                    isActivated: isActivated,
                }, { where: { id: userId } });
                return res.status(201).json(userActivate);
            }
            catch (e) {
                return next(ApiError_1.default.badRequest("Wrong request"));
            }
        });
    }
}
exports.default = new UserLogic();
