import { useState } from "react";
import "./App.css";

function buildHuffman(text) {
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

  // Special case: only one unique character
  if (nodes.length === 1) {
    return {
      root: nodes[0],
      codes: { [nodes[0].char]: "0" },
      frequencies,
    };
  }

  while (nodes.length > 1) {
    // Sort from smallest to largest frequency
    nodes.sort((a, b) => a.frequency - b.frequency);

    const left = nodes.shift();
    const right = nodes.shift();

    const parent = {
      char: null,
      frequency: left.frequency + right.frequency,
      left,
      right,
    };

    nodes.push(parent);
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

function encodeText(text, codes) {
  return [...text].map((char) => codes[char]).join("");
}

function TreeNode({ node, code = "" }) {
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
            <TreeNode node={node.left} code={code + "0"} />
          </div>

          <div className="tree-branch">
            <span className="branch-label">1</span>
            <TreeNode node={node.right} code={code + "1"} />
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  const [text, setText] = useState(
    "Enter your text "
  );

  const [result, setResult] = useState(null);

  const encode = () => {
    const data = buildHuffman(text);

    if (!data) {
      setResult(null);
      return;
    }

    const encoded = encodeText(text, data.codes);

    setResult({
      ...data,
      encoded,
    });
  };

  const clear = () => {
    setText("");
    setResult(null);
  };

  return (
    <div className="app">

      <header>
        <div className="logo">
          <span>●</span> GreenBox
        </div>

        <p>Huffman Encoding Visualizer</p>
      </header>

      <main>

        <section className="hero">
          <h1>Huffman Encoder</h1>
          <p>
            Enter text and visualize how Huffman compression
            creates binary codes.
          </p>
        </section>

        <section className="encoder-card">

          <h2>Input Text</h2>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter your text here..."
          />

          <div className="actions">
            <button className="primary" onClick={encode}>
              Encode with Huffman
            </button>

            <button className="danger" onClick={clear}>
              Clear
            </button>
          </div>

        </section>

        {result && (
          <>
            <section className="result-card">

              <h2>Encoded Result</h2>

              <div className="encoded-box">
                {result.encoded}
              </div>

              <div className="stats">
                <div>
                  <strong>{text.length}</strong>
                  <span>Characters</span>
                </div>

                <div>
                  <strong>
                    {Object.keys(result.frequencies).length}
                  </strong>
                  <span>Unique Characters</span>
                </div>

                <div>
                  <strong>{result.encoded.length}</strong>
                  <span>Encoded Bits</span>
                </div>
              </div>

            </section>

            <section className="table-card">

              <h2>Huffman Codes</h2>

              <table>
                <thead>
                  <tr>
                    <th>Character</th>
                    <th>Frequency</th>
                    <th>Huffman Code</th>
                  </tr>
                </thead>

                <tbody>
                  {Object.entries(result.frequencies).map(
                    ([char, frequency]) => (
                      <tr key={char}>
                        <td>
                          {char === " " ? "SPACE" : char}
                        </td>

                        <td>{frequency}</td>

                        <td className="code">
                          {result.codes[char]}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>

            </section>

            <section className="tree-card">

              <h2>Huffman Tree</h2>

              <p className="tree-help">
                0 = left branch &nbsp;&nbsp; 1 = right branch
              </p>

              <div className="tree-container">
                <TreeNode node={result.root} />
              </div>

            </section>
          </>
        )}

      </main>

      <footer>
        GreenBox • Huffman Encoding Visualizer
      </footer>

    </div>
  );
}

export default App;