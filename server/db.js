const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI || "", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on("connected", () => {
  console.log("✅ Mongo connected");
});

mongoose.connection.on("error", (err) => {
  console.log("❌ Mongo error:", err.message);
});

module.exports = mongoose;
