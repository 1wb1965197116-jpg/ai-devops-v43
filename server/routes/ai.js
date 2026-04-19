const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Task = require("../models/Task");
const Log = require("../models/Log");

// ✅ ONLY IMPORT ONCE (TOP)
const { runAICommand, runAI } = require("../core/orchestrator");

// ===== STATE =====
let vault = {};
let latestBridgeCommand = null;

// ================= COMMAND =================
router.post("/command", async (req, res) => {

  const { command, value } = req.body || {};
  const text = (command || "").toLowerCase();

  let result;

  try {

    // ===== SAFE LOCAL COMMANDS =====
    if (text.includes("store token")) {
      vault["GENERIC"] = value;
      result = "Token stored";
    }

    else if (text.includes("clear tokens")) {
      vault = {};
      result = "Vault cleared";
    }

    else if (text.includes("init mongo")) {

      if (!process.env.MONGO_URI) {
        return res.json({ result: "Missing MONGO_URI" });
      }

      await mongoose.connect(process.env.MONGO_URI);

      const Test = mongoose.model("Init", { name: String });
      await Test.create({ name: "init" });

      result = "Mongo initialized";
    }

    // ===== AI COMMANDS =====
    else {
      result = await runAICommand(command || "");
    }

  } catch (err) {
    result = "Error: " + err.message;
  }

  res.json({ result });
});

// ================= CORE =================

router.post("/run", async (req, res) => {
  res.json(await runAI());
});

router.get("/tasks", async (req, res) => {
  res.json(await Task.find());
});

router.get("/logs", async (req, res) => {
  res.json(await Log.find().sort({ time: -1 }).limit(50));
});

// ================= BRIDGE =================

router.post("/bridge/send", (req, res) => {
  latestBridgeCommand = req.body;
  res.json({ status: "sent" });
});

router.get("/bridge", (req, res) => {
  res.json(latestBridgeCommand || {});
});

module.exports = router;
