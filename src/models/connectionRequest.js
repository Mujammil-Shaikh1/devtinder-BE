const mongoose = require("mongoose");

const ConnectionRequestSchema = new mongoose.Schema({
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  status: {
    type: String,
    enum: {
      values: ["interested", "ignored", "accepted", "rejected"],
      message: `{VALUE} is not correct status type`
    }
  }
}, {
  timestamps: true
})

ConnectionRequestSchema.index({ fromUserId: 1, toUserId: 1 })

ConnectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("You can't send the request to yourself")
  }
  next();
})


const ConnectionRequestModel = new mongoose.model("ConnectionRequest", ConnectionRequestSchema)
module.exports = ConnectionRequestModel