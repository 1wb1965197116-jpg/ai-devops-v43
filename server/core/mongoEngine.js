const mongoose = require("mongoose");

async function createMongoDB() {

  const uri = process.env.MONGO_URI;

  if (!uri) return "No Mongo URI";

  await mongoose.connect(uri);

  const Test = mongoose.model("Init", { name: String });

  await Test.create({ name: "init" });

  return "Mongo DB initialized";
}

module.exports = { createMongoDB };
