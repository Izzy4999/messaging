"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(io) {
    io.use((socket, next) => {
        const username = socket.handshake.auth.username;
        socket.username = username;
        next();
    });
    io.on("connection", function (socket) {
        let users = [];
        for (let [id, socket] of io.of("/").sockets) {
            users.push({
                userID: id,
                username: socket.username,
                connected: socket.connected
            });
        }
        socket.emit("users", users);
        socket.on("join", (roomCode) => {
            socket.join(roomCode);
        });
        socket.on("typing", (data) => socket.broadcast.emit("typingResponse", data));
        socket.on("private_message", function (message) {
            io.to(message.room_id).emit("response_message", message.value);
        });
        socket.on("disconnect", () => {
            users = users.filter((c) => c.username !== socket.username);
        });
    });
}
exports.default = default_1;
