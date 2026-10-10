import React from 'react';
import { HuffmanNode, AlgorithmStep } from '../../types/algorithms';

interface Props {
  tree: HuffmanNode | null;
  codes: Record<string, string>;
  originalBits: number;
  encodedBits: number;
  compressionRatio: string;
  avgBits: string;
  currentStepData?: AlgorithmStep;
  realWorldMode?: boolean;
}

interface TreeNodePos {
  node: HuffmanNode;
  x: number;
  y: number;
  leftPos?: TreeNodePos;
  rightPos?: TreeNodePos;
}

export const HuffmanVisualizer: React.FC<Props> = ({
  tree,
  codes,
  originalBits,
  encodedBits,
  compressionRatio,
  avgBits,
  currentStepData,
  realWorldMode
}) => {
  const activeTree = currentStepData?.activeTree || tree;
  const queueState = currentStepData?.queueState || [];
  const currentCodes = currentStepData?.codes || codes;

  // Compute SVG layout positions for binary tree
  const layoutTree = (node: HuffmanNode | undefined, x: number, y: number, spread: number): TreeNodePos | undefined => {
    if (!node) return undefined;
    const leftPos = node.left ? layoutTree(node.left, x - spread, y + 60, spread * 0.55) : undefined;
    const rightPos = node.right ? layoutTree(node.right, x + spread, y + 60, spread * 0.55) : undefined;
    return { node, x, y, leftPos, rightPos };
  };

  const rootLayout = activeTree ? layoutTree(activeTree, 250, 40, 110) : undefined;

  // Flatten layout to draw edges and nodes in SVG
  const renderSvgTree = (pos: TreeNodePos | undefined): React.ReactNode => {
    if (!pos) return null;

    return (
      <g key={pos.node.id}>
        {pos.leftPos && (
          <>
            <line
              x1={pos.x}
              y1={pos.y}
              x2={pos.leftPos.x}
              y2={pos.leftPos.y}
              stroke="#0ea5e9"
              strokeWidth="2"
              strokeDasharray="3 3"
            />
            <text
              x={(pos.x + pos.leftPos.x) / 2 - 8}
              y={(pos.y + pos.leftPos.y) / 2}
              fill="#38bdf8"
              fontSize="11"
              fontFamily="monospace"
              fontWeight="bold"
            >
              0
            </text>
            {renderSvgTree(pos.leftPos)}
          </>
        )}

        {pos.rightPos && (
          <>
            <line
              x1={pos.x}
              y1={pos.y}
              x2={pos.rightPos.x}
              y2={pos.rightPos.y}
              stroke="#a855f7"
              strokeWidth="2"
              strokeDasharray="3 3"
            />
            <text
              x={(pos.x + pos.rightPos.x) / 2 + 6}
              y={(pos.y + pos.rightPos.y) / 2}
              fill="#c084fc"
              fontSize="11"
              fontFamily="monospace"
              fontWeight="bold"
            >
              1
            </text>
            {renderSvgTree(pos.rightPos)}
          </>
        )}

        {/* Node Circle & Label */}
        <circle
          cx={pos.x}
          cy={pos.y}
          r={pos.node.char ? 18 : 14}
          fill={pos.node.char ? '#065f46' : '#1e1b4b'}
          stroke={pos.node.char ? '#34d399' : '#818cf8'}
          strokeWidth="2"
        />
        <text
          x={pos.x}
          y={pos.node.char ? pos.y - 2 : pos.y + 4}
          textAnchor="middle"
          fill="#ffffff"
          fontSize="11"
          fontWeight="bold"
          fontFamily="monospace"
        >
          {pos.node.char ? `'${pos.node.char}'` : pos.node.freq}
        </text>
        {pos.node.char && (
          <text
            x={pos.x}
            y={pos.y + 10}
            textAnchor="middle"
            fill="#a7f3d0"
            fontSize="9"
            fontFamily="monospace"
          >
            f={pos.node.freq}
          </text>
        )}
      </g>
    );
  };

  return (
    <div className="bg-gray-950/80 p-5 rounded-2xl border border-gray-800 space-y-5 shadow-inner">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-b border-gray-800 pb-4">
        <div className="bg-gray-900/60 p-3 rounded-xl border border-gray-800">
          <div className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">
            {realWorldMode ? 'Raw File Size' : 'Standard 8-Bit'}
          </div>
          <div className="text-xl font-black font-mono text-gray-300 mt-0.5">{originalBits} bits</div>
        </div>
        <div className="bg-gray-900/60 p-3 rounded-xl border border-gray-800">
          <div className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">
            {realWorldMode ? 'Compressed Size' : 'Huffman Encoded'}
          </div>
          <div className="text-xl font-black font-mono text-emerald-400 mt-0.5">{encodedBits} bits</div>
        </div>
        <div className="bg-gray-900/60 p-3 rounded-xl border border-gray-800">
          <div className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">
            Compression Ratio
          </div>
          <div className="text-xl font-black font-mono text-cyan-400 mt-0.5">{compressionRatio}%</div>
        </div>
        <div className="bg-gray-900/60 p-3 rounded-xl border border-gray-800">
          <div className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">
            Avg Bits / Symbol
          </div>
          <div className="text-xl font-black font-mono text-purple-400 mt-0.5">{avgBits}</div>
        </div>
      </div>

      {/* Interactive SVG Tree Visualizer */}
      <div>
        <div className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center justify-between">
          <span>Huffman Binary Tree (Prefix-Free Code Structure):</span>
          <span className="text-[10px] text-gray-500 font-normal">Left: 0 | Right: 1</span>
        </div>
        <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-3 overflow-x-auto flex justify-center min-h-[220px]">
          {rootLayout ? (
            <svg viewBox="0 0 500 240" className="w-full max-w-lg h-56">
              {renderSvgTree(rootLayout)}
            </svg>
          ) : (
            <div className="flex items-center justify-center text-xs text-gray-500 font-mono">
              Tree construction in progress...
            </div>
          )}
        </div>
      </div>

      {/* Priority Queue State & Code Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-2">
            Min-Priority Queue (Subtrees by Freq):
          </div>
          <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto pr-1">
            {queueState.map((q, idx) => (
              <div
                key={idx}
                className="px-2.5 py-1.5 rounded-lg border border-cyan-500/30 bg-cyan-950/30 text-cyan-300 font-mono text-xs flex items-center gap-1.5"
              >
                <span className="font-bold">{q.char ? `'${q.char}'` : `Subtree`}</span>
                <span className="text-[10px] text-gray-400 font-normal">(f={q.freq})</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-2">
            Generated Prefix-Free Binary Codes:
          </div>
          <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto pr-1">
            {Object.entries(currentCodes).map(([char, code]) => (
              <div
                key={char}
                className="px-2.5 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-950/30 text-emerald-300 font-mono text-xs flex items-center gap-2"
              >
                <span className="font-bold text-white">'{char}'</span>
                <span className="text-emerald-400 font-bold bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-500/40">
                  {code}
                </span>
                <span className="text-[10px] text-gray-400 font-normal">({code.length}b)</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
