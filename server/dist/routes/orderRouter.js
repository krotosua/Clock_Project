"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderController_1 = __importDefault(require("../controllers/orderController"));
const checkRoleMiddleware_1 = __importDefault(require("../middleware/checkRoleMiddleware"));
const express_validator_1 = require("express-validator");
const orderRouter = (0, express_1.Router)();
orderRouter.post("/", (0, express_validator_1.body)("name").not().isEmpty().isString().trim().escape(), (0, express_validator_1.body)("email").isEmail().isString().trim().escape(), (0, express_validator_1.body)("time").not().isEmpty(), (0, express_validator_1.body)("price").not().isEmpty().not().isString().isInt({ gt: 0 }), (0, express_validator_1.body)("cityId").not().isEmpty().not().isString().isInt({ gt: 0 }), (0, express_validator_1.body)("masterId").not().isEmpty().not().isString().isInt({ gt: 0 }), (0, express_validator_1.body)("sizeClockId").not().isEmpty().not().isString().isInt({ gt: 0 }), orderController_1.default.create);
orderRouter.get('/:userId', (0, checkRoleMiddleware_1.default)("CUSTOMER"), (0, express_validator_1.param)("userId").not().isEmpty().isInt({ gt: 0 }), orderController_1.default.getUserOrders);
orderRouter.get('/Master/:userId', (0, checkRoleMiddleware_1.default)("MASTER"), (0, express_validator_1.param)("userId").not().isEmpty().isInt({ gt: 0 }), orderController_1.default.getMasterOrders);
orderRouter.get('/', (0, checkRoleMiddleware_1.default)("ADMIN"), orderController_1.default.getAllOrders);
orderRouter.put("/:orderId", (0, express_validator_1.param)("orderId").not().isEmpty().isInt({ gt: 0 }), (0, express_validator_1.body)("name").not().isEmpty().isString().trim().escape(), (0, express_validator_1.body)("email").isEmail().isString().trim().escape(), (0, express_validator_1.body)("time").not().isEmpty(), (0, express_validator_1.body)("price").not().isEmpty().not().isString().isInt({ gt: 0 }), (0, express_validator_1.body)("cityId").not().isEmpty().not().isString().isInt({ gt: 0 }), (0, express_validator_1.body)("masterId").not().isEmpty().not().isString().isInt({ gt: 0 }), (0, express_validator_1.body)("sizeClockId").not().isEmpty().not().isString().isInt({ gt: 0 }), (0, checkRoleMiddleware_1.default)("ADMIN"), orderController_1.default.update);
orderRouter.put("/statusChange/:orderId", (0, express_validator_1.param)("orderId").not().isEmpty().isInt({ gt: 0 }), orderController_1.default.statusChange);
orderRouter.delete("/:orderId", (0, express_validator_1.param)("orderId").not().isEmpty().isInt({ gt: 0 }), (0, checkRoleMiddleware_1.default)("ADMIN"), orderController_1.default.deleteOne);
exports.default = orderRouter;
