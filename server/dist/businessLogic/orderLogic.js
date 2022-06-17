"use strict";
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
const models_1 = require("../models/models");
const ApiError_1 = __importDefault(require("../error/ApiError"));
const mailService_1 = __importDefault(require("../service/mailService"));
const sequelize_1 = require("sequelize");
const statusList = {
    WAITING: "WAITING",
    REJECTED: "REJECTED",
    ACCEPTED: "ACCEPTED",
    DONE: "DONE",
};
class OrderLogic {
    create(req, next, userId, time, endTime) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, sizeClockId, masterId, cityId, price } = req.body;
                const newOrder = yield models_1.order.create({ name, sizeClockId, userId, time, endTime, masterId, cityId, price });
                return newOrder;
            }
            catch (e) {
                return next(ApiError_1.default.badRequest(e.message));
            }
        });
    }
    getUserOrders(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                let { limit, page } = req.query;
                page = page || 1;
                limit = limit || 12;
                let offset = page * limit - limit;
                let orders;
                orders = yield models_1.order.findAndCountAll({
                    order: [['id', 'DESC']],
                    where: { userId: userId },
                    include: [{
                            model: models_1.master,
                            attributes: ['name'],
                        }, {
                            model: models_1.sizeClock,
                            attributes: ['name'],
                        },
                        {
                            model: models_1.rating,
                            attributes: ["rating"],
                        }], limit, offset
                });
                if (!orders.count) {
                    return res.status(204).json({ message: "List is empty" });
                }
                return res.status(200).json(orders);
            }
            catch (e) {
                next(ApiError_1.default.badRequest(e.message));
            }
        });
    }
    getMasterOrders(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                let { limit, page } = req.query;
                page = page || 1;
                limit = limit || 12;
                const offset = page * limit - limit;
                let orders;
                let masterFind = yield models_1.master.findOne({
                    where: { userId: userId },
                    attributes: ['id', "isActivated"]
                });
                if (masterFind === null || !masterFind.isActivated) {
                    return next(ApiError_1.default.forbidden("Doesn`t activated"));
                }
                orders = yield models_1.order.findAndCountAll({
                    order: [['id', 'DESC']],
                    where: {
                        masterId: masterFind.id,
                        status: {
                            [sequelize_1.Op.or]: ["ACCEPTED", "DONE"]
                        }
                    },
                    include: [{
                            model: models_1.master,
                            attributes: ['name'],
                        }, {
                            model: models_1.sizeClock,
                            attributes: ['name'],
                        }], limit, offset
                });
                if (!orders.count) {
                    return res.status(204).json({ message: "List is empty" });
                }
                return res.status(200).json(orders);
            }
            catch (e) {
                next(ApiError_1.default.badRequest(e.message));
            }
        });
    }
    getAllOrders(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { limit, page } = req.query;
                page = page || 1;
                limit = limit || 12;
                let offset = page * limit - limit;
                let orders;
                orders = yield models_1.order.findAndCountAll({
                    order: [['id', 'DESC']],
                    include: [{
                            model: models_1.master,
                        }, {
                            model: models_1.sizeClock,
                            attributes: ['name'],
                        }, {
                            model: models_1.user,
                            attributes: ['email'],
                        }], limit, offset
                });
                if (!orders.count) {
                    return res.status(204).json({ message: "List is empty" });
                }
                return res.status(200).json(orders);
            }
            catch (e) {
                return next(ApiError_1.default.badRequest(e.message));
            }
        });
    }
    update(req, res, next, userId, time, endTime) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orderId = req.params.orderId;
                const { name, sizeClockId, masterId, cityId, price } = req.body;
                if (orderId <= 0) {
                    next(ApiError_1.default.badRequest("cityId is wrong"));
                }
                const orderUpdate = yield models_1.order.update({
                    name,
                    sizeClockId,
                    time,
                    endTime,
                    masterId,
                    cityId,
                    userId,
                    price
                }, { where: { id: orderId } });
                return orderUpdate;
            }
            catch (e) {
                return next(ApiError_1.default.badRequest(e.message));
            }
        });
    }
    statusChange(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orderId = req.params.orderId;
                const status = req.body.status;
                if (!(status in statusList)) {
                    return next(ApiError_1.default.badRequest("INVALID STATUS"));
                }
                if (orderId <= "0") {
                    return next(ApiError_1.default.badRequest("cityId is wrong"));
                }
                const orderUpdate = yield models_1.order.update({
                    status: status,
                }, { where: { id: orderId } });
                return orderUpdate;
            }
            catch (e) {
                next(ApiError_1.default.badRequest(e.message));
            }
        });
    }
    deleteOne(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orderId = req.params.orderId;
                yield models_1.order.destroy({ where: { id: orderId } });
                return res.status(204).json({ message: "success" });
            }
            catch (e) {
                return next(ApiError_1.default.badRequest(e.message));
            }
        });
    }
    sendMessage(req, next, result) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cityName = result.city.name;
                const size = result.clock.name;
                let { name, email, masterId, password } = req.body;
                let { time } = req.body;
                const masterMail = yield models_1.master.findByPk(masterId);
                if (!masterMail) {
                    return next(ApiError_1.default.badRequest("masterId is wrong"));
                }
                time = new Date(time).toLocaleString("uk-UA");
                mailService_1.default.sendMail(name, time, email, size, masterMail.name, cityName, password, next);
            }
            catch (e) {
                return next(ApiError_1.default.badRequest(e.message));
            }
        });
    }
}
exports.default = new OrderLogic();
