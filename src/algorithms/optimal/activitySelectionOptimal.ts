import { Activity } from '../../types/algorithms';

/**
 * Computes exact optimal activity selection via interval Dynamic Programming
 * dp[i] = maximum compatible activities chosen from sorted[0...i] including sorted[i]
 */
export const solveActivitySelectionOptimal = (activities: Activity[]) => {
  if (activities.length === 0) return { count: 0, activities: [] };

  const sorted = [...activities].sort((a, b) => a.finish - b.finish || a.start - b.start);
  const n = sorted.length;

  const dp = Array(n).fill(1);
  const parent = Array(n).fill(-1);

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < i; j++) {
      // If activity j finishes before or at activity i's start
      if (sorted[j].finish <= sorted[i].start) {
        if (dp[j] + 1 > dp[i]) {
          dp[i] = dp[j] + 1;
          parent[i] = j;
        }
      }
    }
  }

  let maxLen = 0;
  let bestIdx = 0;
  for (let i = 0; i < n; i++) {
    if (dp[i] > maxLen) {
      maxLen = dp[i];
      bestIdx = i;
    }
  }

  const result: Activity[] = [];
  let curr = bestIdx;
  while (curr !== -1) {
    result.push(sorted[curr]);
    curr = parent[curr];
  }
  result.reverse();

  return { count: maxLen, activities: result };
};