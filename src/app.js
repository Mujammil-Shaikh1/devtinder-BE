const express = require('express');
const app = express();

app.use("/user", [(req, res, next) => {
  console.log("user no 1 ");
  next();
}, (req, res, next) => {
  console.log("user no 2");
  res.send("Request fullfilled");
}], (req, res) => {
  console.log("user no 3");
  res.send("hello world")
})

app.listen(4091, () => {
  console.log("Server running on port 4091")
});