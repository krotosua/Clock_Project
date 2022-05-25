const sizeLogic = require('../businessLogic/sizeLogic')
const {validationResult} = require("express-validator");

class sizeController {
    async create(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        await sizeLogic.create(req, res, next)

    }

    async getAll(req, res, next) {
        await sizeLogic.getAll(req, res, next)

    }


    async update(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        await sizeLogic.update(req, res, next)
    }

    async deleteOne(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        await sizeLogic.deleteOne(req, res, next)
    }
}


module.exports = new sizeController()

