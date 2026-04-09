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



const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/run", (req, res) => {
  const code = req.body.code;

  fs.writeFileSync("temp.py", code);
  console.log("INPUT RECEIVED:", req.body.input);
  exec(`echo "${req.body.input || ""}" | python3 temp.py`, (error, stdout, stderr) => {
    // Cleanup
    try {
      fs.unlinkSync("temp.py");
    } catch {}

    if (error) {
      return res.json({
        output: stderr || error.message,
      });
    }

    res.json({
      output: stdout || "No output",
    });
  });
});

app.listen(3000, "0.0.0.0", () => {
  console.log("Backend running on port 3000");
});