const mongoose = require('mongoose')

const connectDB = async () => {
  await mongoose.connect("mongodb+srv://Mujammil_Shaikh:james%404091@namastedev.qh73yme.mongodb.net/devTinder");
}

module.exports = connectDB