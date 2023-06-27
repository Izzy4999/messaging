"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const URI = "mongodb+srv://root:Test123@cluster0.hw8gzdw.mongodb.net/?retryWrites=true&w=majority";
const dbConnection = () => {
    mongoose_1.default.connect(URI, () => {
        console.log(`db is connected`);
    });
};
exports.default = dbConnection;
