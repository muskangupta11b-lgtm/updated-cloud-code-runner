// const express = require("express");
// const cors = require("cors");
// const { exec } = require("child_process");
// const fs = require("fs");
// const path = require("path");

// const app = express();

// app.use(cors());
// app.use(express.json());

// // Test route
// app.post("/run", (req, res) => {
//   const code = req.body.code;

//   fs.writeFileSync("temp.py", code);

//   const command = `docker run --rm -v ${process.cwd()}:/app -w /app python:3.9 python temp.py`;

//   exec(command, (error, stdout, stderr) => {

//     // Cleanup
//     try {
//       fs.unlinkSync("temp.py");
//     } catch {}

//     if (error) {
//       return res.json({
//         output: stderr || error.message,
//       });
//     }

//     res.json({
//       output: stdout || "No output",
//     });
//   });
// });

// app.listen(3000, "0.0.0.0", () => {
//   console.log("Backend running on port 3000");
// });

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

    await mongoose.connect("mongodb+srv://muskangupta11b_db_user:jrdey@cluster0.mosa02h.mongodb.net/codeRunner");

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
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Code = mongoose.model("Code", CodeSchema);
const ProjectSchema = new mongoose.Schema({
  title: String,
  code: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Project = mongoose.model("Project", ProjectSchema);

/* ------------------ Routes ------------------ */
app.get("/", (req, res) => {
  res.send("🚀 Cloud Code Runner Backend is Live");
});
app.post("/run", (req, res) => {
  const code = req.body.code;
  const input = req.body.input || "";

  fs.writeFileSync("temp.py", code);

  exec(`printf "%s" "${input}" | python3 temp.py`, async (error, stdout, stderr) => {

    try {
      fs.unlinkSync("temp.py");
    } catch {}

    if (error) {
      return res.json({
        output: stderr || error.message,
      });
    }

    const result = stdout || "No output";

    // Save to DB
    await Code.create({
      code,
      input,
      output: result
    });

    res.json({
      output: result
    });
  });
});
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
app.get("/projects", async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch projects" });
  }

});app.put("/projects/:id", async (req, res) => {
  try{
    const updated = await Project.findByIdAndUpdate(
    req.params.id,
    { code: req.body.code },
    { new: true }
  );
    res.json(project);
  } catch {
    res.status(500).json({ error: "Create failed" });
  }
  });
  app.get("/projects", async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});


/* ------------------ History API ------------------ */

app.get("/history", async (req, res) => {
  const data = await Code.find().sort({ createdAt: -1 });
  res.json(data);
});
/* ------------------ Start Server ------------------ */

startServer();