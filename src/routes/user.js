const express = require("express");
const userRouter = express.Router();
const userAuth = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest")
const User = require("../models/user")
const PUBLIC_FIELDS = ["fullName", "userName", "profilePic", "age", "gender"]
userRouter.get("/user/requests", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", PUBLIC_FIELDS)
    res.send(connectionRequests)
  } catch (err) {
    res.status(400).send(err.message)
  }
})

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connections = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser },
        { toUserId: loggedInUser }
      ],
      status: 'accepted'
    }).populate("fromUserId", PUBLIC_FIELDS).populate("toUserId", PUBLIC_FIELDS);

    const connectionData = connections.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId
      }
      return row.fromUserId
    })
    res.send({ data: connectionData });
  } catch (err) {
    res.status(400).send(err.message);
  }

})

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const { _id } = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;

    let skip = (page - 1) * limit;
    const requests = await ConnectionRequest.find({
      $or: [{ fromUserId: _id }, { toUserId: _id }]
    }).select("fromUserId toUserId")

    const hideUsersFromFeed = new Set();
    requests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString())
    })
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: _id } }
      ]
    }).select(PUBLIC_FIELDS).limit(limit).skip(skip);

    res.send(users)
  } catch (err) {
    res.status(400).send(err.message)
  }
})

module.exports = userRouter