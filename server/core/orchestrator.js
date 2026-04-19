const fetch = require("node-fetch");

// ===== HELPERS =====
function extractKV(text) {
  // matches KEY=VALUE pairs
  const m = text.match(/([A-Z0-9_]+)\s*=\s*([^\s]+)/i);
  if (!m) return null;
  return { key: m[1], value: m[2] };
}

// ===== OPENAI PARSER =====
async function parseCommandNL(command) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    // fallback basic rules if key missing
    return { action: "unknown", raw: command };
  }

  const prompt = `
You are an automation parser.
Convert the user's command into JSON.

Supported actions:
- deploy_render
- push_github
- update_env
- unknown

Return JSON only:
{ "action": "...", "key": "...", "value": "..." }

Command: "${command}"
`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0
    })
  });

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content || "{}";

  try {
    return JSON.parse(text);
  } catch {
    return { action: "unknown", raw: command };
  }
}

// ===== ACTIONS =====

// Render: trigger deploy (simple example via service restart or API)
async function deployRender() {
  const key = process.env.RENDER_API_KEY;
  if (!key) return { error: "Missing RENDER_API_KEY" };

  // NOTE: Replace SERVICE_ID with your real one
  const SERVICE_ID = process.env.RENDER_SERVICE_ID;

  if (!SERVICE_ID) {
    return { error: "Missing RENDER_SERVICE_ID" };
  }

  const res = await fetch(`https://api.render.com/v1/services/${SERVICE_ID}/deploys`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${key}`,
      "Content-Type": "application/json"
    }
  });

  return { status: "deploy_triggered" };
}

// GitHub: push (basic commit example)
async function pushGitHub() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return { error: "Missing GITHUB_TOKEN" };

  // This is a placeholder — real push requires repo + file changes
  return { status: "github_push_simulated" };
}

// Render ENV update
async function updateEnv(keyName, value) {
  const apiKey = process.env.RENDER_API_KEY;
  const SERVICE_ID = process.env.RENDER_SERVICE_ID;

  if (!apiKey || !SERVICE_ID) {
    return { error: "Missing Render config" };
  }

  const res = await fetch(`https://api.render.com/v1/services/${SERVICE_ID}/env-vars`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify([
      { key: keyName, value }
    ])
  });

  return { status: "env_updated", key: keyName };
}

// ===== MAIN =====
async function runAICommand(command) {

  const parsed = await parseCommandNL(command);

  if (parsed.action === "deploy_render") {
    return await deployRender();
  }

  if (parsed.action === "push_github") {
    return await pushGitHub();
  }

  if (parsed.action === "update_env") {
    if (!parsed.key || !parsed.value) {
      const kv = extractKV(command);
      if (kv) return await updateEnv(kv.key, kv.value);
      return { error: "Missing KEY=VALUE" };
    }
    return await updateEnv(parsed.key, parsed.value);
  }

  return { status: "unknown_command", parsed };
}

module.exports = { runAICommand };
