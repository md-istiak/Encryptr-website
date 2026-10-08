```jsx
import { useState } from "react";
import "./App.css";
function buildHuffmanTree(text) {
  if (!text) return null;
  const frequencies = {};
  for (const char of text) {
    frequencies[char] = (frequencies[char] || 0) + 1;
  }
  let nodes = Object.entries(frequencies).map(
    ([char, frequency]) => ({
      char,
      frequency,
      left: null,
      right: null,
    })
  );
  if (nodes.length === 1) {
    const root = {
      char: null,
      frequency: nodes[0].frequency,
      left: nodes[0],
      right: null,
    };
    return {
      root,
      frequencies,
      codes: {
        [nodes[0].char]: "0",
      },
    };
  }
  while (nodes.length > 1) {
    nodes.sort((a, b) => a.frequency - b.frequency);
    const left = nodes.shift();
    const right = nodes.shift();
    nodes.push({
      char: null,
      frequency: left.frequency + right.frequency,
      left,
      right,
    });
  }
  const root = nodes[0];
  const codes = {};
  function generateCodes(node, code) {
    if (!node) return;
    if (node.char !== null) {
      codes[node.char] = code;
      return;
    }
    generateCodes(node.left, code + "0");
    generateCodes(node.right, code + "1");
  }
  generateCodes(root, "");
  return {
    root,
    frequencies,
    codes,
  };
}
function encodeHuffman(text, codes) {
  return [...text]
    .map((char) => codes[char])
    .join("");
}
function decodeHuffman(binary, codes) {
  const reverseCodes = {};
  for (const [char, code] of Object.entries(codes)) {
    reverseCodes[code] = char;
  }
  let current = "";
  let result = "";
  for (const bit of binary) {
    if (bit !== "0" && bit !== "1") {
      return null;
    }
    current += bit;
    if (reverseCodes[current] !== undefined) {
      result += reverseCodes[current];
      current = "";
    }
  }
  if (current !== "") {
    return null;
  }
  return result;
}
function parseCodeTable(text) {
  const codes = {};
  const lines = text.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const separator = trimmed.indexOf(":");
    if (separator === -1) {
      return null;
    }
    let char = trimmed.slice(0, separator).trim();
    const code = trimmed.slice(separator + 1).trim();
    if (char === "SPACE") {
      char = " ";
    }
    if (!char || !/^[01]+$/.test(code)) {
      return null;
    }
    codes[char] = code;
  }
  return Object.keys(codes).length > 0
    ? codes
    : null;
}
function formatCodeTable(codes) {
  return Object.entries(codes)
    .map(([char, code]) => {
      const displayChar =
        char === " " ? "SPACE" : char;
      return `${displayChar}: ${code}`;
    })
    .join("\n");
}
function HuffmanTree({ node }) {
  if (!node) return null;
  const isLeaf = node.char !== null;
  return (
    <div className="tree-node">
      <div className={`tree-box ${isLeaf ? "leaf" : ""}`}>
        {isLeaf ? (
          <>
            <span className="tree-character">
              {node.char === " "
                ? "SPACE"
                : node.char}
            </span>
            <span className="tree-frequency">
              {node.frequency}
            </span>
          </>
        ) : (
          <span className="tree-frequency">
            {node.frequency}
          </span>
        )}
      </div>
      {!isLeaf && (
        <div className="tree-children">
          {node.left && (
            <div className="tree-branch">
              <span className="branch-label">
                0
              </span>
              <HuffmanTree
                node={node.left}
              />
            </div>
          )}
          {node.right && (
            <div className="tree-branch">
              <span className="branch-label">
                1
              </span>
              <HuffmanTree
                node={node.right}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
function AlgorithmPlaceholder({ name }) {
  return (
    <div className="placeholder">
      <div className="placeholder-icon">
        {name.charAt(name.length - 1)}
      </div>
      <h2>{name}</h2>
      <p>
        This algorithm is ready to be implemented.
        The interface and styling are already prepared.
      </p>
      <span className="placeholder-badge">
        READY / PLACEHOLDER
      </span>
    </div>
  );
}
export default function App() {
  const [algorithm, setAlgorithm] =
    useState("Huffman");
  const [mode, setMode] =
    useState("encode");
  const [input, setInput] =
    useState("");
  const [output, setOutput] =
    useState("");
  const [codeTable, setCodeTable] =
    useState("");
  const [huffmanData, setHuffmanData] =
    useState(null);
  const [error, setError] =
    useState("");
  function handleProcess() {
    setError("");
    if (mode === "encode") {
      if (!input.trim()) {
        setOutput("");
        setError(
          "Please enter some text first."
        );
        return;
      }
      const data =
        buildHuffmanTree(input);
      if (!data) {
        setError(
          "Unable to build Huffman tree."
        );
        return;
      }
      const encoded =
        encodeHuffman(
          input,
          data.codes
        );
      setHuffmanData(data);
      setCodeTable(
        formatCodeTable(data.codes)
      );
      setOutput(encoded);
      return;
    }
    if (!input.trim()) {
      setOutput("");
      setError(
        "Please enter Huffman binary data."
      );
      return;
    }
    const codes =
      parseCodeTable(codeTable);
    if (!codes) {
      setError(
        "Please enter a valid Huffman code table."
      );
      return;
    }
    const decoded =
      decodeHuffman(
        input.trim(),
        codes
      );
    if (decoded === null) {
      setError(
        "Invalid Huffman binary or code table."
      );
      return;
    }
    setOutput(decoded);
  }
  function handleAlgorithmChange(name) {
    setAlgorithm(name);
    setInput("");
    setOutput("");
    setCodeTable("");
    setError("");
    if (name !== "Huffman") {
      setHuffmanData(null);
    }
  }
  function handleModeChange(newMode) {
    setMode(newMode);
    setError("");
  }
  const algorithms = [
    "Huffman",
    "Algorithm A",
    "Algorithm B",
    "Algorithm C",
    "Algorithm D",
    "Algorithm E",
  ];
  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            E
          </div>
          <div className="brand-text">
            <h1>
              Encryptr
            </h1>
            <p>
              by Istiak
            </p>
          </div>
        </div>
        <div className="menu-title">
          Algorithms
        </div>
        <nav className="menu">
          {algorithms.map((name) => (
            <button
              key={name}
              className={
                algorithm === name
                  ? "active"
                  : ""
              }
              onClick={() =>
                handleAlgorithmChange(name)
              }
            >
              {name}
            </button>
          ))}
        </nav>
      </aside>
      <main className="main-content">
        <div className="main-inner">
          <header className="page-header">
            <div>
              <h2>
                {algorithm}
              </h2>
              <p>
                Encode and decode your data using
                the selected algorithm.
              </p>
            </div>
          </header>
          {algorithm !== "Huffman" ? (
            <AlgorithmPlaceholder
              name={algorithm}
            />
          ) : (
            <>
              {mode === "encode" ? (
                <section className="workspace">
                  <div className="panel">
                    <div className="panel-header">
                      <div>
                        <div className="panel-title">
                          Input
                        </div>
                        <div className="panel-subtitle">
                          Enter the text you want to encode.
                        </div>
                      </div>
                      <div className="mode-switch">
                        <button
                          className="active"
                          onClick={() =>
                            handleModeChange("encode")
                          }
                        >
                          Encode
                        </button>
                        <button
                          onClick={() =>
                            handleModeChange("decode")
                          }
                        >
                          Decode
                        </button>
                      </div>
                    </div>
                    <textarea
                      value={input}
                      onChange={(e) =>
                        setInput(e.target.value)
                      }
                      placeholder="Type or paste your text here..."
                    />
                  </div>
                  <div className="process-area">
                    <button
                      className="process-button"
                      onClick={handleProcess}
                      title="Encode"
                    >
                      →
                    </button>
                  </div>
                  <div className="panel">
                    <div className="panel-header">
                      <div>
                        <div className="panel-title">
                          Output
                        </div>
                        <div className="panel-subtitle">
                          Generated Huffman binary.
                        </div>
                      </div>
                    </div>
                    <textarea
                      value={output}
                      readOnly
                      placeholder="Your encoded result will appear here..."
                    />
                  </div>
                </section>
              ) : (
                <section
                  className="workspace"
                  style={{
                    gridTemplateColumns:
                      "minmax(0, 1fr) 74px minmax(0, 1fr)",
                  }}
                >
                  <div
                    className="panel"
                    style={{
                      gridColumn:
                        "1 / -1",
                      minHeight:
                        "260px",
                    }}
                  >
                    <div className="panel-header">
                      <div>
                        <div className="panel-title">
                          Huffman Code Table
                        </div>
                        <div className="panel-subtitle">
                          Enter one character and its
                          binary code per line.
                        </div>
                      </div>
                      <div className="mode-switch">
                        <button
                          onClick={() =>
                            handleModeChange("encode")
                          }
                        >
                          Encode
                        </button>
                        <button
                          className="active"
                          onClick={() =>
                            handleModeChange("decode")
                          }
                        >
                          Decode
                        </button>
                      </div>
                    </div>
                    <textarea
                      value={codeTable}
                      onChange={(e) =>
                        setCodeTable(e.target.value)
                      }
                      placeholder={`Example:
