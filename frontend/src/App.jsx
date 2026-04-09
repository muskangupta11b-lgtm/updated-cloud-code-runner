import { useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";

function App() {
  const [code, setCode] = useState("print('Hello World')");
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
    <div style={{ padding: "20px" }}>
      <h1>Cloud Code Runner</h1>

      <Editor
        height="300px"
        defaultLanguage="python"
        value={code}
        onChange={(value) => setCode(value)}
        theme="vs-dark"
      />

      <textarea
  placeholder="Enter input (each input in new line)"
  value={input}
  onChange={(e) => setInput(e.target.value)}
  style={{
    width: "100%",
    height: "80px",
    marginTop: "10px",
    padding: "10px",
  }}
/>

      

      <button
        onClick={runCode}
        style={{
          marginTop: "10px",
          padding: "10px",
          cursor: "pointer",
        }}
      >
        Run Code
      </button>

      <pre
        style={{
          marginTop: "20px",
          background: "black",
          color: "lime",
          padding: "10px",
          minHeight: "100px",
        }}
      >
        {output}
      </pre>
    </div>
  );
}

export default App;