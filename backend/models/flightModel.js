const mongoose = require("mongoose");

const flightSchema = mongoose.Schema({
  callsign: String,
  icao24: String,
  origin: String,
  destination: String,
  firstseen: Date,
  lastseen: Date,
  latitude_1: Number,
  longitude_1: Number,
  latitude_2: Number,
  longitude_2: Number,
});

module.exports = mongoose.model("Flight", flightSchema, "flights");
