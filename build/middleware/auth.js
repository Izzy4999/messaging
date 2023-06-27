"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { PRIVATE_KEY } = process.env;
function default_1(req, res, next) {
    const token = req.header("user-token");
    if (!token)
        return res.status(403).json({
            status: `Failed`,
            message: `Not allowed`,
        });
    try {
        const decoded = jsonwebtoken_1.default.verify(token, PRIVATE_KEY);
        req.user = decoded;
        next();
    }
    catch (err) {
        res.status(403).json({
            status: `Failed`,
            message: `Invalid token`,
        });
    }
}
exports.default = default_1;
