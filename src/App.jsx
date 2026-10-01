import { useState } from "react";
import "./App.css";

import {
  buildHuffmanTree,
  encodeHuffman,
  decodeHuffman,
  parseCodeTable,
  formatCodeTable,
} from "./algorithms/huffman";

/* =========================================================
   HUFFMAN FUNCTIONS
   ========================================================= */


/* =========================================================
   PLACEHOLDER ALGORITHMS
   ========================================================= */

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


/* =========================================================
   MAIN APP
   ========================================================= */

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


  /* =======================================================
     PROCESS ENCODE / DECODE
     ======================================================= */

  function handleProcess() {

    setError("");


    /* ---------------- ENCODE ---------------- */

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


    /* ---------------- DECODE ---------------- */

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


  /* =======================================================
     CHANGE ALGORITHM
     ======================================================= */

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


  /* =======================================================
     CHANGE MODE
     ======================================================= */

  function handleModeChange(newMode) {

    // IMPORTANT:
    // We do NOT clear input/output/codeTable here.

    setMode(newMode);

    setError("");
  }


  /* =======================================================
     ALGORITHM LIST
     ======================================================= */

  const algorithms = [
    "Huffman",
    "Algorithm A",
    "Algorithm B",
    "Algorithm C",
    "Algorithm D",
    "Algorithm E",
  ];


  /* =======================================================
     UI
     ======================================================= */

  return (
    <div className="app">

      {/* =================================================
          SIDEBAR
          ================================================= */}

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


      {/* =================================================
          MAIN CONTENT
          ================================================= */}

      <main className="main-content">

        <div className="main-inner">

          {/* PAGE HEADER */}

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


          {/* =================================================
              PLACEHOLDER ALGORITHMS
              ================================================= */}

          {algorithm !== "Huffman" ? (

            <AlgorithmPlaceholder
              name={algorithm}
            />

          ) : (

            <>

              {/* =================================================
                  ENCODE / DECODE AREA
                  ================================================= */}

              {mode === "encode" ? (

                /* ================================
                   ENCODE LAYOUT
                   ================================ */

                <section className="workspace">

                  {/* INPUT */}

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


                  {/* PROCESS */}

                  <div className="process-area">

                    <button
                      className="process-button"
                      onClick={handleProcess}
                      title="Encode"
                    >
                      →
                    </button>

                  </div>


                  {/* OUTPUT */}

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

                /* ================================
                   DECODE LAYOUT
                   ================================ */

                <section
                  className="workspace"
                  style={{
                    gridTemplateColumns:
                      "minmax(0, 1fr) 74px minmax(0, 1fr)",
                  }}
                >

                  {/* CODE TABLE */}

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


                  {/* BINARY INPUT */}

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


                  {/* PROCESS */}

                  <div className="process-area">

                    <button
                      className="process-button"
                      onClick={handleProcess}
                      title="Decode"
                    >
                      →
                    </button>

                  </div>


                  {/* DECODED OUTPUT */}

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


              {/* ERROR */}

              {error && (
                <div className="error">
                  {error}
                </div>
              )}


              {/* =================================================
                  INFORMATION
                  ================================================= */}

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


              {/* =================================================
                  CODE TABLE
                  ================================================= */}

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


              {/* =================================================
                  HUFFMAN TREE
                  ================================================= */}

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