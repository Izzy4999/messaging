"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onUpdateMessage = exports.onSendMessage = exports.onGetMessage = void 0;
const message_1 = require("../models/message");
const encryption_1 = __importDefault(require("../utils/encryption"));
const onGetMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const message = yield message_1.Message.findOne({
        roomCode: { $regex: req.roomId, $options: "i" },
    });
    if (!message)
        return res.status(404).json({
            status: "failed",
            message: "no message",
        });
    res.status(200).json({
        status: `success`,
        data: message,
    });
});
exports.onGetMessage = onGetMessage;
const onSendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let newMessage = new message_1.Message({
        messages: [],
        roomCode: req.body.id,
    });
    yield newMessage.save();
    return res.status(200).json({
        status: "success",
        data: newMessage,
    });
});
exports.onSendMessage = onSendMessage;
const onUpdateMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let encryptedMessage = (0, encryption_1.default)(req.body.message);
    const message = yield message_1.Message.updateOne({ roomCode: { $regex: req.roomId, $options: "i" } }, {
        $push: {
            messages: {
                message: encryptedMessage,
                from: req.body.from,
                time: req.body.time,
                date: req.body.date,
                isRead: req.body.isRead
            },
        },
    });
    return res.status(200).json({
        status: "success",
        data: message,
    });
});
exports.onUpdateMessage = onUpdateMessage;
