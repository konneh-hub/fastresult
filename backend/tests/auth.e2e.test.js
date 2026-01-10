const http = require("http");

function post(path, data) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(data);
    const req = http.request(
      {
        hostname: "localhost",
        port: 4000,
        path,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body)
        }
      },
      (res) => {
        let out = "";
        res.on("data", (c) => (out += c));
        res.on("end", () => {
          let json;
          try { json = JSON.parse(out || "{}"); } catch { json = { raw: out }; }
          resolve({ status: res.statusCode, json });
        });
      }
    );

    req.on("error", (e) => reject(e));
    req.write(body);
    req.end();
  });
}

(async () => {
  console.log("============================================================");
  console.log("SRMS: REGISTRATION & LOGIN FULL TEST");
  console.log("============================================================");

  const email = `student_${Date.now()}@test.com`;

  console.log("1) STUDENT REGISTRATION");
  const reg = await post("/api/auth/register", {
    role: "student",
    fullName: "Test Student",
    email,
    phone: "0000",
    password: "123456",
    matricNo: `SRMS/${Date.now()}`,
    programId: 1,
    level: 100
  }).catch((e) => {
    console.log("HTTP Request Error:", e.message);
    process.exit(1);
  });

  console.log("Status:", reg.status);
  console.log("Body:", reg.json);

  console.log("\n2) LOGIN");
  const log = await post("/api/auth/login", {
    email,
    password: "123456"
  });

  console.log("Status:", log.status);
  console.log("Body:", log.json);

  if (log.json.token) console.log("\n✅ SUCCESS: token received");
  else console.log("\n❌ FAILED: no token");
})();
