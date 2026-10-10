import { Activity, AlgorithmStep } from '../../types/algorithms';

export type ActivityStrategy = 'earliest_finish' | 'earliest_start' | 'shortest_duration' | 'fewest_conflicts';

export const runActivitySelection = (
  activities: Activity[],
  strategy: ActivityStrategy = 'earliest_finish'
) => {
  if (activities.length === 0) {
    return { selected: [], totalSelected: 0, steps: [], sorted: [] };
  }

  const sorted = [...activities];

  if (strategy === 'earliest_finish') {
    sorted.sort((a, b) => a.finish - b.finish || a.start - b.start);
  } else if (strategy === 'earliest_start') {
    sorted.sort((a, b) => a.start - b.start || a.finish - b.finish);
  } else if (strategy === 'shortest_duration') {
    sorted.sort((a, b) => (a.finish - a.start) - (b.finish - b.start) || a.start - b.start);
  } else if (strategy === 'fewest_conflicts') {
    // Count conflicts for each activity
    const conflictCount = new Map<string, number>();
    activities.forEach(a => {
      let count = 0;
      activities.forEach(b => {
        if (a.id !== b.id && Math.max(a.start, b.start) < Math.min(a.finish, b.finish)) {
          count++;
        }
      });
      conflictCount.set(a.id, count);
    });
    sorted.sort((a, b) => (conflictCount.get(a.id) || 0) - (conflictCount.get(b.id) || 0) || a.finish - b.finish);
  }

  const steps: AlgorithmStep[] = [];
  const selected: Activity[] = [];
  const rejected: string[] = [];

  const strategyDescriptions: Record<ActivityStrategy, string> = {
    earliest_finish: 'Earliest Finish Time First (Provably Optimal Greedy)',
    earliest_start: 'Earliest Start Time First (Heuristic — Can Fail)',
    shortest_duration: 'Shortest Duration First (Heuristic — Can Fail)',
    fewest_conflicts: 'Fewest Initial Conflicts First (Heuristic — Can Fail)',
  };

  steps.push({
    stepNumber: 0,
    action: 'Sort Activities',
    explanation: `Sorted ${activities.length} activities by strategy: ${strategyDescriptions[strategy]}. Initial state: no activities scheduled.`,
    currentId: null,
    selectedIds: [],
    rejectedIds: [],
    lastFinish: -1
  });

  sorted.forEach((act, idx) => {
    // An activity is compatible if it does not overlap with ANY already selected activity
    const overlaps = selected.some(sel => Math.max(act.start, sel.start) < Math.min(act.finish, sel.finish));
    const isCompatible = !overlaps;

    if (isCompatible) {
      selected.push(act);
      steps.push({
        stepNumber: idx + 1,
        action: 'Accept Activity',
        explanation: `Selected ${act.id} [${act.start} → ${act.finish}]. Compatible with all ${selected.length - 1} previously selected activities.`,
        currentId: act.id,
        selectedIds: selected.map(a => a.id),
        rejectedIds: [...rejected],
        lastFinish: act.finish
      });
    } else {
      rejected.push(act.id);
      const conflicting = selected.filter(sel => Math.max(act.start, sel.start) < Math.min(act.finish, sel.finish));
      const conflictNames = conflicting.map(c => `${c.id} [${c.start}→${c.finish}]`).join(', ');
      steps.push({
        stepNumber: idx + 1,
        action: 'Reject (Conflict)',
        explanation: `Rejected ${act.id} [${act.start} → ${act.finish}] due to time overlap with ${conflictNames}.`,
        currentId: act.id,
        selectedIds: selected.map(a => a.id),
        rejectedIds: [...rejected],
        lastFinish: selected.length > 0 ? selected[selected.length - 1].finish : -1
      });
    }
  });

  return { selected, totalSelected: selected.length, steps, sorted };
};