import { KnapsackItem } from '../../types/algorithms';
import { runFractionalKnapsack } from '../greedy/fractionalKnapsack';

export const solveFractionalKnapsackOptimal = (items: KnapsackItem[], capacity: number) => {
  return runFractionalKnapsack(items, capacity, 'ratio');
};

/**
 * Solves 0/1 Discrete Knapsack via Dynamic Programming
 * Used for DAA comparative analysis: showing why Greedy ratio fails on 0/1 Knapsack
 */
export const solve01KnapsackDP = (items: KnapsackItem[], capacity: number) => {
  const n = items.length;
  const intCap = Math.floor(capacity);
  const dp = Array.from({ length: n + 1 }, () => Array(intCap + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    const item = items[i - 1];
    const w = Math.round(item.weight);
    const v = item.value;
    for (let wCap = 0; wCap <= intCap; wCap++) {
      if (w <= wCap) {
        dp[i][wCap] = Math.max(dp[i - 1][wCap], dp[i - 1][wCap - w] + v);
      } else {
        dp[i][wCap] = dp[i - 1][wCap];
      }
    }
  }

  // Backtrack chosen items
  const chosen: KnapsackItem[] = [];
  let curCap = intCap;
  for (let i = n; i > 0; i--) {
    if (dp[i][curCap] !== dp[i - 1][curCap]) {
      const item = items[i - 1];
      chosen.push({ ...item, fraction: 1 });
      curCap -= Math.round(item.weight);
    }
  }

  return {
    maxValue: dp[n][intCap],
    items: chosen
  };
};