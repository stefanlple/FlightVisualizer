const Flight = require("../models/flightModel");
const asyncHandler = require("express-async-handler");

const getHello = asyncHandler(async (req, res) => {
  res.status(200).json("hello");
});

module.exports = {
  getHello,
};
