const express = require("express");
const router = express.Router();

const Task = require("../models/Task");
const Log = require("../models/Log");
const { runAI } = require("../core/orchestrator");

// RUN AI
router.post("/run", async (req, res) => {
  const result = await runAI();
  res.json(result);
});

// TASKS
router.get("/tasks", async (req, res) => {
  res.json(await Task.find());
});

// LOGS
router.get("/logs", async (req, res) => {
  res.json(await Log.find().sort({ time: -1 }).limit(50));
});

module.exports = router;
