const fetch = require("node-fetch");

async function createPR(repo, branch) {

  const res = await fetch(
    `https://api.github.com/repos/${repo}/pulls`,
    {
      method: "POST",
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: "AI DevOps Update",
        head: branch,
        base: "main",
        body: "Automated change"
      })
    }
  );

  return await res.json();
}

module.exports = { createPR };
