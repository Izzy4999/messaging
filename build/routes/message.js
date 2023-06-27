"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const message_controller_1 = require("../controller/message.controller");
const auth_1 = __importDefault(require("../middleware/auth"));
const roomId_1 = __importDefault(require("../middleware/roomId"));
const router = (0, express_1.Router)();
router.get('/', [auth_1.default, roomId_1.default], message_controller_1.onGetMessage);
// router.get("/all",[auth,],getAllUserRoomMessages)
router.post('/', auth_1.default, message_controller_1.onSendMessage);
router.post("/update", [auth_1.default, roomId_1.default], message_controller_1.onUpdateMessage);
exports.default = router;
