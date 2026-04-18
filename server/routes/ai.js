const express = require("express");
const router = express.Router();

const Task = require("../models/Task");
const Log = require("../models/Log");
const { runAI } = require("../core/orchestrator");

let lastPRs = [];
let deployStatus = { status: "idle" };

// RUN AI
router.post("/run", async (req, res) => {
  const result = await runAI();

  await Log.create({
    message: "AI run executed"
  });

  res.json(result);
});

// TASKS
router.get("/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// LOGS
router.get("/logs", async (req, res) => {
  const logs = await Log.find().sort({ time: -1 }).limit(50);
  res.json(logs);
});

// PR STATUS
router.get("/prs", (req, res) => {
  res.json(lastPRs);
});

// DEPLOY STATUS
router.get("/deploy-status", (req, res) => {
  res.json(deployStatus);
});

module.exports = router;
