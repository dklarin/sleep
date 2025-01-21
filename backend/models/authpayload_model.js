var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var authpayloadSchema = new Schema({
  id: Number,
  username: String,
  password: String,
  role: String,
});

module.exports = mongoose.model("AuthPayload", authpayloadSchema);
