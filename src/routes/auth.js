const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user")
const authRouter = express.Router();
const { userValidation } = require("../utils/validattion")

authRouter.post("/signup", async (req, res) => {

  try {
    const password = req.body.password;
    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({ ...req.body, password: hashPassword });
    await user.save();
    res.send("User created successfully")
  } catch (err) {
    res.status(400).send(err.message)
  }
})

authRouter.post("/login", async (req, res) => {

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!email || !password || !user) {
      throw new Error("Invalid Credentials");
    }

    const isValidPass = await user.validatePass(password);
    if (!isValidPass) {
      throw new Error("Invalid Credentials");
    }
    else {
      const user = await User.findOne({ email: email }).select(["fullName", "userName", "email", "phone", "age", "gender", "profilePic", "address"])
      const jwtToken = await user.createJWT();
      if (!user) {
        throw new Error("User does not exists");
      }
      res.cookie('jwtToken', jwtToken, { expires: new Date(Date.now() + 8 * 3600000) });
      res.send(user);
    }
  }
  catch (err) {
    res.status(400).send(err.message)
  }
})

authRouter.post("/logout", (req, res) => {
  try {
    res.cookie('jwtToken', null, { expires: new Date(Date.now()) });
    res.send("Logout succesful")
  } catch (err) {
    res.status(400).send(err.message)
  }
})



module.exports = authRouter