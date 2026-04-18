const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

router.post("/register", async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user || !(await user.compare(req.body.password))) {
    return res.status(401).send("Invalid");
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.json({ token });
});

module.exports = router;
