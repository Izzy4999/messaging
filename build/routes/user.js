"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../middleware/auth"));
const user_controller_1 = require("../controller/user.controller");
const router = (0, express_1.Router)();
router.get("/me", auth_1.default, user_controller_1.onGetUser);
router.get("/all", auth_1.default, user_controller_1.onGetAllUser);
router.post("/signup", user_controller_1.onSignUp);
router.post("/login", user_controller_1.onLogin);
router.post("/request", auth_1.default, user_controller_1.onRecieveRequest);
router.post("/A_request", auth_1.default, user_controller_1.onAcceptRequest);
router.post("/r_request", auth_1.default, user_controller_1.onRejectRequest);
router.get("/:id", auth_1.default, user_controller_1.onGetUpdatedUser);
router.delete("/me", auth_1.default, user_controller_1.onDelete);
exports.default = router;
