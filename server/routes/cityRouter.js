"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cityRouter = (0, express_1.Router)();
const express_validator_1 = require("express-validator");
const cityController_1 = __importDefault(require("../controllers/cityController"));
const checkRoleMiddleware_1 = __importDefault(require("../middleware/checkRoleMiddleware"));
cityRouter.post("/", (0, express_validator_1.body)("name").not().isEmpty().isString().trim().escape(), (0, checkRoleMiddleware_1.default)("ADMIN"), cityController_1.default.create);
cityRouter.put('/:cityId', (0, express_validator_1.body)("name").not().isEmpty().isString().trim().escape(), (0, express_validator_1.param)("cityId").not().isEmpty().isInt({ gt: 0 }), (0, checkRoleMiddleware_1.default)("ADMIN"), cityController_1.default.update);
cityRouter.delete('/:cityId', (0, express_validator_1.param)("cityId").not().isEmpty().isInt({ gt: 0 }), (0, checkRoleMiddleware_1.default)("ADMIN"), cityController_1.default.deleteOne);
cityRouter.get('/', cityController_1.default.getAll);
exports.default = cityRouter;
