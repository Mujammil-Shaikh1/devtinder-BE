const { Schema, model } = require("mongoose");

const userSchema = new Schema({

  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  email: {
    type: String
  },
  password: {
    type: String
  },
  age: {
    type: Number
  },
  gender: {
    type: String
  }
})

const User = model('User', userSchema)

module.exports = User