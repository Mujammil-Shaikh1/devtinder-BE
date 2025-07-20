const express = require('express');
const app = express();
const { adminAuth } = require("./middlewares/auth")

app.use("/admin", adminAuth)

app.get("/admin/getUsers", (req, res) => {
  // Fetch users logic;
  res.send("Users List");
})
app.listen(4091, () => {
  console.log("Server running on port 4091")
});