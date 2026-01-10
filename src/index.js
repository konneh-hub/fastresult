import './index.css';
import reportWebVitals from './reportWebVitals';

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { testDbConnection } = require("./db");
const authRoutes = require("./routes/authRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("FASTRESULT API is running ✅"));
app.use("/api/auth", authRoutes);

testDbConnection(); // ✅ test DB at startup

app.listen(process.env.PORT || 4000, () => {
  console.log(`Server started on port ${process.env.PORT || 4000}`);
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
