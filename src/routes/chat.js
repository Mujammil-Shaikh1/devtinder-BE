const express = require("express");
const userAuth = require("../middlewares/auth");
const chatRouter = express.Router();
const { Chat } = require("../models/chat")


chatRouter.get("/chat/:id", userAuth, async (req, res) => {
  try {
    const userId = req?.user?._id
    const toUserId = req.params.id

    let chats = await Chat.findOne({
      participants: {
        $all: [userId, toUserId]
      }
    });
    if (chats && chats?.messages) {
      res.send(chats?.messages)
    }
    else {
      res.send([])
    }
  } catch (err) {
    console.log("err", err);
  }
})


module.exports = chatRouter