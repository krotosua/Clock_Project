const jwt = require('jsonwebtoken')
const ApiError = require("../error/ApiError");

module.exports = function (role) {
    return function (req, res, next) {
        if (req.method === "OPTIONS") {
            next()
        }
        try {
            const token = req.headers.authorization.split(' ')[1] // Bearer asfasnfkajsfnjk
            if (!token) {
                next(ApiError.Unauthorized({message: "No token"}))
            }
            const decoded = jwt.verify(token, process.env.SECRET_KEY)
            if (decoded.role !== role) {
                return next(ApiError.forbidden({message: "No access"}))
            }
            req.user = decoded;
            next()
        } catch (e) {
            next(ApiError.Unauthorized({message: "No access"}))
        }
    };
}