export const solveCoinChangeDP = (coins: number[], target: number) => {
  if (target === 0) return { count: 0, coins: [], feasible: true };
  if (coins.length === 0 || target < 0) return { count: Infinity, coins: [], feasible: false };

  const uniqueCoins = Array.from(new Set(coins.filter(c => c > 0)));
  const dp = Array(target + 1).fill(Infinity);
  const parent = Array(target + 1).fill(-1);
  dp[0] = 0;

  for (let i = 1; i <= target; i++) {
    for (const c of uniqueCoins) {
      if (i - c >= 0 && dp[i - c] !== Infinity) {
        if (dp[i - c] + 1 < dp[i]) {
          dp[i] = dp[i - c] + 1;
          parent[i] = c;
        }
      }
    }
  }

  if (dp[target] === Infinity) {
    return { count: Infinity, coins: [], feasible: false };
  }

  const resultCoins: number[] = [];
  let curr = target;
  while (curr > 0) {
    const coin = parent[curr];
    resultCoins.push(coin);
    curr -= coin;
  }
  resultCoins.sort((a, b) => b - a);

  return { count: dp[target], coins: resultCoins, feasible: true };
};