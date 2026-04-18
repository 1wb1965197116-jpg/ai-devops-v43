const express = require("express");
const router = express.Router();

const Task = require("../models/Task");
const Log = require("../models/Log");
const { runAI } = require("../core/orchestrator");

// ===== SIMPLE IN-MEMORY TOKEN VAULT =====
let vault = {};

// ===== COMMAND ROUTER =====
router.post("/command", async (req, res) => {

  const { command, value } = req.body;

  let result = "Unknown command";

  const text = (command || "").toLowerCase();

  try {

    // STORE TOKEN
    if (text.includes("store token")) {
      vault["GENERIC"] = value;
      result = "✅ Token stored";
    }

    // CLEAR TOKENS
    else if (text.includes("clear tokens")) {
      vault = {};
      result = "🧹 Vault cleared";
    }

    // INIT MONGO
    else if (text.includes("init mongo")) {

      const mongoose = require("mongoose");

      await mongoose.connect(process.env.MONGO_URI);

      const Test = mongoose.model("Init", { name: String });
      await Test.create({ name: "init" });

      result = "✅ Mongo initialized";
    }

    // SEND TO RENDER (SIMULATED)
    else if (text.includes("render")) {

      const val = vault["GENERIC"];

      if (!val) {
        result = "❌ No token stored";
      } else {
        result = {
          status: "SIMULATED",
          action: "Render ENV SET",
          key: "API_KEY",
          value: val
        };
      }
    }

  } catch (err) {
    result = "❌ Error: " + err.message;
  }

  res.json({ result });
});

// ===== CORE ROUTES =====

router.post("/run", async (req, res) => {
  const result = await runAI();
  res.json(result);
});

router.get("/tasks", async (req, res) => {
  res.json(await Task.find());
});

router.get("/logs", async (req, res) => {
  res.json(await Log.find().sort({ time: -1 }).limit(50));
});

module.exports = router;
