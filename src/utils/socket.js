const socket = require("socket.io");
const crypto = require("crypto")

const createRoomId = (userId, toUserId) => {
  return crypto.createHash("sha256").
    update([userId, toUserId].sort().join("_")).
    digest("hex");
}

const initlializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ userId, toUserId, fullName }) => {
      const roomId = createRoomId(userId, toUserId);
      socket.join(roomId);
    });

    socket.on("sendMessage", ({ messagePayload }) => {
      const { userId, toUserId } = messagePayload;
      const roomId = createRoomId(userId, toUserId);
      io.to(roomId).emit("messageRecieved", { ...messagePayload });
    });
  });
};

module.exports = initlializeSocket;
