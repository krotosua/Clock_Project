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
class SizeLogic {
    create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, date } = req.body;
                const size = yield models_1.sizeClock.create({ name, date });
                return res.status(201).json(size);
            }
            catch (e) {
                next(ApiError_1.default.badRequest(e.message));
            }
        });
    }
    update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sizeId = req.params.sizeId;
                const { name, date } = req.body;
                const size = yield models_1.sizeClock.update({
                    name: name,
                    date: date
                }, { where: { id: sizeId } });
                return res.status(201).json(size);
            }
            catch (e) {
                return next(ApiError_1.default.badRequest(e.message));
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
                let sizes;
                sizes = yield models_1.sizeClock.findAndCountAll({
                    limit, offset
                });
                if (!sizes.count) {
                    return res.status(204).json({ message: "List is empty" });
                }
                return res.status(200).json(sizes);
            }
            catch (e) {
                next(ApiError_1.default.badRequest(e.message));
            }
        });
    }
    CheckClock(next, sizeClockId) {
        return __awaiter(this, void 0, void 0, function* () {
            const clock = yield models_1.sizeClock.findOne({ where: { id: sizeClockId } });
            if (!clock) {
                return next(ApiError_1.default.badRequest('WRONG sizeClockId'));
            }
            return clock;
        });
    }
    deleteOne(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sizeId = req.params.sizeId;
                if (sizeId) {
                    const size = yield models_1.sizeClock.findOne({
                        where: { id: sizeId },
                        include: models_1.order,
                        attributes: ["id"]
                    });
                    if (size == null || size.orders == undefined) {
                        return next(ApiError_1.default.badRequest("Id is empty"));
                    }
                    if (size.orders.length == 0) {
                        yield size.destroy();
                        return res.status(204).json("success");
                    }
                    else {
                        return next(ApiError_1.default.Conflict("Clock has orders"));
                    }
                }
                else {
                    return next(ApiError_1.default.badRequest("Id is empty"));
                }
            }
            catch (e) {
                return next(ApiError_1.default.badRequest(e.message));
            }
        });
    }
}
exports.default = new SizeLogic();
