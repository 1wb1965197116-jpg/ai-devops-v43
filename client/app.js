// ================= CORE =================

async function runAI() {
  await fetch("/ai/run", { method: "POST" });
  loadAll();
}

async function loadAll() {
  try {
    const t = await fetch("/ai/tasks").then(r => r.json());
    const l = await fetch("/ai/logs").then(r => r.json());

    document.getElementById("tasks").innerText =
      JSON.stringify(t, null, 2);

    document.getElementById("logs").innerText =
      JSON.stringify(l, null, 2);
  } catch (e) {
    console.log("Load error", e);
  }
}

// ================= COMMAND =================

async function sendCommand() {
  const command = document.getElementById("cmd").value;
  const value = document.getElementById("cmdValue").value;

  const res = await fetch("/ai/command", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ command, value })
  });

  const data = await res.json();
  document.getElementById("cmdOut").innerText =
    JSON.stringify(data, null, 2);
}

// ================= TOKEN =================

let tokens = [];

function saveToken() {
  tokens.push(document.getElementById("tokenInput").value);
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

// ================= COPY / PASTE =================

let storedValue = "";

function copyValue() {
  storedValue = document.getElementById("copyInput").value;
  document.getElementById("cpStatus").innerText = "Copied";
}

function pasteValue() {
  const target = document.getElementById("targetInput").value;

  document.getElementById("cpStatus").innerText =
    `Target: ${target}\nValue: ${storedValue}`;
}

// ================= CAMERA =================

let stream;
let currentFacing = "environment";

async function startCamera() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: currentFacing }
    });

    document.getElementById("camera").srcObject = stream;

  } catch (e) {
    alert("Camera error: " + e.message);
  }
}

function stopCamera() {
  if (stream) {
    stream.getTracks().forEach(t => t.stop());
  }
}

async function flipCamera() {
  stopCamera();
  currentFacing =
    currentFacing === "user" ? "environment" : "user";
  await startCamera();
}

// ================= BROWSER BRIDGE =================

async function sendToBrowserPaste(selector, value) {

  await fetch("/ai/bridge/send", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
      action: "paste",
      selector,
      value
    })
  });

  document.getElementById("bridgeStatus").innerText =
    "Sent to browser";
}

// AUTO LOAD
loadAll();
