const mysql = require("mysql2/promise");
require("dotenv").config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT || 3306),
  waitForConnections: true,
  connectionLimit: 10
});

async function testDbConnection() {
  try {
    const conn = await db.getConnection();
    await conn.ping();
    conn.release();
    console.log("✅ MySQL connected:", process.env.DB_NAME);
  } catch (err) {
    console.error("❌ MySQL connection failed:", err.code || err.message);
    // don't exit; keep API up for health checks
  }
}

module.exports = { db, testDbConnection };
