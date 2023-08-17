const Data = require("../models/flightModel");
const asyncHandler = require("express-async-handler");

const getHello = asyncHandler(async (req, res) => {
  res.status(200).json("hello");
});

const getDataByDate = asyncHandler(async (req, res) => {
  const datePrefix = req.query.date; // Get the query parameter for the date prefix

  console.log(datePrefix);

  const query = {
    day: {
      $regex: `^${datePrefix}`, // Use a regex to match the beginning of the date string
    },
  };

  const data = await Data.find({
    callsign: "AAR561",
  });
  console.log(data);
  // if (data.length > 0) {
  res.status(200).json(data);
  /*  } else {
    res.status(401);
    throw new Error("No data");
  } */
});

module.exports = {
  getDataByDate,
  getHello,
};
