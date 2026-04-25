console.log("🔥 NEW CODE DEPLOYED");

const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const fs = require("fs");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

/* ------------------ MongoDB ------------------ */

async function startServer() {
  try {
    console.log("Connecting to MongoDB...");

    await mongoose.connect(
      "mongodb://muskangupta11b_db_user:jrdey@ac-a6uvdur-shard-00-00.mosa02h.mongodb.net:27017,ac-a6uvdur-shard-00-01.mosa02h.mongodb.net:27017,ac-a6uvdur-shard-00-02.mosa02h.mongodb.net:27017/codeRunner?ssl=true&replicaSet=atlas-25guz4-shard-0&authSource=admin&appName=Cluster0"
    );

    console.log("MongoDB Connected ✅");

    app.listen(3000, "0.0.0.0", () => {
      console.log("Backend running on port 3000");
    });

  } catch (err) {
    console.log("Mongo Error ❌");
    console.log(err);
  }
}

/* ------------------ Schema ------------------ */

const CodeSchema = new mongoose.Schema({
  code: String,
  input: String,
  output: String,
  createdAt: { type: Date, default: Date.now }
});

const Code = mongoose.model("Code", CodeSchema);

const ProjectSchema = new mongoose.Schema({
  title: String,
  code: String,
  createdAt: { type: Date, default: Date.now }
});

const Project = mongoose.model("Project", ProjectSchema);

/* ------------------ Routes ------------------ */

// Health check
app.get("/", (req, res) => {
  res.send("🚀 Cloud Code Runner Backend is Live");
});

// Run Code
app.post("/run", (req, res) => {
  const code = req.body.code;

  fs.writeFileSync("temp.py", code);

  console.log("RUN API HIT");

  exec(`python temp.py`, async (error, stdout, stderr) => {

    try {
      fs.unlinkSync("temp.py");
    } catch {}

    if (error) {
      console.log("Execution error:", error);
      return res.json({
        output: stderr || error.message,
      });
    }

    const result = stdout || "No output";

    // Save history
    try {
      await Code.create({
        code,
        input: "",
        output: result
      });
    } catch {
      console.log("DB save failed");
    }

    res.json({ output: result });
  });
});

// Create Project
app.post("/projects", async (req, res) => {
  try {
    const { title } = req.body;

    const project = await Project.create({
      title,
      code: ""
    });

    res.json(project);
  } catch {
    res.status(500).json({ error: "Create failed" });
  }
});

// Get All Projects
app.get("/projects", async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch {
    res.status(500).json({ error: "Fetch failed" });
  }
});

// Update Project Code
app.put("/projects/:id", async (req, res) => {
  try {
    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      { code: req.body.code },
      { new: true }
    );

    res.json(updated);
  } catch {
    res.status(500).json({ error: "Update failed" });
  }
});

// History
app.get("/history", async (req, res) => {
  try {
    const data = await Code.find().sort({ createdAt: -1 });
    res.json(data);
  } catch {
    res.status(500).json({ error: "History failed" });
  }
});

/* ------------------ Start ------------------ */

startServer();