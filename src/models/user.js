const { Schema, model } = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userSchema = new Schema({
  fullName: {
    type: String,
    required: [true, "Full name is required"],
    trim: true,
    minlength: [3, "Full name must be at least 3 characters"],
    maxlength: [50, "Full name cannot exceed 50 characters"],
  },
  userName: {
    type: String,
    require: [true, "Username is required"],
    trim: true,
    minLength: [3, "Username must be at least 3 characters"],
    maxLength: [50, "Username cannot exceed 30 characters"],
    match: [/^[a-zA-Z0-9_]+$/, "Username can contain only letters, numbers, and underscores"],
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    validate: {
      validator: function (email) {
        if (!validator.isEmail(email)) {
          throw new Error("Invalid Email Id:  " + email)
        }
      }
    }
  },
  phone: {
    type: String,
    required: [true, "Phone no is required"],
    match: [/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g, "Invalid international phone number format"],
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters"],
    maxLength: [128, "Password cannot exceed 128 characters"],
    match: [
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
      "Password must include uppercase, lowercase, number, and special character",
    ],
  },
  confirmPass: {
    type: String,
    required: [true, "Confirm password is required"],
    minlength: [8, "Confirm password must be at least 8 characters"],
    maxLength: [128, "Confirm password cannot exceed 128 characters"],
    match: [
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
      "Confirm password must include uppercase, lowercase, number, and special character",
    ],
  },
  age: {
    type: Number,
    min: [13, "Minimum age is 13"],
    max: [120, "Max age is 120"]
  },
  gender: {
    type: String,
    enum: ["male", "female", "other", "prefer_not_to_say"],
    default: "prefer_not_to_say",
    lowercase: true
  },
  profilePic: {
    type: String,
    match: [/^https?:\/\/.*\.(jpeg|jpg|png|webp|gif)$/, "Invalid image URL format"],
    default: "https://img.freepik.com/free-photo/3d-cartoon-portrait-person-practicing-law-related-profession_23-2151419548.jpg"
  },
  address: {
    street: {
      type: String,
      trim: true,
      maxlength: [100, "Street name too long"],
    },
    city: {
      type: String,
      trim: true,
      maxlength: [50, "City name too long"],
    },
    zipCode: {
      type: Number,
      min: [1000, "Invalid zip code"],
      max: [999999, "Invalid zip code"],
    },
    country: {
      type: String,
      trim: true,
      maxlength: [50, "Country name too long"],
    },
  },
},
  {
    timestamps: true
  }
)
userSchema.methods.createJWT = async function () {
  const user = this;
  const jwtToken = await jwt.sign({ _id: user._id }, "MY_SECRET");
  return jwtToken
}

userSchema.methods.validatePass = async function (userPass) {

  const user = this;
  const isValidPass = await bcrypt.compare(userPass, user.password);
  return isValidPass
}
const User = model('User', userSchema)

module.exports = User