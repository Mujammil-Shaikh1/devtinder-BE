const express = require("express")
const app = express();


app.use("/", (req, res) => {
  res.send("hello world");
})

app.listen(4091, () => {
  console.log("Server is running on port 4091...")
});