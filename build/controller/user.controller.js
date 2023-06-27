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
exports.onGetUpdatedUser = exports.onRejectRequest = exports.onAcceptRequest = exports.onRecieveRequest = exports.onGetAllUser = exports.onGetUser = exports.onDelete = exports.onLogin = exports.onSignUp = void 0;
const user_1 = require("../models/user");
const bcrypt_1 = __importDefault(require("bcrypt"));
const onSignUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, user_1.validate)(req.body);
    if (error)
        return res.status(400).json({
            status: `Failed`,
            message: error.details[0].message,
        });
    const existedUser = yield user_1.User.findOne({ email: req.body.email });
    if (existedUser)
        return res.status(400).json({
            status: `failed`,
            message: `User already registered`,
        });
    const existedUserName = yield user_1.User.findOne({ userName: req.body.userName });
    if (existedUserName)
        return res.status(400).json({
            status: `Failed`,
            message: `Username taken`,
        });
    const hashedPassword = yield bcrypt_1.default.hash(req.body.password, 10);
    const user = new user_1.User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: hashedPassword,
        userName: req.body.userName,
        DOB: req.body.DOB,
        email: req.body.email,
        friends: [],
        requests: [],
    });
    yield user.save();
    const { firstName, lastName, userName, email, friends } = user;
    const token = (0, user_1.generateAuthToken)(email, user._id, userName);
    res.json({
        status: `Success`,
        data: {
            token,
            firstName,
            lastName,
            userName,
            email,
            friends,
        },
    });
});
exports.onSignUp = onSignUp;
const onLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userName, password } = req.body;
    const { error } = (0, user_1.validateLogin)(req.body);
    if (error)
        return res.status(401).json({
            status: `Failed`,
            message: error.details[0].message,
        });
    let userExist = yield user_1.User.findOne({ email: userName });
    if (!userExist) {
        userExist = yield user_1.User.findOne({ userName });
        if (!userExist)
            return res.status(400).json({
                status: `Failed`,
                message: `Invalid Username/Email or password`,
            });
    }
    const rightPassword = yield bcrypt_1.default.compare(password, userExist.password); // Object is possibly 'null' (for userExist.password);
    if (!rightPassword)
        return res.status(400).json({
            status: `failed`,
            message: `Invalid Username/Email or password`,
        });
    const token = (0, user_1.generateAuthToken)(userExist.email, userExist._id, userName);
    res.status(200).json({
        status: `Success`,
        data: {
            token,
            message: `Login Successful`,
            firstName: userExist.firstName,
            lastName: userExist.lastName,
            userName: userExist.userName,
            email: userExist.email,
        },
    });
});
exports.onLogin = onLogin;
const onDelete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.User.findByIdAndDelete(req.user._id).select("-_id -__v -password");
    res.json({
        status: `Success`,
        user,
    });
});
exports.onDelete = onDelete;
const onGetUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.User.findById(req.user.id).select("-__v -password");
    res.json({
        status: `Success`,
        user,
    });
});
exports.onGetUser = onGetUser;
const onGetAllUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.User.find({ $nor: [{ $and: [{ 'email': req.user.email }] }] }).select("-__v -password");
    res.status(200).json({
        status: "Success",
        users: user,
    });
});
exports.onGetAllUser = onGetAllUser;
const onRecieveRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userSendingRequest = yield user_1.User.updateOne({ _id: req.user.id }, {
        $push: {
            sentRequest: req.body.recievingRequest,
        },
    });
    if (!userSendingRequest)
        return res.status(400).json({
            status: "failed",
            message: `User does not Exist`,
        });
    const userRecievingRequest = yield user_1.User.updateOne({ _id: req.body.recievingRequest._id }, { $push: { requests: req.body.sendingRequest } });
    if (!userRecievingRequest)
        return res.status(400).json({
            status: "failed",
            message: `User does not Exist`,
        });
    return res.status(200).json({
        status: "success",
        data: { userSendingRequest, userRecievingRequest },
    });
});
exports.onRecieveRequest = onRecieveRequest;
const onAcceptRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userAcceptingRequest = yield user_1.User.updateOne({ _id: req.user.id }, {
        $push: { friends: { friend: req.body.friend, roomCode: req.body.roomCode } },
        $pull: { requests: { _id: req.body.friend._id } },
    });
    if (!userAcceptingRequest)
        return res.status(400).json({
            status: "failed",
            message: `User does not Exist`,
        });
    const userSentTheRequest = yield user_1.User.updateOne({ _id: req.body.friend._id }, {
        $push: { friends: { friend: req.body.acceptingUser, roomCode: req.body.roomCode } },
        $pull: { sentRequest: { _id: req.body.acceptingUser._id } },
    });
    if (!userSentTheRequest)
        return res.status(400).json({
            status: "failed",
            message: `User does not Exist`,
        });
    return res.status(200).json({
        status: "success",
        data: { userAcceptingRequest, userSentTheRequest },
    });
});
exports.onAcceptRequest = onAcceptRequest;
const onRejectRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userSendingRequest = yield user_1.User.updateOne({ _id: req.body.reciever._id }, {
        $pull: {
            requests: { _id: req.body.sender._id },
        },
    });
    if (!userSendingRequest)
        return res.status(400).json({
            status: "failed",
            message: `User does not Exist`,
        });
    const userRecievingRequest = yield user_1.User.updateOne({ _id: req.body.sender._id }, { $pull: { sentRequest: { _id: req.body.reciever._id } } });
    if (!userRecievingRequest)
        return res.status(400).json({
            status: "failed",
            message: `User does not Exist`,
        });
    return res.status(200).json({
        status: "success",
        data: { userSendingRequest, userRecievingRequest },
    });
});
exports.onRejectRequest = onRejectRequest;
const onGetUpdatedUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.User.findOne({ _id: req.params.id });
    if (!user)
        return res.status(400).json({
            status: "failed",
            message: `User does not Exist`,
        });
    res.status(200).json({
        status: "success",
        data: user
    });
});
exports.onGetUpdatedUser = onGetUpdatedUser;
