const express = require('express');
const app = express();
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat")
const cors = require("cors");
const http = require("http");
const initlializeSocket = require("./utils/socket")
require('dotenv').config()

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter)

const server = http.createServer(app)
initlializeSocket(server);
connectDB().then(() => {
  console.log("Connection to database established")
  server.listen(process.env.PORT, () => {
    console.log("Server running on port " + process.env.PORT)
  });
}).catch((err) => {
  console.log("Error while connect to DB")
})

