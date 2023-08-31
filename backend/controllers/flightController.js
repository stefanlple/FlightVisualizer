const Flight = require("../models/flightModel");
const asyncHandler = require("express-async-handler");

const getHello = asyncHandler(async (req, res) => {
  res.status(200).json("hello");
});

const getDataByDate = asyncHandler(async (req, res) => {
  // Extract date from query parameters
  const { date } = req.query;
  const dateObject = new Date(date);

  // Get adjacent dates
  const { dayBefore, dayAfter } = getAdjacentDates(dateObject);

  // Find flights that occurred on the specified date
  const flights = await Flight.find({
    day: {
      $gte: dayBefore,
      $lt: dayAfter,
    },
  });

  if (flights) {
    res.status(200).json(flights.length);
  } else {
    res.status(401);
    throw new Error("No data. ERROR");
  }
});

function getAdjacentDates(date) {
  let dayBefore = new Date(date);
  dayBefore.setDate(dayBefore.getDate() - 1);

  let dayAfter = new Date(date);
  dayAfter.setDate(dayAfter.getDate() + 1);

  return {
    dayBefore: dayBefore,
    dayAfter: dayAfter,
  };
}

module.exports = {
  getDataByDate,
  getHello,
};
