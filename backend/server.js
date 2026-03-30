const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.post("/run", (req, res) => {
  console.log("Request received");

  const code = req.body.code;

  // Create temp file path
  const filePath = path.join(__dirname, "temp.py");

  // Write code to file
  fs.writeFileSync(filePath, code);

  // Convert Windows path → Docker friendly path
  let dir = __dirname.replace(/\\/g, "/");

  // 🔥 VERY IMPORTANT FIX for Windows (drive letter)
  // Example: C:/Users/... → /c/Users/...
  dir = dir.replace(/^([A-Z]):/, (match, p1) => `/${p1.toLowerCase()}`);

  const command = `docker run --rm -v ${dir}:/app -w /app python:3.11-alpine python temp.py`;

  console.log("Running command:", command);

  exec(command, (error, stdout, stderr) => {
    console.log("STDOUT:", stdout);
    console.log("STDERR:", stderr);
    console.log("ERROR:", error);

    // Clean up file
    try {
      fs.unlinkSync(filePath);
    } catch {}

    if (error) {
      return res.json({
        error: stderr || "Execution error",
      });
    }

    res.json({
      output: stdout || stderr || "No output",
    });
  });
});

app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});