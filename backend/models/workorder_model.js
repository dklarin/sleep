var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var workorderSchema = new Schema({
  woId: Number,
  dateBegin: Date,
  dateEnd: Date,
  clientName: String,
  clientEmail: String,
  device: String,
  status: String,
  description: String,
  timeBegin: String,
  timeEnd: String,
  spentTime: String,
  carBool: String,
  parkingBool: String,
  interrupter: Boolean,
  part1: String,
  part2: String,
  part3: String,
  price1: String,
  price2: String,
  price3: String,
  totalAmount: String,
});
module.exports = mongoose.model("WorkOrder", workorderSchema);
