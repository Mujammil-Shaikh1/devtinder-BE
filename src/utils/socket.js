const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");

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

    socket.on("sendMessage", async ({ messagePayload }) => {
      try {
        if (messagePayload) {
          const { userId, toUserId, message,
            profilePic,
            fullName,
            userName } = messagePayload;
          const roomId = createRoomId(userId, toUserId);
          let chat = await Chat.findOne({
            participants: {
              $all: [userId, toUserId]
            }
          });

          if (!chat) {
            chat = new Chat({
              participants: [userId, toUserId],
              messages: []
            })
          }
          chat.messages.push({
            senderId: userId,
            message,
            profilePic,
            fullName,
            userName
          })
          await chat.save();
          io.to(roomId).emit("messageRecieved", { ...messagePayload });
        }
      } catch (err) {
        console.log(err)
      }

    });
  });
};

module.exports = initlializeSocket;
