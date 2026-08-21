import React from 'react';
import { JobItem, AlgorithmStep } from '../../types/algorithms';

interface Props {
  jobs: JobItem[];
  currentStepData?: AlgorithmStep;
  realWorldMode?: boolean;
}

export const JobSequencingVisualizer: React.FC<Props> = ({ jobs, currentStepData, realWorldMode }) => {
  const maxDeadline = Math.max(...jobs.map(j => j.deadline), 4);
  const slots = currentStepData?.scheduleSlots || Array(maxDeadline + 1).fill(null);
  const currentJob = currentStepData?.currentJob;
  const currentProfit = currentStepData?.currentProfit || 0;

  const validSlots = Array.from({ length: maxDeadline }, (_, i) => i + 1);

  return (
    <div className="bg-gray-950/80 p-5 rounded-2xl border border-gray-800 space-y-5 shadow-inner">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-b border-gray-800 pb-4">
        <div className="bg-gray-900/60 p-3 rounded-xl border border-gray-800">
          <div className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">
            {realWorldMode ? 'Total Revenue Earned' : 'Accumulated Profit'}
          </div>
          <div className="text-2xl font-black font-mono text-emerald-400 mt-0.5">
            ${currentProfit}
          </div>
        </div>
        <div className="bg-gray-900/60 p-3 rounded-xl border border-gray-800">
          <div className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">
            {realWorldMode ? 'Completed Tasks' : 'Scheduled Jobs'}
          </div>
          <div className="text-2xl font-black font-mono text-cyan-400 mt-0.5">
            {slots.filter(s => s !== null).length} / {jobs.length}
          </div>
        </div>
        <div className="bg-gray-900/60 p-3 rounded-xl border border-gray-800">
          <div className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">
            Time Horizon
          </div>
          <div className="text-2xl font-black font-mono text-purple-400 mt-0.5">
            {maxDeadline} Slots
          </div>
        </div>
      </div>

      {/* Time Slot Schedule Grid */}
      <div>
        <div className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-2.5 flex items-center justify-between">
          <span>{realWorldMode ? 'Production Schedule Timeline:' : 'Discrete Time Slots Allocation:'}</span>
          <span className="text-[10px] text-gray-500 font-normal">1 unit execution time per slot</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
          {validSlots.map(slotNum => {
            const occupiedJob = slots[slotNum];
            const isJustAssigned = currentJob?.id === occupiedJob?.id;

            return (
              <div
                key={slotNum}
                className={`p-3 rounded-xl border flex flex-col justify-between transition-all min-h-[90px] ${
                  occupiedJob
                    ? isJustAssigned
                      ? 'border-amber-400 bg-amber-500/20 shadow-lg shadow-amber-500/20 scale-105 ring-2 ring-amber-400/60'
                      : 'border-emerald-500/40 bg-emerald-950/20 text-emerald-200'
                    : 'border-gray-800 bg-gray-900/40 border-dashed text-gray-600'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-gray-400 font-bold">Slot {slotNum}</span>
                  <span className="text-[10px] text-gray-500">[{slotNum - 1}→{slotNum}]</span>
                </div>

                {occupiedJob ? (
                  <div className="mt-2">
                    <div className="font-bold text-white text-sm font-mono flex items-center justify-between">
                      <span>{occupiedJob.id}</span>
                      <span className="text-emerald-400 text-xs">${occupiedJob.profit}</span>
                    </div>
                    <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                      Deadline: t={occupiedJob.deadline}
                    </div>
                  </div>
                ) : (
                  <div className="mt-2 text-center text-xs text-gray-600 font-mono">
                    [Empty]
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Available Jobs Queue */}
      <div>
        <div className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center justify-between">
          <span>Candidate Jobs:</span>
          <span className="text-[10px] text-gray-500 font-normal">Sorted by strategy heuristic</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {jobs.map(j => {
            const isAssigned = slots.some(s => s?.id === j.id);
            const isCurrent = currentJob?.id === j.id;

            return (
              <div
                key={j.id}
                className={`px-3 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-2 ${
                  isCurrent
                    ? 'border-amber-400 bg-amber-500/20 text-amber-300 ring-2 ring-amber-400/40 animate-pulse'
                    : isAssigned
                    ? 'border-emerald-500/30 bg-emerald-950/30 text-emerald-300'
                    : 'border-gray-800 bg-gray-900/60 text-gray-400'
                }`}
              >
                <span className="font-bold">{j.id}</span>
                <span className="text-emerald-400 font-semibold">${j.profit}</span>
                <span className="text-gray-500 text-[10px]">d={j.deadline}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
