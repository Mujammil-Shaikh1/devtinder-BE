const express = require("express");
const profileRouter = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const userAuth = require("../middlewares/auth");


profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const { jwtToken } = req.cookies;
    const { _id } = await jwt.verify(jwtToken, "MY_SECRET");
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found")
    }
    res.send(user)
  } catch (err) {
    res.status(400).send(err.message)
  }
})

profileRouter.patch("/user/:id", async (req, res) => {

  const id = req.params.id;
  const data = req.body
  const validKeys = ["fullName", "userName", "password", "confirmPass", "age", "gender", "profilePic"]
  const isValidUser = Object.keys(data).every((k) => validKeys.includes(k));

  try {
    if (!isValidUser) {
      throw new Error("Update not allowed")
    }
    const user = await User.findByIdAndUpdate(id, req.body, {
      runValidators: true
    });
    if (!user) {
      res.status(400).send("Can't update an user")
    } else {
      res.send("User updated successfully");
    }
  } catch (err) {
    res.status(400).send(err.message)
  }

})

module.exports = profileRouter