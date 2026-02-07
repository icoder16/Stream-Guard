let io;

exports.initSocket = (server) => {
  const socketIO = require("socket.io");

  io = socketIO(server, {
    cors: {
      origin: "*"
    }
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
};

exports.getIO = () => {
  if (!io) {
    throw new Error("Socket not initialized");
  }
  return io;
};
