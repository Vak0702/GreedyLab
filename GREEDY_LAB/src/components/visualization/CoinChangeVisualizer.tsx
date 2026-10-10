import React from 'react';
import { AlgorithmStep } from '../../types/algorithms';

interface Props {
  coins: number[];
  target: number;
  currentStepData?: AlgorithmStep;
  realWorldMode?: boolean;
}

export const CoinChangeVisualizer: React.FC<Props> = ({ coins, target, currentStepData, realWorldMode }) => {
  const chosen = currentStepData?.chosen || [];
  const remaining = currentStepData?.remaining ?? target;
  const currentCoin = currentStepData?.currentCoin;
  const progressPercent = target > 0 ? Math.min(100, Math.max(0, ((target - remaining) / target) * 100)) : 0;

  return (
    <div className="bg-gray-950/80 p-5 rounded-2xl border border-gray-800 space-y-5 shadow-inner">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-b border-gray-800 pb-4">
        <div className="bg-gray-900/60 p-3 rounded-xl border border-gray-800">
          <div className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">
            {realWorldMode ? 'Change Due' : 'Initial Target Amount'}
          </div>
          <div className="text-2xl font-black text-cyan-400 font-mono mt-0.5">${target}</div>
        </div>
        <div className="bg-gray-900/60 p-3 rounded-xl border border-gray-800">
          <div className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">
            {realWorldMode ? 'Remaining Balance' : 'Remaining Target'}
          </div>
          <div className={`text-2xl font-black font-mono mt-0.5 ${remaining === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
            ${remaining}
          </div>
        </div>
        <div className="bg-gray-900/60 p-3 rounded-xl border border-gray-800">
          <div className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">
            {realWorldMode ? 'Coins Dispensed' : 'Coins Count'}
          </div>
          <div className="text-2xl font-black text-purple-400 font-mono mt-0.5">{chosen.length}</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-[11px] font-mono text-gray-400">
          <span>Target Progress</span>
          <span>{progressPercent.toFixed(0)}% fulfilled</span>
        </div>
        <div className="h-3 w-full bg-gray-900 rounded-full overflow-hidden border border-gray-800 p-0.5">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-emerald-500 rounded-full transition-all duration-300 shadow-lg shadow-cyan-500/20"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Available Denominations */}
      <div>
        <div className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-2.5 flex items-center justify-between">
          <span>{realWorldMode ? 'Cash Register Till:' : 'Available Denominations (Sorted):'}</span>
          <span className="text-[10px] text-gray-500 font-normal">Greedy tests highest first</span>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {coins.map((c, i) => {
            const isCurrentlyTested = currentCoin === c;
            return (
              <div
                key={i}
                className={`w-12 h-12 rounded-2xl border flex flex-col items-center justify-center font-mono font-bold transition-all shadow-md ${
                  isCurrentlyTested
                    ? 'border-amber-400 bg-amber-500/20 text-amber-300 scale-110 shadow-amber-500/30 animate-pulse'
                    : 'border-cyan-500/30 bg-cyan-950/40 text-cyan-300 hover:border-cyan-400/60'
                }`}
              >
                <span className="text-xs text-gray-400 font-sans font-normal leading-none">$</span>
                <span className="text-sm font-bold leading-tight">{c}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chosen Coins Stream */}
      <div>
        <div className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-2.5 flex items-center justify-between">
          <span>{realWorldMode ? 'Dispensed Coin Tray:' : 'Greedy Choice Stream:'}</span>
          <span className="text-[10px] text-emerald-400 font-mono font-bold">
            {chosen.length > 0 ? `Sum: $${chosen.reduce((a, b) => a + b, 0)}` : ''}
          </span>
        </div>
        <div className="min-h-[72px] p-3.5 rounded-xl bg-gray-900/70 border border-gray-800 flex flex-wrap items-center gap-2.5">
          {chosen.length === 0 ? (
            <span className="text-xs text-gray-500 font-mono italic">Waiting for greedy cashier choice...</span>
          ) : (
            chosen.map((c, idx) => (
              <div
                key={idx}
                className="w-11 h-11 rounded-2xl border border-emerald-400/80 bg-emerald-500/20 text-emerald-300 font-mono font-bold flex flex-col items-center justify-center shadow-lg shadow-emerald-500/10 transition-transform duration-200"
              >
                <span className="text-[9px] text-emerald-400/80 font-sans leading-none">$</span>
                <span className="text-sm font-black leading-tight">{c}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};