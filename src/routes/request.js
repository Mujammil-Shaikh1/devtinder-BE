const express = require("express");
const requestRouter = express.Router();
const userAuth = require("../middlewares/auth");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const status = req.params.status;
    const toUserId = req.params.toUserId;
    const fromUserId = user._id;
    let validStatus = ["interested", "ignored"];
    if (!validStatus.includes(status)) {
      return res.status(400).json({
        message: `${status} status is not allowed`
      })
    }
    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(400).json({
        message: "Connect request could not be sent to never existing user"
      })
    }

    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId }
      ]
    })

    if (existingConnectionRequest) {
      return res.status(400).json({
        message: "Connection request already exists"
      })
    }
    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status
    })
    const request = await connectionRequest.save();

    res.json({
      message: "connection request sent successfully",
      data: request
    })
  } catch (err) {
    res.status(400).send(err.message);
  }

})

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {

  try {
    const { status, requestId } = req.params;
    const loggedInUser = req.user;
    const isValidStatus = ["accepted", "rejected"];

    if (!isValidStatus.includes(status)) {
      return res.send("Invalid status type " + status)
    }

    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: 'interested',
    })
    if (!connectionRequest) {
      return res.status(404).send("Connection request not found");
    }

    connectionRequest.status = status;
    await connectionRequest.save()
    res.send("request " + status + " successfully")
  } catch (err) {
    res.status(400).send(err.message);
  }
})


module.exports = requestRouter