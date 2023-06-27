"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAuthToken = exports.validateLogin = exports.validate = exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const joi_1 = __importDefault(require("joi"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { PRIVATE_KEY } = process.env;
const userSchema = new mongoose_1.default.Schema({
    firstName: {
        type: String,
        required: true,
        min: 6,
        max: 220,
    },
    lastName: {
        type: String,
        required: true,
        min: 6,
        max: 220,
    },
    DOB: {
        type: Date,
    },
    password: {
        type: String,
        min: 6,
        max: 12,
        required: true,
    },
    userName: {
        type: String,
        min: 4,
        max: 13,
    },
    DOC: {
        type: Date,
        default: Date.now,
    },
    email: {
        type: String,
        required: true,
    },
    friends: {
        type: Array,
        default: [],
    },
    requests: {
        type: Array,
        default: [],
    },
    sentRequest: {
        type: Array,
        default: [],
    },
});
const User = mongoose_1.default.model("User", userSchema);
exports.User = User;
function generateAuthToken(email, id, userName) {
    const token = jsonwebtoken_1.default.sign({
        id,
        email,
        userName,
    }, PRIVATE_KEY);
    return token;
}
exports.generateAuthToken = generateAuthToken;
function validate(user) {
    const schema = joi_1.default.object({
        firstName: joi_1.default.string().required().min(3).max(220),
        lastName: joi_1.default.string().required().min(3).max(220),
        email: joi_1.default.string()
            .email({
            minDomainSegments: 2,
            tlds: { allow: ["com", "net"] },
        })
            .required(),
        password: joi_1.default.string()
            .required()
            .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
            .min(6)
            .max(12),
        repeat_password: joi_1.default.ref("password"),
        DOB: joi_1.default.date(),
        DOC: joi_1.default.date(),
        userName: joi_1.default.string().required().min(4).max(12),
    });
    return schema.validate(user);
}
exports.validate = validate;
function validateLogin(user) {
    const schema = joi_1.default.object({
        userName: joi_1.default.string().min(4).max(50),
        password: joi_1.default.string()
            .required()
            .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
            .min(6)
            .max(12),
    });
    return schema.validate(user);
}
exports.validateLogin = validateLogin;
