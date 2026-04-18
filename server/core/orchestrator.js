const Task = require("../models/Task");
const { processQueue } = require("./queue");
const { createPR } = require("./githubEngine");
const { deployRender } = require("./deploy");

async function runAI() {

  const tasks = await Task.find({ status: "pending" });

  const processed = await processQueue();

  // simulate PR + deploy
  if (processed.length > 0) {

    await createPR("YOUR_USER/YOUR_REPO", "ai-update-branch");

    await deployRender();
  }

  return processed;
}

module.exports = { runAI };
