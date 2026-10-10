import React from 'react';
import { KnapsackItem, AlgorithmStep } from '../../types/algorithms';

interface Props {
  capacity: number;
  currentStepData?: AlgorithmStep;
  realWorldMode?: boolean;
}

export const KnapsackVisualizer: React.FC<Props> = ({ capacity, currentStepData, realWorldMode }) => {
  const packed = currentStepData?.packed || [];
  const currentWeight = currentStepData?.currentWeight || 0;
  const totalValue = currentStepData?.totalValue || 0;
  const capPercent = capacity > 0 ? Math.min(100, (currentWeight / capacity) * 100) : 0;
  const currentItem = currentStepData?.currentItem;

  return (
    <div className="bg-gray-950/80 p-5 rounded-2xl border border-gray-800 space-y-5 shadow-inner">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-b border-gray-800 pb-4">
        <div className="bg-gray-900/60 p-3 rounded-xl border border-gray-800">
          <div className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">
            {realWorldMode ? 'Cargo Weight Limit' : 'Capacity Load'}
          </div>
          <div className="text-xl font-black font-mono text-cyan-400 mt-0.5">
            {currentWeight.toFixed(1)} / {capacity} kg
          </div>
        </div>
        <div className="bg-gray-900/60 p-3 rounded-xl border border-gray-800">
          <div className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">
            {realWorldMode ? 'Total Supply Value' : 'Accumulated Value'}
          </div>
          <div className="text-xl font-black font-mono text-emerald-400 mt-0.5">
            ${totalValue.toFixed(1)}
          </div>
        </div>
        <div className="bg-gray-900/60 p-3 rounded-xl border border-gray-800">
          <div className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">
            Utilization Rate
          </div>
          <div className="text-xl font-black font-mono text-purple-400 mt-0.5">
            {capPercent.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Capacity Load Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[11px] font-mono text-gray-400">
          <span>{realWorldMode ? 'Vehicle Space' : 'Knapsack Volume Capacity'}</span>
          <span className={capPercent >= 100 ? 'text-amber-400 font-bold' : 'text-cyan-400'}>
            {capacity - currentWeight > 0.001 ? `${(capacity - currentWeight).toFixed(1)} kg available` : 'FULL CAPACITY'}
          </span>
        </div>
        <div className="h-4 w-full bg-gray-900 rounded-full overflow-hidden border border-gray-800 p-0.5">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-emerald-400 rounded-full transition-all duration-300 shadow-md shadow-cyan-500/20"
            style={{ width: `${capPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Packed Items Roster */}
      <div>
        <div className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-2.5 flex items-center justify-between">
          <span>{realWorldMode ? 'Loaded Cargo Manifest:' : 'Packed Items (Fractional Manifest):'}</span>
          <span className="text-[10px] text-gray-500 font-normal">
            {packed.length} item(s) in knapsack
          </span>
        </div>

        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          {packed.length === 0 ? (
            <div className="p-4 rounded-xl bg-gray-900/40 border border-gray-800/80 text-xs font-mono text-gray-500 text-center italic">
              Knapsack is currently empty...
            </div>
          ) : (
            packed.map((item, idx) => {
              const fraction = item.fraction || 1;
              const isFractional = fraction < 0.999;
              return (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs font-mono transition-all ${
                    isFractional
                      ? 'border-amber-500/40 bg-amber-950/20 text-amber-200'
                      : 'border-cyan-500/30 bg-cyan-950/20 text-cyan-200'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{item.name}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          isFractional
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {(fraction * 100).toFixed(1)}% Packed
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-400">
                      Original: {item.weight}kg, ${item.value} (Ratio: ${(item.value / item.weight).toFixed(1)}/kg)
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <div className="text-emerald-400 font-bold text-sm">+${item.takenValue?.toFixed(1)}</div>
                    <div className="text-gray-400 text-[10px]">{item.takenWeight?.toFixed(1)} kg loaded</div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};