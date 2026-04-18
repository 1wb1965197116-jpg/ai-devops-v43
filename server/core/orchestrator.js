const Task = require("../models/Task");
const { processQueue } = require("./queue");

const { deployRender } = require("./deploy");

async function runAI() {

  const tasks = await Task.find({ status: "pending" });

  const processed = await processQueue();

  // simulate PR + deploy
  if (processed.length > 0) {

 

    await deployRender();
  }

  return processed;
}

module.exports = { runAI };
const Task = require("../models/Task");
const { processQueue } = require("./queue");

async function runAI() {

  const tasks = await Task.find({ status: "pending" });

  const processed = await processQueue();

  return processed;
}

module.exports = { runAI };
const Task = require("../models/Task");
const { processQueue } = require("./queue");

async function runAI() {

  const tasks = await Task.find({ status: "pending" });

  const processed = await processQueue();

  return processed;
}

module.exports = { runAI };
