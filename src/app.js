const express = require('express');
const app = express();
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile")

app.use(express.json());
app.use(cookieParser());
app.use("/", authRouter);
app.use("/", profileRouter);

connectDB().then(() => {
  console.log("Connection to database established")
  app.listen(4000, () => {
    console.log("Server running on port 4000")
  });
}).catch((err) => {
  console.log("Error while connect to DB")
})

