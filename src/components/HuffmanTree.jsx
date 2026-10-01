// src/components/HuffmanTree.jsx

export default function HuffmanTree({ node }) {
  if (!node) {
    return null;
  }

  const isLeaf = node.char !== null;

  return (
    <div className="tree-node">
      <div className="tree-box">
        <div>
          {isLeaf
            ? node.char === " "
              ? "SPACE"
              : node.char
            : "•"}
        </div>

        <div>
          {node.freq}
        </div>
      </div>

      {!isLeaf && (
        <div className="tree-children">
          {node.left && (
            <div className="tree-branch">
              <span className="branch-label">0</span>

              <HuffmanTree node={node.left} />
            </div>
          )}

          {node.right && (
            <div className="tree-branch">
              <span className="branch-label">1</span>

              <HuffmanTree node={node.right} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}