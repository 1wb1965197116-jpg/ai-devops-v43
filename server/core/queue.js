const Task = require("../models/Task");

async function processQueue() {

  const tasks = await Task.find({ status: "pending" });

  let results = [];

  for (let task of tasks) {

    task.status = "done";
    await task.save();

    results.push(task);
  }

  return results;
}

module.exports = { processQueue };
