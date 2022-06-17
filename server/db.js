"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cls_hooked_1 = __importDefault(require("cls-hooked"));
const namespace = cls_hooked_1.default.createNamespace('my-namespace');
const sequelize_1 = require("sequelize");
sequelize_1.Sequelize.useCLS(namespace);
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbHost = process.env.DB_HOST;
const dbDriver = 'postgres';
const dbPassword = process.env.DB_PASSWORD;
const sequelizeConnection = new sequelize_1.Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    port: 5432,
    dialect: dbDriver,
});
exports.default = sequelizeConnection;
