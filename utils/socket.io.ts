interface Message {
  value: {
    from: string;
    date: Date;
    time: string;
    message: string;
  };
  room_id: string;
}
interface users {
  userID: string;
  username: string;
  connected: boolean;
}

export default function (io: any) {
  io.use((socket: any, next: any) => {
    const username = socket.handshake.auth.username;
    socket.username = username;
    next();
  });
  io.on("connection", function (socket: any) {
    let users:users[] = [];
    for (let [id, socket] of io.of("/").sockets) {
      users.push({
        userID: id,
        username: socket.username,
        connected:socket.connected
      });
    }
    socket.emit("users", users);
    socket.on("join", (roomCode: string) => {
      socket.join(roomCode);
    });
    socket.on("typing", (data: any) =>
      socket.broadcast.emit("typingResponse", data)
    );
    socket.on("private_message", function (message: Message) {
      io.to(message.room_id).emit("response_message", message.value);
    });
    socket.on("disconnect", () => {
      users = users.filter((c)=>c.username !== socket.username)
    });
  });
}
