import { CounterexampleResult, ProblemId } from '../types/algorithms';
import { runCoinChangeGreedy } from '../algorithms/greedy/coinChange';
import { solveCoinChangeDP } from '../algorithms/optimal/coinChangeDP';
import { runActivitySelection } from '../algorithms/greedy/activitySelection';
import { solveActivitySelectionOptimal } from '../algorithms/optimal/activitySelectionOptimal';
import { runFractionalKnapsack } from '../algorithms/greedy/fractionalKnapsack';
import { solveFractionalKnapsackOptimal, solve01KnapsackDP } from '../algorithms/optimal/fractionalKnapsackOptimal';
import { runJobSequencing } from '../algorithms/greedy/jobSequencing';
import { solveJobSequencingOptimal } from '../algorithms/optimal/jobSequencingOptimal';

export const searchCounterexample = (
  problemType: ProblemId | string,
  method: 'exhaustive' | 'randomized',
  maxIterations: number = 300
): CounterexampleResult => {
  // 1. COIN CHANGE PROBLEM
  if (problemType === 'coin_change') {
    let testsRun = 0;
    if (method === 'exhaustive') {
      for (let c2 = 2; c2 <= 10; c2++) {
        for (let c3 = c2 + 1; c3 <= 18; c3++) {
          const coins = [1, c2, c3];
          for (let target = c3 + 1; target <= 40; target++) {
            testsRun++;
            const greedyRes = runCoinChangeGreedy(coins, target);
            const optRes = solveCoinChangeDP(coins, target);
            if (greedyRes.feasible && optRes.feasible && greedyRes.count > optRes.count) {
              return {
                found: true,
                testsRun,
                problemId: 'coin_change',
                input: { coins, target },
                greedy: { count: greedyRes.count, coins: greedyRes.coinsUsed },
                optimal: { count: optRes.count, coins: optRes.coins },
                regret: `${greedyRes.count - optRes.count} extra coin(s)`,
                reason: `The greedy largest-denomination choice (${greedyRes.coinsUsed[0]}) leaves an awkward remainder of ${target - greedyRes.coinsUsed[0]}, forcing multiple small coins. The optimal solution balanced multiple middle coins [${optRes.coins.join(', ')}] requiring fewer total coins.`
              };
            }
            if (testsRun >= maxIterations) break;
          }
          if (testsRun >= maxIterations) break;
        }
        if (testsRun >= maxIterations) break;
      }
    } else {
      for (let t = 0; t < maxIterations; t++) {
        testsRun++;
        const c2 = Math.floor(Math.random() * 8) + 2;
        const c3 = c2 + Math.floor(Math.random() * 10) + 1;
        const coins = [1, c2, c3];
        const target = Math.floor(Math.random() * 30) + c3 + 1;
        const greedyRes = runCoinChangeGreedy(coins, target);
        const optRes = solveCoinChangeDP(coins, target);
        if (greedyRes.feasible && optRes.feasible && greedyRes.count > optRes.count) {
          return {
            found: true,
            testsRun,
            problemId: 'coin_change',
            input: { coins, target },
            greedy: { count: greedyRes.count, coins: greedyRes.coinsUsed },
            optimal: { count: optRes.count, coins: optRes.coins },
            regret: `${greedyRes.count - optRes.count} extra coin(s)`,
            reason: `Random instance discovered a non-canonical failure: Greedy used ${greedyRes.count} coins [${greedyRes.coinsUsed.join('+')}], while Dynamic Programming found an optimal configuration of ${optRes.count} coins [${optRes.coins.join('+')}].`
          };
        }
      }
    }
    return {
      found: false,
      testsRun,
      problemId: 'coin_change',
      message: `No counterexample found within tested search space of ${testsRun} configurations.`
    };
  }

  // 2. ACTIVITY SELECTION (Testing Heuristic: Earliest Start Time)
  if (problemType === 'activity_selection') {
    let testsRun = 0;
    for (let t = 0; t < maxIterations; t++) {
      testsRun++;
      // Generate instances with 3-5 activities
      const acts = [
        { id: 'A1', start: 0, finish: 10 }, // Early start but long duration
        { id: 'A2', start: 1, finish: 4 },
        { id: 'A3', start: 5, finish: 9 },
        { id: 'A4', start: 2, finish: 6 }
      ];

      if (t > 0) {
        // Jitter instances for randomized fuzzing
        acts[0].finish = Math.floor(Math.random() * 5) + 8;
        acts[1].start = Math.floor(Math.random() * 2) + 1;
        acts[1].finish = acts[1].start + Math.floor(Math.random() * 3) + 1;
        acts[2].start = acts[1].finish + 1;
        acts[2].finish = acts[2].start + Math.floor(Math.random() * 4) + 1;
      }

      const heuristicRes = runActivitySelection(acts, 'earliest_start');
      const optRes = solveActivitySelectionOptimal(acts);

      if (heuristicRes.totalSelected < optRes.count) {
        return {
          found: true,
          testsRun,
          problemId: 'activity_selection',
          input: { activities: acts },
          greedy: {
            strategy: 'Earliest Start Time',
            count: heuristicRes.totalSelected,
            selected: heuristicRes.selected.map(a => `${a.id}[${a.start}→${a.finish}]`)
          },
          optimal: {
            strategy: 'Earliest Finish Time (Optimal DP)',
            count: optRes.count,
            selected: optRes.activities.map(a => `${a.id}[${a.start}→${a.finish}]`)
          },
          regret: `${optRes.count - heuristicRes.totalSelected} fewer activity scheduled`,
          reason: `The Earliest-Start heuristic greedily picked activity '${heuristicRes.selected[0]?.id}' because it started earliest, but its long duration monopolized the entire timeline and blocked multiple mutually compatible shorter activities.`
        };
      }
    }
    return {
      found: false,
      testsRun,
      problemId: 'activity_selection',
      message: `No counterexample found within tested search space of ${testsRun} configurations.`
    };
  }

  // 3. FRACTIONAL / DISCRETE KNAPSACK HEURISTICS
  if (problemType === 'fractional_knapsack') {
    let testsRun = 0;
    for (let t = 0; t < maxIterations; t++) {
      testsRun++;
      const cap = 20;
      const items = [
        { name: 'Heavy-Gold', weight: 18, value: 180 }, // ratio 10
        { name: 'Gem-1', weight: 10, value: 120 },       // ratio 12
        { name: 'Gem-2', weight: 10, value: 120 },       // ratio 12
      ];

      if (t > 0) {
        items[0].value = Math.floor(Math.random() * 50) + 150;
        items[1].value = Math.floor(Math.random() * 30) + 100;
        items[2].value = Math.floor(Math.random() * 30) + 100;
      }

      const heur = runFractionalKnapsack(items, cap, 'max_value');
      const opt = solveFractionalKnapsackOptimal(items, cap);

      if (opt.totalValue > heur.totalValue + 0.01) {
        return {
          found: true,
          testsRun,
          problemId: 'fractional_knapsack',
          input: { capacity: cap, items },
          greedy: { strategy: 'Max-Value First', totalValue: heur.totalValue.toFixed(1) },
          optimal: { strategy: 'Value/Weight Ratio', totalValue: opt.totalValue.toFixed(1) },
          regret: `$${(opt.totalValue - heur.totalValue).toFixed(1)} lost value`,
          reason: `The Max-Value heuristic greedily grabbed '${items[0].name}' due to high absolute value ($${items[0].value}), but its bulky weight (${items[0].weight}kg) starved capacity for higher-density items (${items[1].name} and ${items[2].name} with ratio 12/kg).`
        };
      }
    }
    return {
      found: false,
      testsRun,
      problemId: 'fractional_knapsack',
      message: `No counterexample found within tested search space of ${testsRun} configurations.`
    };
  }

  // 4. JOB SEQUENCING (Testing Heuristic: Earliest Deadline First)
  if (problemType === 'job_sequencing') {
    let testsRun = 0;
    for (let t = 0; t < maxIterations; t++) {
      testsRun++;
      const jobs = [
        { id: 'J1', deadline: 1, profit: 10 },
        { id: 'J2', deadline: 2, profit: 100 },
        { id: 'J3', deadline: 2, profit: 90 },
      ];

      if (t > 0) {
        jobs[0].profit = Math.floor(Math.random() * 15) + 5;
        jobs[1].profit = Math.floor(Math.random() * 50) + 80;
        jobs[2].profit = Math.floor(Math.random() * 40) + 70;
      }

      const heurRes = runJobSequencing(jobs, 'earliest_deadline');
      const optRes = solveJobSequencingOptimal(jobs);

      if (optRes.totalProfit > heurRes.totalProfit) {
        return {
          found: true,
          testsRun,
          problemId: 'job_sequencing',
          input: { jobs },
          greedy: {
            strategy: 'Earliest Deadline First',
            profit: heurRes.totalProfit,
            scheduled: heurRes.scheduled.map(j => `${j.id}($${j.profit})`)
          },
          optimal: {
            strategy: 'Highest Profit First (Optimal Greedy)',
            profit: optRes.totalProfit,
            scheduled: optRes.scheduled.map(j => `${j.id}($${j.profit})`)
          },
          regret: `$${optRes.totalProfit - heurRes.totalProfit} lost profit`,
          reason: `Earliest Deadline First prioritized low-value Job J1 simply because its deadline was 1, filling slot 1 and blocking higher-profit tasks that could have been scheduled across available slots.`
        };
      }
    }
    return {
      found: false,
      testsRun,
      problemId: 'job_sequencing',
      message: `No counterexample found within tested search space of ${testsRun} configurations.`
    };
  }

  return {
    found: false,
    testsRun: 0,
    message: 'Selected problem is provably optimal under canonical greedy strategy or search not configured.'
  };
};
