const Task = require("../models/Task");
const { processQueue } = require("./queue");

async function runAI() {

  // Get pending tasks
  const tasks = await Task.find({ status: "pending" });

  // Process them
  const processed = await processQueue();

  return processed;
}

module.exports = { runAI };
