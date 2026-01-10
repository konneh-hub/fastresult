import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { json } from "body-parser";
import cors from "cors";
import { AppDataSource } from "./data-source";
import authRouter from "./routes/auth";
import resultsRouter from "./routes/results";
import usersRouter from "./routes/users";

const app = express();

// Add request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

app.use(cors());
app.use(json());

app.use("/api/auth", authRouter);
app.use("/api/results", resultsRouter);
app.use("/api/users", usersRouter);

app.get("/api/health", (_, res) => res.json({ status: "ok" }));

const port = process.env.PORT || 4000;

// Try to initialize DB but start the server even if DB is unreachable so UIs can be demoed.
AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  })
  .finally(() => {
    app.listen(port, () => console.log(`Server started on port ${port}`));
  });
