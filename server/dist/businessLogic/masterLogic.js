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
const sequelize_1 = require("sequelize");
const sizeLogic_1 = __importDefault(require("./sizeLogic"));
const db_1 = __importDefault(require("../db"));
const { and, lt, lte, not, is, or, gt, gte } = sequelize_1.Op;
class MasterLogic {
    create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, rating, isActivated } = req.body;
                const { userId, cityId } = req.body;
                const newMaster = yield models_1.master.create({ name, rating, userId, isActivated });
                yield newMaster.addCities(cityId);
                return newMaster;
            }
            catch (e) {
                next(ApiError_1.default.badRequest(e.message));
            }
        });
    }
    getAll(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { limit, page } = req.query;
                page = page || 1;
                limit = limit || 12;
                let offset = page * limit - limit;
                let masters = yield models_1.master.findAndCountAll({
                    order: [['id', 'DESC']],
                    attributes: ['name', "rating", "id", "isActivated"],
                    include: [{
                            model: models_1.city, through: {
                                attributes: []
                            },
                        }, { model: models_1.user, }],
                });
                if (!masters.count) {
                    return res.status(204).json("List is empty");
                }
                masters.count = masters.rows.length;
                masters.rows = masters.rows.slice(offset, page * limit);
                return res.json(masters);
            }
            catch (e) {
                return next(ApiError_1.default.NotFound(e.message));
            }
        });
    }
    getMastersForOrder(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cityId = req.params.cityId;
                let { time, sizeClock, limit, page } = req.query;
                const clock = yield sizeLogic_1.default.CheckClock(next, sizeClock);
                if (clock === undefined) {
                    return next(ApiError_1.default.NotFound("clock not found"));
                }
                let endHour = Number(new Date(time).getUTCHours()) + Number(clock.date.slice(0, 2));
                let endTime = new Date(new Date(time).setUTCHours(endHour, 0, 0));
                page = page || 1;
                limit = limit || 12;
                let offset = page * limit - limit;
                let masters;
                masters = yield models_1.master.findAndCountAll({
                    order: [['id', 'DESC']],
                    where: {
                        isActivated: { [is]: true }
                    }, include: [{
                            model: models_1.city,
                            where: { id: cityId },
                            through: {
                                attributes: []
                            }
                        }, {
                            model: models_1.order, where: {
                                [not]: [{
                                        [or]: [{
                                                [and]: [{ time: { [lt]: time } }, { endTime: { [lte]: time } }]
                                            }, {
                                                [and]: [{ time: { [gte]: endTime } }, { endTime: { [gt]: endTime } }]
                                            }]
                                    }]
                            }, required: false
                        }]
                });
                masters.rows = masters.rows.filter(master => master.orders.length == 0);
                masters.count = masters.rows.length;
                masters.rows = masters.rows.slice(offset, page * limit);
                if (!masters.count) {
                    return res.status(204).json({ message: "List is empty" });
                }
                return res.status(200).json(masters);
            }
            catch (e) {
                next(ApiError_1.default.NotFound(e.message));
            }
        });
    }
    checkOrders(next, masterId, time, endTime) {
        return __awaiter(this, void 0, void 0, function* () {
            let masterCheck;
            masterCheck = yield models_1.master.findByPk(masterId);
            if (!masterCheck) {
                next(ApiError_1.default.NotFound('master not found'));
            }
            masterCheck = yield models_1.master.findOne({
                where: { id: masterId }, include: [{
                        model: models_1.order, where: {
                            [not]: [{
                                    [or]: [{
                                            [and]: [{ time: { [lt]: time } }, { endTime: { [lte]: time } }]
                                        }, {
                                            [and]: [{ time: { [gte]: endTime } }, { endTime: { [gt]: endTime } }]
                                        }]
                                }]
                        },
                    }],
            });
            if (masterCheck) {
                next(ApiError_1.default.NotFound('master not found'));
            }
            return masterCheck;
        });
    }
    update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { masterId } = req.params;
                const { name, rating, cityId, } = req.body;
                const masterUpdate = yield models_1.master.findOne({ where: { id: masterId } });
                if (masterUpdate == null) {
                    return next(ApiError_1.default.badRequest("Wrong request"));
                }
                yield models_1.master.update({
                    name: name, rating: rating,
                }, { where: { id: masterId } });
                yield masterUpdate.setCities(cityId);
                return models_1.master;
            }
            catch (e) {
                return next(ApiError_1.default.badRequest("Wrong request"));
            }
        });
    }
    ratingUpdate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db_1.default.transaction(() => __awaiter(this, void 0, void 0, function* () {
                    const masterId = Number(req.params.masterId);
                    let { orderId, userId } = req.body;
                    let newRating = req.body.rating;
                    const existsRating = yield models_1.rating.findOne({ where: { orderId: orderId } });
                    if (existsRating) {
                        throw new Error("rating already exists");
                    }
                    yield models_1.rating.create({ rating: newRating, userId, masterId, orderId });
                    let allRating = yield models_1.rating.findAndCountAll({
                        where: { masterId: masterId },
                        attributes: ["rating"]
                    });
                    newRating = allRating.rows.reduce((sum, current) => sum + current.rating, 0) / allRating.count;
                    const masterUpdate = yield models_1.master.update({
                        rating: newRating,
                    }, { where: { id: masterId } });
                    return masterUpdate;
                }));
                return res.status(201).json(result);
            }
            catch (e) {
                return next(ApiError_1.default.badRequest("Wrong request"));
            }
        });
    }
    activate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { masterId } = req.params;
                const { isActivated } = req.body;
                const masterUpdate = yield models_1.master.update({
                    isActivated: isActivated,
                }, { where: { id: masterId } });
                return masterUpdate;
            }
            catch (e) {
                return next(ApiError_1.default.badRequest("Wrong request"));
            }
        });
    }
    deleteOne(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const masterId = req.params.masterId;
                const masterDelete = yield models_1.user.findOne({
                    include: {
                        model: models_1.master, where: { id: masterId }, attributes: ['id'],
                        include: [models_1.master.associations.orders]
                    }
                });
                if (masterDelete == null) {
                    return next(ApiError_1.default.Conflict("city isn`t empty"));
                }
                if (masterDelete.master.orders.length === 0) {
                    yield masterDelete.destroy();
                    return res.status(204).json({ message: "success" });
                }
                else {
                    return next(ApiError_1.default.Conflict("city isn`t empty"));
                }
            }
            catch (e) {
                return next(ApiError_1.default.badRequest(e.message));
            }
        });
    }
}
exports.default = new MasterLogic();
