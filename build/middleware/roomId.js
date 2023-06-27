"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function default_1(req, res, next) {
    const id = req.header("roomId");
    if (!id)
        return res.json({
            status: `Failed`,
            message: `Not Room Code`
        });
    try {
        req.roomId = id;
        next();
    }
    catch (err) {
        return res.status(403).json({ error: "Failed" });
    }
}
exports.default = default_1;
