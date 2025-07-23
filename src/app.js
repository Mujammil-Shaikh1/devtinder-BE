const express = require('express');
const app = express();
const connectDB = require("./config/database");
const User = require('./models/user');
const { userValidation } = require("./utils/validattion");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {

  try {
    userValidation(req.body)
    const password = req.body.password;
    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({ ...req.body, password: hashPassword, confirmPass: hashPassword });
    await user.save();
    res.send("User created successfully")
  } catch (err) {
    res.status(400).send(err.message)
  }

})

app.post("/login", async (req, res) => {

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!email || !password || !user) {
      throw new Error("Invalid Credentials");
    }

    const isValidPass = await bcrypt.compare(password, user?.password)
    if (!isValidPass) {
      throw new Error("Invalid Credentials");
    }
    else {
      const user = await User.findOne({ email: email })
      const jwtToken = await jwt.sign({ _id: user._id }, "MY_SECRET");
      if (!user) {
        throw new Error("User does not exists");
      }
      res.cookie('jwtToken', jwtToken);
      res.send("Login Success");
    }
  }
  catch (err) {
    res.status(400).send(err.message)
  }
})

app.get("/profile", async (req, res) => {
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

app.get("/user", async (req, res) => {
  const email = req.body.email;
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      res.send(user)
    }
    else {
      res.status(404).send("User not found")
    }
  } catch (err) {
    res.status(400).send(err.message)
  }

})

app.get("/feed", async (req, res) => {

  try {
    const users = await User.find({});
    if (users.length) {
      res.send(users);
    }
    else {
      res.status(404).send("Users not found")
    }
  } catch (err) {
    res.status(400).send(err.message)

  }
})

app.delete("/user/:id", async (req, res) => {

  const id = req.params.id;

  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      res.status(404).send("Can't delete user")
    }
    else {

      res.send("User deleted successfully");
    }
  } catch (err) {
    res.status(400).send(err.message)

  }
})

app.patch("/user/:id", async (req, res) => {

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


connectDB().then(() => {
  console.log("Connection to database established")
  app.listen(4000, () => {
    console.log("Server running on port 4000")
  });
}).catch((err) => {
  console.log("Error while connect to DB")
})

