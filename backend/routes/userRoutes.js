const express = require("express");
const { getUser } = require("../controllers/userController");
const router = express.Router();

router.get("/get-user", getUser);

router.get("/hello", async (req, res) => {
  res.status(201);
  res.json("hello");
});

module.exports = router;
