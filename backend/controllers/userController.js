const Flight = require("../models/flightModel");
const asyncHandler = require("express-async-handler");

const getUser = (req, res) => {
  res.status(200);
  res.json(req.user);
};

module.exports = {
  getUser,
};
