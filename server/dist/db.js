"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cls_hooked_1 = __importDefault(require("cls-hooked"));
const sequelize_1 = require("sequelize");
const namespace = cls_hooked_1.default.createNamespace('my-namespace');
sequelize_1.Sequelize.useCLS(namespace);
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbHost = process.env.DB_HOST;
const dbPort = Number(process.env.DB_PORT);
const dbDriver = 'postgres';
const dbPassword = process.env.DB_PASSWORD;
const sequelizeConnection = new sequelize_1.Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    port: dbPort,
    dialect: dbDriver,
});
exports.default = sequelizeConnection;
