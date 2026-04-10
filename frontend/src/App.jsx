import { useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";

function App() {
  const [code, setCode] = useState(() => {
  return localStorage.getItem("code") || "print('Hello World')";
  });
  const [output, setOutput] = useState("");
  const [input, setInput] = useState("");

  const runCode = async () => {
    setOutput("Running...");

    try {
      const response = await fetch("https://updated-cloud-code-runner.onrender.com/run", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ code, input })
});

const data = await response.json();
setOutput(data.output || data.error);
    } catch {
      setOutput("Server error");
    }
  };

  return (
  <div style={{
    backgroundColor: "#0d1117",
    color: "white",
    minHeight: "100vh",
    padding: "20px"
  }}>
    <h1>🚀 Cloud Code Runner</h1>

    {/* Code Editor */}
    <Editor
      height="300px"
      defaultLanguage="python"
      value={code}
      onChange={(value) => {
        setCode(value);
        localStorage.setItem("code", value);
      }}
      theme="vs-dark"
    />

    {/* Input Box */}
    <textarea
      placeholder="Enter input (each input in new line)"
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

    {/* Buttons */}
    <div style={{ marginTop: "10px" }}>
      <button
        onClick={runCode}
        style={{
          padding: "10px",
          marginRight: "10px",
          background: "#238636",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer"
        }}
      >
        ▶ Run Code
      </button>

      <button
        onClick={() => navigator.clipboard.writeText(output)}
        style={{
          padding: "10px",
          marginRight: "10px",
          background: "#1f6feb",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer"
        }}
      >
        📋 Copy Output
      </button>

      <button
        onClick={() => setOutput("")}
        style={{
          padding: "10px",
          background: "#da3633",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer"
        }}
      >
        ❌ Clear Output
      </button>
    </div>

    {/* Output Box */}
    <div
      style={{
        marginTop: "20px",
        background: "#010409",
        color: "#00ff9c",
        padding: "10px",
        height: "200px",
        overflowY: "auto",
        borderRadius: "8px",
        fontFamily: "monospace"
      }}
    >
      {output}
    </div>
  </div>
);
}

export default App;