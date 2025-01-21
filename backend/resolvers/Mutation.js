var Bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
var Client = require("../models/client_model");
var AuthPayload = require("../models/authpayload_model");
var WorkOrder = require("../models/workorder_model");

async function addClient(_, { clientId, firstName, lastName, clientEmail }) {
  const client = new Client({
    clientId,
    firstName,
    lastName,
    clientEmail,
  });
  await client.save();
  return client;
}

function removeClient(_, { clientId }) {
  return Client.deleteOne({ clientId: clientId });
}

async function signup(_, { id, username, password, role }) {
  const hashedPassword = Bcrypt.hashSync(password, 10);
  const user = new AuthPayload({
    id,
    username,
    password: hashedPassword,
    role,
  });
  await user.save();
  return user;
}

async function login(_, { username, password }) {
  const user = await AuthPayload.findOne({ username: username }).exec();
  console.log(user.password);
  const passwordMatch = await Bcrypt.compare(password, user.password);
  console.log(passwordMatch);

  const token = jwt.sign(
    { id: user.id, username: username, role: user.role },
    "nekažvrljotina",
    { expiresIn: "30d" }
  );

  id = user.id;
  role = user.role;

  if (passwordMatch) {
    return { id, username, token, role };
  } else {
    return [false];
  }
}

function removeUser(_, { id }) {
  return AuthPayload.deleteOne({ id: id });
}

function updateUser(_, { id, username, password, role }) {
  const hashedPassword = Bcrypt.hashSync(password, 10);
  let myquery = { id: id };
  let newvalues = {
    $set: { username: username, password: hashedPassword, role: role },
  };

  return AuthPayload.updateOne(myquery, newvalues);
}

async function addWorkOrder(
  _,
  {
    woId,
    dateBegin,
    dateEnd,
    clientName,
    clientEmail,
    device,
    status,
    description,
    timeBegin,
    timeEnd,
    spentTime,
    carBool,
    parkingBool,
    interrupter,
    part1,
    part2,
    part3,
    price1,
    price2,
    price3,
    totalAmount,
  }
) {
  const workorder = new WorkOrder({
    woId,
    dateBegin,
    dateEnd,
    clientName,
    clientEmail,
    device,
    status,
    description,
    timeBegin,
    timeEnd,
    spentTime,
    carBool,
    parkingBool,
    interrupter,
    part1,
    part2,
    part3,
    price1,
    price2,
    price3,
    totalAmount,
  });
  await workorder.save();
  return workorder;
}

async function updateWorkOrder(
  _,
  {
    woId,
    dateBegin,
    dateEnd,
    clientName,
    clientEmail,
    device,
    status,
    description,
    timeBegin,
    timeEnd,
    spentTime,
    carBool,
    parkingBool,
    interrupter,
    part1,
    part2,
    part3,
    price1,
    price2,
    price3,
    totalAmount,
  }
) {
  let myquery = { woId: woId };
  let newvalues = {
    $set: {
      dateBegin: dateBegin,
      dateEnd: dateEnd,
      clientName: clientName,
      clientEmail: clientEmail,
      device: device,
      status: status,
      description: description,
      timeBegin: timeBegin,
      timeEnd: timeEnd,
      spentTime: spentTime,
      carBool: carBool,
      parkingBool: parkingBool,
      interrupter: interrupter,
      part1: part1,
      part2: part2,
      part3: part3,
      price1: price1,
      price2: price2,
      price3: price3,
      totalAmount: totalAmount,
    },
  };

  return WorkOrder.updateOne(myquery, newvalues);
}

function removeWorkOrder(_, { woId }) {
  return WorkOrder.deleteOne({ woId: woId });
}

module.exports = {
  addClient,
  removeClient,
  signup,
  login,
  removeUser,
  updateUser,
  addWorkOrder,
  updateWorkOrder,
  removeWorkOrder,
};
