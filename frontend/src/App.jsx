import { useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";

function App() {
  const [code, setCode] = useState("print('Hello World')");
  const [output, setOutput] = useState("");

  const runCode = async () => {
    setOutput("Running...");

    try {
      const res = await axios.post("http://localhost:5000/run", {
        code,
      });

      setOutput(res.data.output || res.data.error);
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