a: 0
b: 10
c: 110
d: 111
SPACE: 100`}
                    />
                  </div>
                  <div className="panel">
                    <div className="panel-header">
                      <div>
                        <div className="panel-title">
                          Binary Input
                        </div>
                        <div className="panel-subtitle">
                          Enter the Huffman encoded data.
                        </div>
                      </div>
                    </div>
                    <textarea
                      value={input}
                      onChange={(e) =>
                        setInput(e.target.value)
                      }
                      placeholder="Example: 010110111..."
                    />
                  </div>
                  <div className="process-area">
                    <button
                      className="process-button"
                      onClick={handleProcess}
                      title="Decode"
                    >
                      →
                    </button>
                  </div>
                  <div className="panel">
                    <div className="panel-header">
                      <div>
                        <div className="panel-title">
                          Decoded Output
                        </div>
                        <div className="panel-subtitle">
                          Original text.
                        </div>
                      </div>
                    </div>
                    <textarea
                      value={output}
                      readOnly
                      placeholder="Your decoded text will appear here..."
                    />
                  </div>
                </section>
              )}
              {error && (
                <div className="error">
                  {error}
                </div>
              )}
              <section className="info-grid">
                <div className="info-card">
                  <h3>
                    Algorithm
                  </h3>
                  <p>
                    Huffman Coding
                  </p>
                </div>
                <div className="info-card">
                  <h3>
                    Mode
                  </h3>
                  <p>
                    {mode === "encode"
                      ? "Encoding"
                      : "Decoding"}
                  </p>
                </div>
                <div className="info-card">
                  <h3>
                    Characters
                  </h3>
                  <p>
                    {input.length}
                  </p>
                </div>
              </section>
              {huffmanData && (
                <section className="section">
                  <div className="section-header">
                    <div>
                      <h2>
                        Generated Huffman Code Table
                      </h2>
                      <p>
                        Character frequencies and
                        generated binary codes.
                      </p>
                    </div>
                  </div>
                  <div className="table-container">
                    <table className="code-table">
                      <thead>
                        <tr>
                          <th>
                            Character
                          </th>
                          <th>
                            Frequency
                          </th>
                          <th>
                            Code
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(
                          huffmanData.codes
                        ).map(
                          ([char, code]) => (
                            <tr key={char}>
                              <td>
                                {char === " "
                                  ? "SPACE"
                                  : char}
                              </td>
                              <td>
                                {
                                  huffmanData
                                    .frequencies[
                                      char
                                    ]
                                }
                              </td>
                              <td>
                                <span className="code">
                                  {code}
                                </span>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}
              {huffmanData && (
                <section className="section">
                  <div className="section-header">
                    <div>
                      <h2>
                        Huffman Tree
                      </h2>
                      <p>
                        Visual representation of the
                        generated Huffman structure.
                      </p>
                    </div>
                  </div>
                  <div className="tree-container">
                    <div className="huffman-tree">
                      <HuffmanTree
                        node={huffmanData.root}
                      />
                    </div>
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
```
