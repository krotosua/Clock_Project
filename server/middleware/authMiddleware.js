const jwt = require('jsonwebtoken')
const ApiError = require("../error/ApiError");

module.exports = function (req, res, next) {
    if (req.method === "OPTIONS") {
        next()
    }
    try {
        const token = req.headers.authorization.split(' ')[1] // Bearer asfasnfkajsfnjk
        if (!token) {
            next(ApiError.Unauthorized({message: "No token"}))
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        req.user = decoded
        next()
    } catch (e) {
        next(ApiError.Unauthorized({message: "Unauthorized"}))
    }
};