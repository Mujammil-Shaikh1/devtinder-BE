const express = require("express");
const profileRouter = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const userAuth = require("../middlewares/auth");
const bcrypt = require("bcrypt");

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("User not found")
    }
    res.send(user)
  } catch (err) {
    res.status(400).send(err.message)
  }
})

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  const data = req.body
  const validKeys = ["fullName", "userName", "age", "gender", "profilePic"]
  const isValidUser = Object.keys(data).every((k) => validKeys.includes(k));
  try {
    const user = req.user;
    if (!isValidUser) {
      throw new Error("Update not allowed")
    }
    const updateUser = await User.findByIdAndUpdate(user._id, req.body, {
      new: true,
      runValidators: true
    }).select(["fullName", "userName", "email", "phone", "age", "gender", "profilePic", "address"]);
    if (!updateUser) {
      res.status(400).send("Can't update an user")
    }
    res.send(updateUser);
  } catch (err) {
    res.status(400).send(err.message)
  }
})

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const { currentPass, newPass } = req.body;
    const user = req.user;
    if (!user) {
      return res.status(404).json("User not found");
    }
    const isValidPass = await bcrypt.compare(currentPass, user.password);
    if (!isValidPass) {
      throw new Error("Please enter correct current password")
    }
    if (!newPass) {
      throw new Error("Password can not be empty")
    }
    const newPassHash = await bcrypt.hash(newPass, 10);
    await User.findByIdAndUpdate(user._id, { password: newPassHash });
    res.cookie('jwtToken', null, { expires: new Date(Date.now()) });
    res.send("password Updated Successfully")
  }
  catch (err) {
    res.status(400).send(err.message)
  }

})

module.exports = profileRouter