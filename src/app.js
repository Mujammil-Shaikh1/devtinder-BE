const express = require('express');
const app = express();
const { adminAuth } = require("./middlewares/auth")
const { error } = require("./middlewares/error")

app.use("/admin", adminAuth)

app.get("/admin/getUsers", (req, res) => {

  throw new Error("Something went wrong");
  res.send("Users List");

  // Fetch users logic;
})

app.use("/", error)

app.listen(4091, () => {
  console.log("Server running on port 4091")
});