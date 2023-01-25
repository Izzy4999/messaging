import express from "express";
import socketio from "./utils/socket.io";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import user from "./routes/user";
import message from "./routes/message";
import dbConnection from "./db";
dotenv.config();

dbConnection();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/users", user);
app.use("/messages", message);

let http = require("http").createServer(app);
let io = new Server(http, {
  cors: {
    origin: "*",
  },
});

socketio(io);
const port: unknown = process.env.PORT || 3000;

http.listen(port, () => {
  console.log(`listening on port ${port}`);
});
