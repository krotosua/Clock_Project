"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sizeController_1 = __importDefault(require("../controllers/sizeController"));
const checkRoleMiddleware_1 = __importDefault(require("../middleware/checkRoleMiddleware"));
const express_validator_1 = require("express-validator");
const sizeRouter = express_1.default.Router();
sizeRouter.post("/", (0, express_validator_1.body)("name").not().isEmpty().isString().trim().escape(), (0, express_validator_1.body)("date").not().isEmpty().isString(), (0, checkRoleMiddleware_1.default)("ADMIN"), sizeController_1.default.create);
sizeRouter.get('/', sizeController_1.default.getAll);
sizeRouter.put('/:sizeId', (0, express_validator_1.param)("sizeId").not().isEmpty().isInt({ gt: 0 }), (0, express_validator_1.body)("name").not().isEmpty().isString().trim().escape(), (0, express_validator_1.body)("date").not().isEmpty().isString(), (0, checkRoleMiddleware_1.default)("ADMIN"), sizeController_1.default.update);
sizeRouter.delete('/:sizeId', (0, express_validator_1.param)("sizeId").not().isEmpty().isInt({ gt: 0 }), (0, checkRoleMiddleware_1.default)("ADMIN"), sizeController_1.default.deleteOne);
exports.default = sizeRouter;
