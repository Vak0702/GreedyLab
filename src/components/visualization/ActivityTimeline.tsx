import React from 'react';
import { Activity, AlgorithmStep } from '../../types/algorithms';

interface Props {
  activities: Activity[];
  currentStepData?: AlgorithmStep;
  realWorldMode?: boolean;
}

export const ActivityTimeline: React.FC<Props> = ({ activities, currentStepData, realWorldMode }) => {
  const maxTime = Math.max(...activities.map(a => a.finish), 12);
  const timeMarkers = Array.from({ length: maxTime + 1 }, (_, i) => i);
  const selectedIds = currentStepData?.selectedIds || [];
  const rejectedIds = currentStepData?.rejectedIds || [];
  const currentId = currentStepData?.currentId;

  return (
    <div className="w-full bg-gray-950/80 p-5 rounded-2xl border border-gray-800 space-y-4 shadow-inner">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-400 border-b border-gray-800 pb-3">
        <div className="font-mono flex items-center gap-2">
          <span className="text-cyan-400 font-bold">{realWorldMode ? 'Room Booking Timeline' : 'Activity Schedule'}</span>
          <span className="text-gray-500 font-normal">[0h → {maxTime}h]</span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px]">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-emerald-500 rounded"></span> Selected ({selectedIds.length})</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-rose-500 rounded"></span> Conflict/Rejected ({rejectedIds.length})</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-amber-400 rounded animate-pulse"></span> Inspecting</span>
        </div>
      </div>

      {/* Timeline Ruler */}
      <div className="relative h-7 border-b border-gray-700 select-none">
        {timeMarkers.map(t => (
          <div 
            key={t} 
            className="absolute top-0 text-[10px] text-gray-400 font-mono -translate-x-1/2 flex flex-col items-center"
            style={{ left: `${(t / maxTime) * 100}%` }}
          >
            <span className="h-2 w-px bg-gray-700 mb-0.5"></span>
            <span>{t}</span>
          </div>
        ))}
      </div>

      {/* Activity Bars */}
      <div className="space-y-2 py-1 max-h-72 overflow-y-auto pr-1">
        {activities.map((act) => {
          const isSelected = selectedIds.includes(act.id);
          const isRejected = rejectedIds.includes(act.id);
          const isCurrent = currentId === act.id;

          let barColor = 'bg-gray-800/80 border-gray-700 text-gray-300';
          let statusBadge = '';
          if (isSelected) {
            barColor = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-500/10 font-bold';
            statusBadge = '✓ Booked';
          } else if (isRejected) {
            barColor = 'bg-rose-500/20 border-rose-500/50 text-rose-400 opacity-60 line-through';
            statusBadge = '✗ Conflict';
          } else if (isCurrent) {
            barColor = 'bg-amber-500/30 border-amber-400 text-amber-200 animate-pulse ring-2 ring-amber-400/50 font-bold';
            statusBadge = '▶ Evaluating';
          }

          const leftPercent = (act.start / maxTime) * 100;
          const widthPercent = ((act.finish - act.start) / maxTime) * 100;

          return (
            <div key={act.id} className="relative h-10 flex items-center bg-gray-900/40 rounded-lg px-2 border border-gray-900 hover:border-gray-800 transition">
              <span className="w-14 text-xs font-mono text-gray-300 font-bold flex items-center gap-1">
                {act.id}
              </span>
              <div className="relative flex-1 h-full flex items-center">
                <div
                  className={`absolute h-7 rounded-md border flex items-center justify-between px-2.5 text-xs font-mono transition-all duration-300 ${barColor}`}
                  style={{
                    left: `${leftPercent}%`,
                    width: `${Math.max(widthPercent, 5)}%`
                  }}
                >
                  <span className="text-[10px]">{act.start}</span>
                  <span className="text-[10px] font-sans px-1 truncate">
                    {statusBadge || `${act.finish - act.start}h`}
                  </span>
                  <span className="text-[10px]">{act.finish}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};