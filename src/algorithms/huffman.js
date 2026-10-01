// src/algorithms/huffman.js

// =========================================================
// BUILD HUFFMAN TREE
// =========================================================

export function buildHuffmanTree(text) {
  if (!text) {
    return null;
  }

  // Calculate character frequencies
  const frequencies = {};

  for (const char of text) {
    frequencies[char] = (frequencies[char] || 0) + 1;
  }

  // Create initial nodes
  let nodes = Object.entries(frequencies).map(([char, freq]) => ({
    char,
    freq,
    left: null,
    right: null,
  }));

  // Special case: only one unique character
  if (nodes.length === 1) {
    const root = nodes[0];

    return {
      root,
      codes: {
        [root.char]: "0",
      },
      frequencies,
    };
  }

  // Build tree
  while (nodes.length > 1) {
    nodes.sort((a, b) => a.freq - b.freq);

    const left = nodes.shift();
    const right = nodes.shift();

    const parent = {
      char: null,
      freq: left.freq + right.freq,
      left,
      right,
    };

    nodes.push(parent);
  }

  const root = nodes[0];

  // Generate codes
  const codes = {};

  function generateCodes(node, prefix = "") {
    if (!node) return;

    // Leaf node
    if (node.char !== null) {
      codes[node.char] = prefix || "0";
      return;
    }

    generateCodes(node.left, prefix + "0");
    generateCodes(node.right, prefix + "1");
  }

  generateCodes(root);

  return {
    root,
    codes,
    frequencies,
  };
}


// =========================================================
// HUFFMAN ENCODE
// =========================================================

export function encodeHuffman(text, codes) {
  if (!text) {
    return "";
  }

  if (!codes) {
    throw new Error("Huffman codes are missing.");
  }

  let encoded = "";

  for (const char of text) {
    if (codes[char] === undefined) {
      throw new Error(
        `No Huffman code exists for character: "${char}"`
      );
    }

    encoded += codes[char];
  }

  return encoded;
}


// =========================================================
// HUFFMAN DECODE
// =========================================================

export function decodeHuffman(binary, codes) {
  if (!binary) {
    return "";
  }

  if (!codes || Object.keys(codes).length === 0) {
    return null;
  }

  const reverseCodes = {};

  for (const [char, code] of Object.entries(codes)) {
    reverseCodes[code] = char;
  }

  let currentCode = "";
  let decoded = "";

  for (const bit of binary) {
    if (bit !== "0" && bit !== "1") {
      return null;
    }

    currentCode += bit;

    if (reverseCodes[currentCode] !== undefined) {
      decoded += reverseCodes[currentCode];
      currentCode = "";
    }
  }

  // Leftover bits mean invalid/incomplete data
  if (currentCode !== "") {
    return null;
  }

  return decoded;
}


// =========================================================
// PARSE MANUAL CODE TABLE
// =========================================================

export function parseCodeTable(text) {
  if (!text || !text.trim()) {
    return null;
  }

  const codes = {};

  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  for (const line of lines) {
    const separatorIndex = line.indexOf(":");

    if (separatorIndex === -1) {
      return null;
    }

    let char = line
      .slice(0, separatorIndex)
      .trim();

    const code = line
      .slice(separatorIndex + 1)
      .trim();

    if (!char || !code) {
      return null;
    }

    if (!/^[01]+$/.test(code)) {
      return null;
    }

    // SPACE represents actual space
    if (char === "SPACE") {
      char = " ";
    }

    codes[char] = code;
  }

  return Object.keys(codes).length > 0
    ? codes
    : null;
}


// =========================================================
// FORMAT CODE TABLE
// =========================================================

export function formatCodeTable(codes) {
  if (!codes) {
    return "";
  }

  return Object.entries(codes)
    .map(([char, code]) => {
      const displayChar =
        char === " " ? "SPACE" : char;

      return `${displayChar}: ${code}`;
    })
    .join("\n");
}