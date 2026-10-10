import { KnapsackItem, AlgorithmStep } from '../../types/algorithms';

export type KnapsackStrategy = 'ratio' | 'max_value' | 'min_weight';

export const runFractionalKnapsack = (
  items: KnapsackItem[],
  capacity: number,
  strategy: KnapsackStrategy = 'ratio'
) => {
  if (items.length === 0 || capacity <= 0) {
    return { totalValue: 0, totalWeight: 0, packed: [], steps: [], sorted: [] };
  }

  const sorted = items.map(item => ({
    ...item,
    ratio: item.weight > 0 ? item.value / item.weight : 0
  }));

  if (strategy === 'ratio') {
    sorted.sort((a, b) => (b.ratio || 0) - (a.ratio || 0) || b.value - a.value);
  } else if (strategy === 'max_value') {
    sorted.sort((a, b) => b.value - a.value || (b.ratio || 0) - (a.ratio || 0));
  } else if (strategy === 'min_weight') {
    sorted.sort((a, b) => a.weight - b.weight || b.value - a.value);
  }

  let currentWeight = 0;
  let totalValue = 0;
  const steps: AlgorithmStep[] = [];
  const packed: KnapsackItem[] = [];

  const strategyDescriptions: Record<KnapsackStrategy, string> = {
    ratio: 'Value / Weight Density (Optimal for Fractional)',
    max_value: 'Maximum Value First (Heuristic)',
    min_weight: 'Minimum Weight First (Heuristic)',
  };

  steps.push({
    stepNumber: 0,
    action: 'Sort Inventory',
    explanation: `Sorted items by ${strategyDescriptions[strategy]}. Capacity: ${capacity}kg.`,
    currentWeight: 0,
    totalValue: 0,
    packed: []
  });

  sorted.forEach((item, idx) => {
    if (currentWeight >= capacity) {
      steps.push({
        stepNumber: idx + 1,
        action: `Skip ${item.name}`,
        explanation: `Knapsack is full (${capacity}kg / ${capacity}kg). Skipped ${item.name} (${item.weight}kg, $${item.value}).`,
        currentWeight,
        totalValue,
        packed: [...packed],
        currentItem: item
      });
      return;
    }

    const remainingCap = capacity - currentWeight;
    if (item.weight <= remainingCap) {
      currentWeight += item.weight;
      totalValue += item.value;
      const takenItem = { ...item, fraction: 1, takenValue: item.value, takenWeight: item.weight };
      packed.push(takenItem);
      steps.push({
        stepNumber: idx + 1,
        action: `Take 100% of ${item.name}`,
        explanation: `Packed 100% of ${item.name} (${item.weight}kg, $${item.value}, ratio ${item.ratio?.toFixed(1)}/kg). Bag weight: ${currentWeight}/${capacity}kg.`,
        currentWeight,
        totalValue,
        packed: [...packed],
        currentItem: takenItem
      });
    } else {
      const fraction = remainingCap / item.weight;
      const valFraction = item.value * fraction;
      currentWeight += remainingCap;
      totalValue += valFraction;
      const takenItem = { ...item, fraction, takenValue: valFraction, takenWeight: remainingCap };
      packed.push(takenItem);
      steps.push({
        stepNumber: idx + 1,
        action: `Take ${(fraction * 100).toFixed(1)}% of ${item.name}`,
        explanation: `Item ${item.name} exceeds available space (${remainingCap}kg). Took fractional ${(fraction * 100).toFixed(1)}% (+${remainingCap}kg, +$${valFraction.toFixed(1)}). Knapsack reached 100% capacity.`,
        currentWeight,
        totalValue,
        packed: [...packed],
        currentItem: takenItem
      });
    }
  });

  return { totalValue, totalWeight: currentWeight, packed, steps, sorted };
};