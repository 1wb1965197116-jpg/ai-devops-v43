// NO node-fetch needed

// ===== STEP PARSER =====
function splitSteps(command) {
  return command
    .split(/then|and/i)
    .map(s => s.trim())
    .filter(Boolean);
}

// ===== SIMPLE RULE PARSER =====
function classifyStep(step) {
  const s = step.toLowerCase();

  if (s.includes("deploy")) return { action: "deploy_render" };
  if (s.includes("push")) return { action: "push_github" };

  if (s.includes("update env")) {
    const match = step.match(/([A-Z0-9_]+)\s*=\s*(.+)/i);
    if (match) {
      return {
        action: "update_env",
        key: match[1],
        value: match[2]
      };
    }
    return { action: "update_env" };
  }

  return { action: "unknown", raw: step };
}

// ===== ACTIONS =====

async function deployRender() {
  const key = process.env.RENDER_API_KEY;
  const SERVICE_ID = process.env.RENDER_SERVICE_ID;

  if (!key || !SERVICE_ID)
    return { error: "Missing Render config" };

  await fetch(`https://api.render.com/v1/services/${SERVICE_ID}/deploys`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`
    }
  });

  return { status: "deploy_triggered" };
}

async function pushGitHub() {
  return { status: "github_push_simulated" };
}

async function updateEnv(key, value) {
  const apiKey = process.env.RENDER_API_KEY;
  const SERVICE_ID = process.env.RENDER_SERVICE_ID;

  if (!apiKey || !SERVICE_ID)
    return { error: "Missing Render config" };

  await fetch(`https://api.render.com/v1/services/${SERVICE_ID}/env-vars`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify([{ key, value }])
  });

  return { status: "env_updated", key };
}

// ===== EXECUTOR =====

async function executeStep(stepObj) {

  if (stepObj.action === "deploy_render") {
    return await deployRender();
  }

  if (stepObj.action === "push_github") {
    return await pushGitHub();
  }

  if (stepObj.action === "update_env") {
    if (!stepObj.key || !stepObj.value) {
      return { error: "Missing key/value" };
    }
    return await updateEnv(stepObj.key, stepObj.value);
  }

  return { status: "unknown_step", step: stepObj };
}

// ===== MAIN WORKFLOW =====

async function runAICommand(command) {

  const steps = splitSteps(command);

  let results = [];

  for (let step of steps) {

    const parsed = classifyStep(step);

    let attempts = 0;
    let success = false;
    let result;

    while (attempts < 2 && !success) {
      try {
        result = await executeStep(parsed);

        if (!result.error) success = true;
        else attempts++;

      } catch (e) {
        attempts++;
        result = { error: e.message };
      }
    }

    results.push({
      step,
      result
    });
  }

  return {
    workflow: results
  };
}

module.exports = { runAICommand };
