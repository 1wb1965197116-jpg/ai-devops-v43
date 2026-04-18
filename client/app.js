// ===== CORE DASHBOARD =====
e
async function runAI() {
  await fetch("/ai/run", { method: "POST" });
  loadAll();
}

async function loadAll() {

  const t = await fetch("/ai/tasks").then(r => r.json());
  const l = await fetch("/ai/logs").then(r => r.json());

  document.getElementById("tasks").innerText =
    JSON.stringify(t, null, 2);

  document.getElementById("logs").innerText =
    JSON.stringify(l, null, 2);
}

// ===== COMMAND CONSOLE =====

async function sendCommand() {

  const command = document.getElementById("cmd").value;
  const value = document.getElementById("cmdValue").value;

  const res = await fetch("/ai/command", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ command, value })
  });

  const data = await res.json();

  document.getElementById("cmdOut").innerText =
    JSON.stringify(data, null, 2);
}

// ===== TOKEN SYSTEM (CLIENT VIEW ONLY) =====

let tokens = [];

function saveToken() {
  const val = document.getElementById("tokenInput").value;
  tokens.push(val);
  renderTokens();
}

function clearTokens() {
  tokens = [];
  renderTokens();
}

function renderTokens() {
  document.getElementById("tokens").innerText =
    JSON.stringify(tokens, null, 2);
}

// ===== COPY / PASTE AI =====

let storedValue = "";

function copyValue() {
  storedValue = document.getElementById("copyInput").value;

  document.getElementById("cpStatus").innerText =
    "✅ Copied";
}

function pasteValue() {
  const target = document.getElementById("targetInput").value;

  document.getElementById("cpStatus").innerText =
    `📌 Target: ${target}\nValue: ${storedValue}\nStatus: READY`;
}

// ===== CAMERA =====

let stream;

async function startCamera() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    document.getElementById("camera").srcObject = stream;
  } catch (e) {
    alert("Camera access denied or not available");
  }
}

function stopCamera() {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
}

// AUTO LOAD
loadAll();
async function sendToBrowserPaste(selector, value) {

  await fetch("/ai/bridge/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "paste",
      selector,
      value
    })
  });

  alert("Command sent to browser");
}
