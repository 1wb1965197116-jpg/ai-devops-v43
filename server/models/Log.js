const mongoose = require("../db");

const Log = mongoose.model("Log", {
  message: String,
  time: { type: Date, default: Date.now }
});

module.exports = Log;
