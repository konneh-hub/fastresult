const mysql = require("mysql2/promise");
require("dotenv").config();

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "fastresultuser",
  password: process.env.DB_PASS || "FastResult@123",
  database: process.env.DB_NAME || "fastresultdb",
  port: Number(process.env.DB_PORT || 3306),

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// optional: quick startup test
async function testDbConnection() {
  try {
    const conn = await db.getConnection();
    await conn.ping();
    conn.release();
    console.log("✅ MySQL connected successfully (fastresultdb)");
  } catch (err) {
    console.error("❌ MySQL connection failed:", err.code || err.message);
    console.error("Check .env values + make sure the MySQL user has privileges.");
    process.exit(1);
  }
}

module.exports = { db, testDbConnection };
