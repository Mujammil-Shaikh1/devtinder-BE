const User = require("../models/user");
const jwt = require("jsonwebtoken")
const userAuth = async (req, res, next) => {
  try {
    const { jwtToken } = req.cookies;
    if (!jwtToken) {
      return res.status(401).send("Session expired, Please login")
    }
    const { _id } = await jwt.verify(jwtToken, "MY_SECRET");
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).send("Unauthorized");

  }
}

module.exports = userAuth