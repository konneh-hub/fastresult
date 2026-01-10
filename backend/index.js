const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { testDbConnection } = require("./db");
const authRoutes = require("./routes/authRoutes");

const app = express();

process.on("unhandledRejection", (r) => console.error("🔥 unhandledRejection:", r));
process.on("uncaughtException", (e) => console.error("🔥 uncaughtException:", e));

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ ok: true, app: "fastresult", time: new Date().toISOString() }));

app.use("/api/auth", authRoutes);

testDbConnection();

app.listen(process.env.PORT || 4000, () => {
  console.log(`✅ Server started on port ${process.env.PORT || 4000}`);
});
