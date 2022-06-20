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
const express_validator_1 = require("express-validator");
class CityLogic {
    create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ errors: errors.array() });
                }
                const payload = req.body;
                const newCity = yield models_1.City.create(payload);
                return res.status(200).json({ newCity });
            }
            catch (e) {
                next(ApiError_1.default.badRequest(e.message));
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
                const cities = yield models_1.City.findAndCountAll({
                    order: [['id', 'DESC']],
                    limit: pagination.limit, offset
                });
                if (!cities.count) {
                    return res.status(204).json({ message: "List is empty" });
                }
                return res.status(200).json(cities);
            }
            catch (e) {
                next(ApiError_1.default.badRequest(e.message));
            }
        });
    }
    checkMasterCityId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const cityCheck = yield models_1.City.findAll({ where: { id } });
            if (cityCheck.length !== id.length || cityCheck.length === 0) {
                return ApiError_1.default.badRequest("WRONG CityId");
            }
        });
    }
    checkCityId(id, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const cityCheck = yield models_1.City.findByPk(id);
            if (!cityCheck) {
                return next(ApiError_1.default.badRequest("WRONG CityId"));
            }
            return cityCheck;
        });
    }
    update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cityId = req.params.cityId;
                const payload = req.body;
                const cityUpdate = yield models_1.City.update(payload, { where: { id: cityId } });
                return res.status(201).json(cityUpdate);
            }
            catch (e) {
                return next(ApiError_1.default.badRequest(e.message));
            }
        });
    }
    deleteOne(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cityId = req.params.cityId;
                if (cityId) {
                    const cityDelete = yield models_1.City.findOne({
                        where: { id: cityId },
                        include: models_1.Master,
                        attributes: ["id"]
                    });
                    if (cityDelete === null || cityDelete.masters === undefined) {
                        return next(ApiError_1.default.badRequest("Id is empty"));
                    }
                    if (cityDelete.masters.length === 0) {
                        yield cityDelete.destroy();
                        return res.status(204).json({ message: "success" });
                    }
                    else {
                        return next(ApiError_1.default.Conflict("City isn`t empty"));
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
exports.default = new CityLogic();
