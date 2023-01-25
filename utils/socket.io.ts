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
    console.log(`USER connected`);
    let users:users[] = [];
    for (let [id, socket] of io.of("/").sockets) {
      users.push({
        userID: id,
        username: socket.username,
        connected:socket.connected
      });
    }
    console.log(users)
    socket.emit("users", users);
    socket.on("join", (roomCode: string) => {
      console.log(roomCode);
      socket.join(roomCode);
    });
    socket.on("typing", (data: any) =>
      socket.broadcast.emit("typingResponse", data)
    );
    socket.on("private_message", function (message: Message) {
      console.log(message);
      io.to(message.room_id).emit("response_message", message.value);
    });
    socket.on("disconnect", () => {
      console.log("user disconnected");
      users = users.filter((c)=>c.username !== socket.username)
    });
  });
}
