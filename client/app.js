async function runAI() {

  const res = await fetch("/ai/run", {
    method: "POST"
  });

  const data = await res.json();

  document.getElementById("out").innerText =
    JSON.stringify(data, null, 2);
}
async function runAI() {

  const res = await fetch("/ai/run", { method: "POST" });
  const data = await res.json();

  document.getElementById("out").innerText =
    JSON.stringify(data, null, 2);
}

async function deploy() {

  await fetch("/ai/run", { method: "POST" });

  alert("Deploy triggered");
}
