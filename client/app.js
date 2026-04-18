// ===== CORE DASHBOARD =====

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

// ===== TOKEN SYSTEM =====

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
    "✅ Copied successfully";
}

function pasteValue() {
  const target = document.getElementById("targetInput").value;

  document.getElementById("cpStatus").innerText =
    `📌 Target: ${target}\nValue: ${storedValue}\nStatus: SUCCESS`;
}

// ===== CAMERA =====

let stream;

async function startCamera() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    document.getElementById("camera").srcObject = stream;
  } catch (e) {
    alert("Camera error");
  }
}

function stopCamera() {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
}

// AUTO LOAD
loadAll();
