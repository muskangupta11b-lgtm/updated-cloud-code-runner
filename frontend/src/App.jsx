import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";

function App() {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [input, setInput] = useState("");
  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState(null);

  const BASE_URL = "https://updated-cloud-code-runner.onrender.com";

  // Fetch projects
  useEffect(() => {
  fetch(`${BASE_URL}/projects`)
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data)) {
        setProjects(data);
      } else {
        console.log("Invalid data:", data);
      }
    });
}, []);

  const createProject = async () => {
  const name = prompt("Enter project name:");
  if (!name) return;

  try {
    const res = await fetch(`${BASE_URL}/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title: name })
    });

    const newProject = await res.json();

    console.log("CREATED:", newProject);

    // ✅ Add to UI immediately
    setProjects(prev => [...prev, newProject]);

    // ✅ Select it
    setProjectId(newProject._id);

    // ✅ Clear editor
    setCode("");

  } catch (err) {
    console.log("Create error:", err);
  }
};
  // Open project
  const openProject = (id) => {
  const project = projects.find(p => p._id === id);

  if (!project) return;

  setCode(project.code || "");
  setProjectId(id);
};

  // Save project
  const saveProject = async () => {
  if (!projectId) {
    alert("Select a project first!");
    return;
  }

  await fetch(`${BASE_URL}/projects/${projectId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ code })
  });

  alert("Saved to cloud ✅");
};

  // Run code
  const runCode = async () => {
    setOutput("Running...");

    try {
      const res = await fetch(`${BASE_URL}/run`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ code, input })
      });

      const data = await res.json();
      setOutput(data.output || data.error);
    } catch {
      setOutput("Server error");
    }
  };
  <h2>UPDATED VERSION</h2>
  return (
    <div style={{
      backgroundColor: "#0d1117",
      color: "white",
      minHeight: "100vh",
      padding: "20px"
    }}>
      <h1 style={{
        color: "#58a6ff",
        textAlign: "center",
        marginBottom: "20px"
      }}>
        🚀 Cloud Code Runner
      </h1>

      <button onClick={createProject}>
        ➕ New Project
      </button>

      <div style={{ marginTop: "10px" }}>
  <div style={{ marginTop: "10px" }}>
  {Array.isArray(projects) && projects.map((p) => (
    <div
      key={p._id}
      style={{
        padding: "8px",
        border: "1px solid #444",
        marginBottom: "5px",
        cursor: "pointer",
        borderRadius: "5px",
        background: projectId === p._id ? "#1f6feb" : "transparent"
      }}
      onClick={() => openProject(p._id)}
    >
      📁 {p.title}
    </div>
  ))}
</div>
console.log("PROJECTS STATE:", projects);
    </div>
      <Editor
        height="300px"
        defaultLanguage="python"
        value={code}
        onChange={(value) => setCode(value)}
        theme="vs-dark"
      />

      <textarea
        placeholder="Enter input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{
          width: "100%",
          height: "80px",
          marginTop: "10px",
          padding: "10px",
          background: "#161b22",
          color: "white",
          border: "1px solid #30363d",
          borderRadius: "6px"
        }}
      />

      <div style={{ marginTop: "10px" }}>
        <button onClick={runCode}>▶ Run Code</button>
        <button onClick={saveProject}>💾 Save Code</button>
        <button onClick={() => navigator.clipboard.writeText(output)}>📋 Copy</button>
        <button onClick={() => setOutput("")}>❌ Clear</button>
      </div>

      <div style={{
        marginTop: "20px",
        background: "#010409",
        color: "#00ff9c",
        padding: "10px",
        height: "200px",
        overflowY: "auto",
        borderRadius: "8px",
        fontFamily: "monospace"
      }}>
        {output}
      </div>
    </div>
  );
}

export default App;