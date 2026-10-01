import { useState } from "react";
import "./App.css";

/* =========================================================
   HUFFMAN FUNCTIONS
   ========================================================= */

function buildHuffmanTree(text) {
  if (!text) return null;

  const frequencies = {};

  for (const char of text) {
    frequencies[char] = (frequencies[char] || 0) + 1;
  }

  let nodes = Object.entries(frequencies).map(([char, frequency]) => ({
    char,
    frequency,
    left: null,
    right: null,
  }));

  if (nodes.length === 1) {
    return {
      root: nodes[0],
      codes: {
        [nodes[0].char]: "0",
      },
      frequencies,
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

  function generateCodes(node, code = "") {
    if (!node) return;

    if (node.char !== null) {
      codes[node.char] = code || "0";
      return;
    }

    generateCodes(node.left, code + "0");
    generateCodes(node.right, code + "1");
  }

  generateCodes(root);

  return {
    root,
    codes,
    frequencies,
  };
}

function encodeHuffman(text, codes) {
  return [...text]
    .map((char) => codes[char])
    .join("");
}

function decodeHuffman(binary, codes) {
  if (!binary) return "";

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


/* =========================================================
   HUFFMAN TREE COMPONENT
   ========================================================= */

function HuffmanTree({ node }) {
  if (!node) return null;

  const isLeaf = node.char !== null;

  return (
    <div className="tree-node-wrapper">

      <div className={`tree-node ${isLeaf ? "leaf" : "parent"}`}>
        {isLeaf ? (
          <>
            <strong>
              {node.char === " " ? "SPACE" : node.char}
            </strong>

            <span>{node.frequency}</span>
          </>
        ) : (
          <strong>{node.frequency}</strong>
        )}
      </div>

      {!isLeaf && (
        <div className="tree-children">

          <div className="tree-branch">
            <span className="branch-label">0</span>

            <HuffmanTree node={node.left} />
          </div>

          <div className="tree-branch">
            <span className="branch-label">1</span>

            <HuffmanTree node={node.right} />
          </div>

        </div>
      )}

    </div>
  );
}


/* =========================================================
   ALGORITHM PLACEHOLDER
   ========================================================= */

function AlgorithmPlaceholder({ name }) {
  return (
    <div className="placeholder">

      <div className="placeholder-icon">
        {name}
      </div>

      <h2>{name}</h2>

      <p>
        This algorithm is ready for implementation.
      </p>

      <div className="placeholder-grid">

        <div>
          <span>STATUS</span>
          <strong>READY</strong>
        </div>

        <div>
          <span>ENCODE</span>
          <strong>PLACEHOLDER</strong>
        </div>

        <div>
          <span>DECODE</span>
          <strong>PLACEHOLDER</strong>
        </div>

      </div>

      <div className="coming-soon">
        Algorithm logic will be added here.
      </div>

    </div>
  );
}


/* =========================================================
   MAIN APP
   ========================================================= */

function App() {

  const [algorithm, setAlgorithm] = useState("Huffman");

  const [mode, setMode] = useState("encode");

  const [input, setInput] = useState("");

  const [output, setOutput] = useState("");

  const [huffmanData, setHuffmanData] = useState(null);

  const [error, setError] = useState("");

  const algorithms = [
    "Huffman",
    "Algorithm A",
    "Algorithm B",
    "Algorithm C",
    "Algorithm D",
    "Algorithm E",
  ];


  /* =======================================================
     HUFFMAN PROCESSING
     ======================================================= */

  const processHuffman = () => {

    setError("");
    setOutput("");

    if (!input.trim()) {
      setError("Please enter some input first.");
      return;
    }


    /* ENCODE */

    if (mode === "encode") {

      const data = buildHuffmanTree(input);

      const encoded = encodeHuffman(
        input,
        data.codes
      );

      setHuffmanData(data);

      setOutput(encoded);

      return;
    }


    /* DECODE */

    if (mode === "decode") {

      if (!huffmanData) {
        setError(
          "A Huffman code table is required for decoding."
        );

        return;
      }

      const decoded = decodeHuffman(
        input,
        huffmanData.codes
      );

      if (decoded === null) {

        setError(
          "Invalid Huffman binary data or incomplete code."
        );

        return;
      }

      setOutput(decoded);
    }
  };


  /* =======================================================
     CHANGE ALGORITHM
     ======================================================= */

  const changeAlgorithm = (name) => {

    setAlgorithm(name);

    setInput("");
    setOutput("");
    setError("");

    if (name !== "Huffman") {
      setHuffmanData(null);
    }
  };


  return (
    <div className="app">


      {/* =================================================
          HEADER
      ================================================= */}

      <header className="topbar">

        <div className="brand">

          <div className="brand-mark">
            E
          </div>

          <div>
            <h1>Encryptr</h1>
            <span>by Istiak</span>
          </div>

        </div>


        <div className="status">
          <span className="status-dot"></span>
          SYSTEM READY
        </div>

      </header>


      {/* =================================================
          MAIN LAYOUT
      ================================================= */}

      <main className="main-layout">


        {/* =================================================
            SIDEBAR
        ================================================= */}

        <aside className="sidebar">

          <div className="menu-title">
            METHODS
          </div>


          <div className="menu">

            {algorithms.map((item) => (

              <button
                key={item}
                className={
                  algorithm === item
                    ? "menu-item active"
                    : "menu-item"
                }
                onClick={() => changeAlgorithm(item)}
              >

                <span className="menu-letter">
                  {item === "Huffman"
                    ? "H"
                    : item.replace("Algorithm ", "")}
                </span>

                <span>{item}</span>

                {algorithm === item && (
                  <span className="menu-arrow">
                    →
                  </span>
                )}

              </button>

            ))}

          </div>


          <div className="sidebar-footer">

            <span>ENCRYPTR</span>

            <small>
              Encoding laboratory
            </small>

          </div>

        </aside>


        {/* =================================================
            CONTENT
        ================================================= */}

        <section className="content">


          {/* =================================================
              PAGE HEADER
          ================================================= */}

          <div className="page-heading">

            <div>

              <div className="eyebrow">
                TEXT PROCESSING / {algorithm.toUpperCase()}
              </div>

              <h2>
                {algorithm}
              </h2>

              <p>
                Encode and decode data using the selected method.
              </p>

            </div>


            <div className="mode-switch">

              <button
                className={
                  mode === "encode"
                    ? "mode active"
                    : "mode"
                }
                onClick={() => {
                  setMode("encode");
                  setOutput("");
                  setError("");
                }}
              >
                Encode
              </button>

              <button
                className={
                  mode === "decode"
                    ? "mode active"
                    : "mode"
                }
                onClick={() => {
                  setMode("decode");
                  setOutput("");
                  setError("");
                }}
              >
                Decode
              </button>

            </div>

          </div>


          {/* =================================================
              HUFFMAN
          ================================================= */}

          {algorithm === "Huffman" && (

            <>

              <div className="workspace">


                {/* INPUT */}

                <div className="panel">

                  <div className="panel-header">

                    <div>
                      <span className="panel-label">
                        INPUT
                      </span>

                      <h3>
                        {mode === "encode"
                          ? "Original Text"
                          : "Encoded Binary"}
                      </h3>
                    </div>

                    <span className="panel-number">
                      01
                    </span>

                  </div>


                  <textarea
                    value={input}
                    onChange={(e) =>
                      setInput(e.target.value)
                    }
                    placeholder={
                      mode === "encode"
                        ? "Enter text to encode..."
                        : "Enter Huffman binary..."
                    }
                  />


                  <div className="character-count">
                    {input.length} characters
                  </div>

                </div>


                {/* PROCESS */}

                <div className="process-arrow">

                  <div className="arrow-line"></div>

                  <button
                    className="process-button"
                    onClick={processHuffman}
                  >
                    {mode === "encode"
                      ? "ENCODE"
                      : "DECODE"}
                  </button>

                </div>


                {/* OUTPUT */}

                <div className="panel output-panel">

                  <div className="panel-header">

                    <div>
                      <span className="panel-label">
                        OUTPUT
                      </span>

                      <h3>
                        {mode === "encode"
                          ? "Binary Data"
                          : "Decoded Text"}
                      </h3>
                    </div>

                    <span className="panel-number">
                      02
                    </span>

                  </div>


                  <div className="output-box">

                    {output ? (
                      output
                    ) : (
                      <span className="empty">
                        Output will appear here...
                      </span>
                    )}

                  </div>


                  {output && (
                    <div className="output-info">
                      {output.length}{" "}
                      {mode === "encode"
                        ? "bits"
                        : "characters"}
                    </div>
                  )}

                </div>

              </div>


              {/* ERROR */}

              {error && (
                <div className="error-box">
                  ⚠ {error}
                </div>
              )}


              {/* =================================================
                  HUFFMAN DETAILS
              ================================================= */}

              {huffmanData && mode === "encode" && (

                <>

                  <section className="section-card">

                    <div className="section-heading">

                      <div>
                        <span className="eyebrow">
                          ANALYSIS
                        </span>

                        <h2>
                          Character Codes
                        </h2>
                      </div>

                      <span className="badge">
                        HUFFMAN
                      </span>

                    </div>


                    <div className="code-grid">

                      {Object.entries(
                        huffmanData.frequencies
                      ).map(
                        ([char, frequency]) => (

                          <div
                            className="code-row"
                            key={char}
                          >

                            <div className="char-box">
                              {char === " "
                                ? "SPACE"
                                : char}
                            </div>

                            <div className="frequency">
                              <span>FREQUENCY</span>
                              <strong>
                                {frequency}
                              </strong>
                            </div>

                            <div className="binary-code">
                              <span>CODE</span>
                              <strong>
                                {huffmanData.codes[char]}
                              </strong>
                            </div>

                          </div>

                        )
                      )}

                    </div>

                  </section>


                  {/* TREE */}

                  <section className="section-card">

                    <div className="section-heading">

                      <div>
                        <span className="eyebrow">
                          VISUALIZATION
                        </span>

                        <h2>
                          Huffman Tree
                        </h2>
                      </div>

                      <div className="tree-legend">
                        <span>0 = LEFT</span>
                        <span>1 = RIGHT</span>
                      </div>

                    </div>


                    <div className="tree-container">

                      <HuffmanTree
                        node={huffmanData.root}
                      />

                    </div>

                  </section>

                </>

              )}


              {/* INFO */}

              <section className="info-grid">

                <div>
                  <span>ALGORITHM</span>
                  <strong>Huffman Coding</strong>
                </div>

                <div>
                  <span>TYPE</span>
                  <strong>Lossless</strong>
                </div>

                <div>
                  <span>OUTPUT</span>
                  <strong>Binary</strong>
                </div>

              </section>

            </>

          )}


          {/* =================================================
              PLACEHOLDER ALGORITHMS
          ================================================= */}

          {algorithm !== "Huffman" && (

            <AlgorithmPlaceholder
              name={algorithm}
            />

          )}

        </section>

      </main>

    </div>
  );
}

export default App;