// src/algorithms/huffman.js

// -----------------------------
// Build Huffman Tree
// -----------------------------
export function buildHuffmanTree(text) {
  if (!text) {
    throw new Error("Input cannot be empty.");
  }

  const frequency = {};

  for (const char of text) {
    frequency[char] = (frequency[char] || 0) + 1;
  }

  let nodes = Object.entries(frequency).map(([char, freq]) => ({
    char,
    freq,
    left: null,
    right: null,
  }));

  // Special case: input contains only one unique character
  if (nodes.length === 1) {
    return nodes[0];
  }

  while (nodes.length > 1) {
    nodes.sort((a, b) => a.freq - b.freq);

    const left = nodes.shift();
    const right = nodes.shift();

    nodes.push({
      char: null,
      freq: left.freq + right.freq,
      left,
      right,
    });
  }

  return nodes[0];
}

// -----------------------------
// Generate Huffman Codes
// -----------------------------
function generateCodes(node, prefix = "", codes = {}) {
  if (!node) {
    return codes;
  }

  // Leaf node
  if (node.char !== null) {
    codes[node.char] = prefix || "0";
    return codes;
  }

  generateCodes(node.left, prefix + "0", codes);
  generateCodes(node.right, prefix + "1", codes);

  return codes;
}

// -----------------------------
// Encode using Huffman
// -----------------------------
export function encodeHuffman(text) {
  if (!text) {
    throw new Error("Input cannot be empty.");
  }

  const tree = buildHuffmanTree(text);
  const codes = generateCodes(tree);

  let encoded = "";

  for (const char of text) {
    encoded += codes[char];
  }

  return {
    encoded,
    codes,
    tree,
  };
}

// -----------------------------
// Decode using Huffman
// -----------------------------
export function decodeHuffman(binary, codes) {
  if (!binary) {
    throw new Error("Binary input cannot be empty.");
  }

  if (!codes || Object.keys(codes).length === 0) {
    throw new Error("Huffman code table cannot be empty.");
  }

  const reverseCodes = {};

  for (const [char, code] of Object.entries(codes)) {
    reverseCodes[code] = char;
  }

  let currentCode = "";
  let decoded = "";

  for (const bit of binary) {
    if (bit !== "0" && bit !== "1") {
      throw new Error("Encoded data must contain only 0 and 1.");
    }

    currentCode += bit;

    if (reverseCodes[currentCode] !== undefined) {
      decoded += reverseCodes[currentCode];
      currentCode = "";
    }
  }

  if (currentCode !== "") {
    throw new Error(
      "Invalid Huffman data: the binary input does not match the supplied code table."
    );
  }

  return decoded;
}

// -----------------------------
// Parse manually entered table
// -----------------------------
export function parseCodeTable(text) {
  const codes = {};

  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  for (const line of lines) {
    const separatorIndex = line.indexOf(":");

    if (separatorIndex === -1) {
      throw new Error(
        `Invalid code table line: "${line}". Use the format: character: code`
      );
    }

    let char = line.slice(0, separatorIndex).trim();
    const code = line.slice(separatorIndex + 1).trim();

    if (!char) {
      throw new Error("A character is missing from the code table.");
    }

    if (!code || !/^[01]+$/.test(code)) {
      throw new Error(
        `Invalid Huffman code for "${char}". Codes must contain only 0 and 1.`
      );
    }

    if (char === "SPACE") {
      char = " ";
    }

    codes[char] = code;
  }

  if (Object.keys(codes).length === 0) {
    throw new Error("Please enter a Huffman code table.");
  }

  return codes;
}

// -----------------------------
// Format code table for display
// -----------------------------
export function formatCodeTable(codes) {
  return Object.entries(codes)
    .map(([char, code]) => {
      const displayChar = char === " " ? "SPACE" : char;
      return `${displayChar}: ${code}`;
    })
    .join("\n");
}