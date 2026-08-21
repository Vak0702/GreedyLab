import { HuffmanNode, AlgorithmStep } from '../../types/algorithms';

export interface HuffmanInputItem {
  char: string;
  freq: number;
}

export const buildHuffmanTreeFromText = (text: string): HuffmanInputItem[] => {
  const map = new Map<string, number>();
  for (const char of text) {
    map.set(char, (map.get(char) || 0) + 1);
  }
  return Array.from(map.entries()).map(([char, freq]) => ({ char, freq }));
};

export const runHuffmanCoding = (items: HuffmanInputItem[]) => {
  if (items.length === 0) {
    return {
      tree: null,
      codes: {},
      originalBits: 0,
      encodedBits: 0,
      compressionRatio: '0.0',
      avgBits: '0.0',
      steps: []
    };
  }

  // Handle single character edge case
  if (items.length === 1) {
    const single = items[0];
    const tree: HuffmanNode = { id: 'node-0', char: single.char, freq: single.freq, code: '0' };
    const codes = { [single.char]: '0' };
    const originalBits = single.freq * 8;
    const encodedBits = single.freq * 1;
    return {
      tree,
      codes,
      originalBits,
      encodedBits,
      compressionRatio: ((1 - encodedBits / Math.max(originalBits, 1)) * 100).toFixed(1),
      avgBits: '1.0',
      steps: [
        {
          stepNumber: 1,
          action: 'Single Character Code',
          explanation: `Single unique character '${single.char}'. Assigned trivial binary code '0'.`,
          queueState: [tree],
          activeTree: tree,
          codes
        }
      ]
    };
  }

  const steps: AlgorithmStep[] = [];
  let nodeIdCounter = 1;

  // Initialize Priority Queue
  let queue: HuffmanNode[] = items.map(item => ({
    id: `leaf-${nodeIdCounter++}`,
    char: item.char,
    freq: item.freq
  }));

  // Sort initially ascending by frequency
  queue.sort((a, b) => a.freq - b.freq);

  steps.push({
    stepNumber: 0,
    action: 'Initialize Min-Priority Queue',
    explanation: `Created ${queue.length} leaf nodes. Priority queue sorted by frequency ascending.`,
    queueState: [...queue]
  });

  let stepNum = 1;

  while (queue.length > 1) {
    // Extract two nodes with lowest frequency
    queue.sort((a, b) => a.freq - b.freq);
    const left = queue.shift()!;
    const right = queue.shift()!;

    const mergedFreq = left.freq + right.freq;
    const parent: HuffmanNode = {
      id: `internal-${nodeIdCounter++}`,
      freq: mergedFreq,
      left,
      right
    };

    queue.push(parent);
    queue.sort((a, b) => a.freq - b.freq);

    const leftDesc = left.char ? `'${left.char}' (${left.freq})` : `Node (${left.freq})`;
    const rightDesc = right.char ? `'${right.char}' (${right.freq})` : `Node (${right.freq})`;

    steps.push({
      stepNumber: stepNum++,
      action: `Merge Subtrees (${left.freq} + ${right.freq} = ${mergedFreq})`,
      explanation: `Greedily selected two lowest-frequency subtrees: ${leftDesc} and ${rightDesc}. Merged into new parent node with combined frequency ${mergedFreq}. Queue size: ${queue.length}.`,
      queueState: [...queue],
      mergedNode: parent,
      activeTree: parent
    });
  }

  const root = queue[0];
  const codes: Record<string, string> = {};

  // Assign binary codes recursively
  const assignCodes = (node: HuffmanNode | undefined, currentCode: string) => {
    if (!node) return;
    if (node.char !== undefined && !node.left && !node.right) {
      node.code = currentCode || '0';
      codes[node.char] = node.code;
      return;
    }
    if (node.left) assignCodes(node.left, currentCode + '0');
    if (node.right) assignCodes(node.right, currentCode + '1');
  };

  assignCodes(root, '');

  // Calculate compression statistics
  const totalFreq = items.reduce((acc, it) => acc + it.freq, 0);
  const originalBits = totalFreq * 8; // Standard ASCII 8-bit
  const encodedBits = items.reduce((acc, it) => acc + it.freq * (codes[it.char]?.length || 1), 0);
  const compressionRatio = ((1 - encodedBits / Math.max(originalBits, 1)) * 100).toFixed(1);
  const avgBits = (encodedBits / Math.max(totalFreq, 1)).toFixed(2);

  steps.push({
    stepNumber: stepNum,
    action: 'Generate Prefix-Free Codes',
    explanation: `Traversed optimal Huffman tree: Left Branch = '0', Right Branch = '1'. Total compressed bits: ${encodedBits} (vs ${originalBits} standard ASCII bits, saving ${compressionRatio}%).`,
    queueState: [root],
    activeTree: root,
    codes
  });

  return {
    tree: root,
    codes,
    originalBits,
    encodedBits,
    compressionRatio,
    avgBits,
    steps
  };
};
