import { JobItem } from '../../types/algorithms';

/**
 * Exact optimal solver for Job Sequencing with Deadlines
 * Checks all possible subsets (or DP / branch-and-bound) to find maximum achievable profit
 */
export const solveJobSequencingOptimal = (jobs: JobItem[]) => {
  if (jobs.length === 0) return { totalProfit: 0, scheduled: [] };

  const maxDeadline = Math.max(...jobs.map(j => j.deadline), 1);
  const n = jobs.length;

  let bestProfit = 0;
  let bestScheduled: JobItem[] = [];

  // For small instances (<= 15 jobs), systematic exhaustive subset testing guarantees mathematical truth
  if (n <= 15) {
    const totalSubsets = 1 << n;
    for (let mask = 0; mask < totalSubsets; mask++) {
      const subset: JobItem[] = [];
      let profit = 0;
      for (let i = 0; i < n; i++) {
        if ((mask >> i) & 1) {
          subset.push(jobs[i]);
          profit += jobs[i].profit;
        }
      }

      if (profit > bestProfit) {
        // Test if subset is schedulable: sort by deadline ascending and check slot occupancy
        const sortedSubset = [...subset].sort((a, b) => a.deadline - b.deadline);
        const slots = Array(maxDeadline + 1).fill(false);
        let valid = true;
        for (const j of sortedSubset) {
          let found = false;
          for (let s = Math.min(j.deadline, maxDeadline); s >= 1; s--) {
            if (!slots[s]) {
              slots[s] = true;
              found = true;
              break;
            }
          }
          if (!found) {
            valid = false;
            break;
          }
        }

        if (valid) {
          bestProfit = profit;
          bestScheduled = subset;
        }
      }
    }
  } else {
    // For larger instances, the standard Greedy high-profit backwards slot is mathematically optimal (Matroid theory)
    const sorted = [...jobs].sort((a, b) => b.profit - a.profit);
    const slots = Array(maxDeadline + 1).fill(null);
    for (const j of sorted) {
      for (let s = Math.min(j.deadline, maxDeadline); s >= 1; s--) {
        if (slots[s] === null) {
          slots[s] = j;
          bestProfit += j.profit;
          bestScheduled.push({ ...j, slotAssigned: s });
          break;
        }
      }
    }
  }

  return { totalProfit: bestProfit, scheduled: bestScheduled };
};
