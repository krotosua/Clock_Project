"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const masterRouter = (0, express_1.Router)();
const masterController_1 = __importDefault(require("../controllers/masterController"));
const checkRoleMiddleware_1 = __importDefault(require("../middleware/checkRoleMiddleware"));
const express_validator_1 = require("express-validator");
masterRouter.post("/", (0, express_validator_1.body)("name").not().isEmpty().isString().trim().escape(), (0, express_validator_1.body)("rating").not().isEmpty().not().isString().isInt({ gt: -1, lt: 6 }), (0, express_validator_1.body)("cityId").not().isEmpty().isArray(), (0, checkRoleMiddleware_1.default)("ADMIN"), masterController_1.default.create);
masterRouter.get('/', masterController_1.default.getAll);
masterRouter.get('/:cityId', (0, express_validator_1.param)("cityId").not().isEmpty().isInt({ gt: 0 }), (0, express_validator_1.query)("time").not().isEmpty().isString(), masterController_1.default.getMastersForOrder);
masterRouter.put('/:masterId', (0, express_validator_1.param)("masterId").not().isEmpty().isInt({ gt: 0 }), (0, express_validator_1.body)("name").not().isEmpty().isString().trim().escape(), (0, express_validator_1.body)("rating").not().isEmpty().not().isString().isInt({ gt: -1, lt: 6 }), (0, express_validator_1.body)("cityId").not().isEmpty().isArray(), (0, checkRoleMiddleware_1.default)("ADMIN"), masterController_1.default.update);
masterRouter.put('/activate/:masterId', (0, express_validator_1.param)("masterId").not().isEmpty().isInt({ gt: 0 }), (0, express_validator_1.body)("isActivated").not().isEmpty().isBoolean(), (0, checkRoleMiddleware_1.default)("ADMIN"), masterController_1.default.activate);
masterRouter.put('/rating/:masterId', (0, express_validator_1.param)("masterId").not().isEmpty().isInt({ gt: 0 }), (0, checkRoleMiddleware_1.default)("CUSTOMER"), masterController_1.default.ratingUpdate);
masterRouter.delete('/:masterId', (0, express_validator_1.param)("masterId").not().isEmpty().isInt({ gt: 0 }), (0, checkRoleMiddleware_1.default)("ADMIN"), masterController_1.default.deleteOne);
exports.default = masterRouter;
