"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const socket_io_1 = __importDefault(require("./utils/socket.io"));
const socket_io_2 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const user_1 = __importDefault(require("./routes/user"));
const message_1 = __importDefault(require("./routes/message"));
const db_1 = __importDefault(require("./db"));
dotenv_1.default.config();
(0, db_1.default)();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/users", user_1.default);
app.use("/messages", message_1.default);
let http = require("http").createServer(app);
let io = new socket_io_2.Server(http, {
    cors: {
        origin: "*",
    },
});
(0, socket_io_1.default)(io);
const port = process.env.PORT || 3000;
http.listen(port, () => {
    console.log(`listening on port ${port}`);
});
