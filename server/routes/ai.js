const express = require("express");
const { runAI } = require("../core/orchestrator");

const router = express.Router();

router.post("/run", async (req, res) => {
  const result = await runAI();
  res.json(result);
});

module.exports = router;
