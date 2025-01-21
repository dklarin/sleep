var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var clientSchema = new Schema({
  clientId: Number,
  firstName: String,
  lastName: String,
  clientEmail: String,
});
module.exports = mongoose.model("Client", clientSchema);
