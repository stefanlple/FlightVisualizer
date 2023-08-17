const mongoose = require("mongoose");

const flightSchema = mongoose.Schema({
  callsign: String,
  number: String,
  icao24: String,
  registration: String,
  typecode: String,
  origin: String,
  destination: String,
  firstseen: String,
  lastseen: String,
  day: String,
  latitude_1: Number,
  longitude_1: Number,
  altitude_1: Number,
  latitude_2: Number,
  longitude_2: Number,
  altitude_2: Number,
});

module.exports = mongoose.model("datas", flightSchema);
