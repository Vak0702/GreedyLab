import { AlgorithmStep } from '../../types/algorithms';

export const runCoinChangeGreedy = (coins: number[], target: number) => {
  const uniqueCoins = Array.from(new Set(coins.filter(c => c > 0))).sort((a, b) => b - a);
  let rem = target;
  const steps: AlgorithmStep[] = [];
  const chosen: number[] = [];

  steps.push({
    stepNumber: 0,
    action: 'Initialize Cashier',
    explanation: `Target is ${target}. Coin denominations available (sorted descending): [${uniqueCoins.join(', ')}].`,
    remaining: rem,
    chosen: []
  });

  let stepNum = 1;
  for (const coin of uniqueCoins) {
    if (rem >= coin) {
      const takeCount = Math.floor(rem / coin);
      for (let i = 0; i < takeCount; i++) {
        rem -= coin;
        chosen.push(coin);
        steps.push({
          stepNumber: stepNum++,
          action: `Take Coin: ${coin}`,
          explanation: `Locally largest coin <= ${rem + coin} is ${coin}. Took coin ${coin}. Remaining target: ${rem}. Total coins so far: ${chosen.length}.`,
          remaining: rem,
          chosen: [...chosen],
          currentCoin: coin
        });
      }
    } else {
      steps.push({
        stepNumber: stepNum++,
        action: `Skip Coin: ${coin}`,
        explanation: `Coin denomination ${coin} exceeds current remaining target ${rem}. Skipped.`,
        remaining: rem,
        chosen: [...chosen],
        currentCoin: coin
      });
    }
  }

  if (rem > 0) {
    steps.push({
      stepNumber: stepNum,
      action: 'Infeasible Remainder',
      explanation: `Greedy largest-first strategy could not make exact change. Remaining deficit: ${rem}.`,
      remaining: rem,
      chosen: [...chosen]
    });
  }

  return {
    coinsUsed: chosen,
    count: rem === 0 ? chosen.length : Infinity,
    feasible: rem === 0,
    remainder: rem,
    steps
  };
};