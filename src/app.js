const express = require('express');
const app = express();
const connectDB = require("./config/database");
const User = require('./models/user');

app.use(express.json());

app.post("/signup", async (req, res) => {

  const user = new User(req.body);

  try {
    await user.save();
    res.send("User created successfully")
  } catch (err) {
    res.status(400).send("Something went wrong", err.message)
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
    res.status(400).send("Something went wrong", err.message)
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
    res.status(400).send("Something went wrong", err.message)

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
    res.status(400).send("Something went wrong", err.message)

  }
})

app.patch("/user/:id", async (req, res) => {

  const id = req.params.id;
  try {
    const user = await User.findByIdAndUpdate(id, req.body);
    if (!user) {
      res.status(400).send("Can't update an user")
    } else {
      res.send("User updated successfully");
    }
  } catch (err) {
    res.status(400).send("Something went wrong", err.message)
  }

})


connectDB().then(() => {
  console.log("Connection to database established")
  app.listen(4091, () => {
    console.log("Server running on port 4091")
  });
}).catch((err) => {
  console.log("Error while connect to DB")
})

