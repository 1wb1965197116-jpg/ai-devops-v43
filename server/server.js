const express = require("express");
require("dotenv").config();
require("./db");

const auth = require("./routes/auth");
const ai = require("./routes/ai");

const app = express();

app.use(express.json());
app.use(express.static("client"));

app.use("/auth", auth);
app.use("/ai", ai);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🧠 v43 Command Center running");
});
