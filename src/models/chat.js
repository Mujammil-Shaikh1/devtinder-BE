const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    message: {
      type: String,
      required: true
    },
    profilePic: {
      type: String,
      required: true
    },
    fullName: {
      type: String,
      required: true
    },
    userName: {
      type: String,
      required: true
    }
  }, { timestamps: true }
);

const chatSchema = mongoose.Schema(
  {
    participants: [
      { type: mongoose.Schema.Types.ObjectId }
    ],
    messages: [messageSchema]
  }
)


const Chat = mongoose.model("chat", chatSchema);
module.exports = { Chat }