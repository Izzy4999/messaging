"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_js_1 = __importDefault(require("crypto-js"));
const encrypt = (toEncrypt) => {
    const encrypted = crypto_js_1.default.AES.encrypt(toEncrypt, "secret key 123").toString();
    return encrypted;
};
exports.default = encrypt;
