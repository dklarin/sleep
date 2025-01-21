var Client = require("../models/client_model");
var AuthPayload = require("../models/authpayload_model");
var WorkOrder = require("../models/workorder_model");

function getUsers() {
  return AuthPayload.find();
}

function getUser() {
  return AuthPayload.find();
}

function getClients() {
  return Client.find();
}

function getWorkOrder(
  _,
  { woId, clientName, dateBegin, dueDate1, description }
) {
  var query = { woId: woId };

  //Pretraživanje po datumu
  if (dateBegin !== null && clientName === undefined) {
    return WorkOrder.find({
      dateBegin: {
        $gte: dateBegin,
        $lt: dueDate1,
      },
    });
    //Pretraživanje po rednom broju
  } else if (dateBegin === null && woId !== null) {
    return WorkOrder.find(query);
    //Vraća sve elemente
  } else if (clientName === "" && dateBegin === null) {
    return WorkOrder.find();
  } else {
    //Pretraživanje po opisu, imenu klijenta ili statusu
    return WorkOrder.find({
      $or: [
        {
          description: { $regex: `${description}`, $options: "i" },
        },
        { clientName: { $regex: `${description}`, $options: "i" } },
        { status: { $regex: `${description}`, $options: "i" } },
      ],
    });
  }
}

module.exports = {
  getUsers,
  getUser,
  getClients,
  getWorkOrder,
};
