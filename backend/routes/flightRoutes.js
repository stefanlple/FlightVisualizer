const express = require("express");
const { getHello } = require("../controllers/flightController");
const router = express.Router();

router.get("/hello", getHello);

module.exports = router;
