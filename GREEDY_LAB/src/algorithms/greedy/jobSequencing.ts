import { JobItem, AlgorithmStep } from '../../types/algorithms';

export type JobStrategy = 'max_profit' | 'earliest_deadline' | 'shortest_deadline';

export const runJobSequencing = (
  jobs: JobItem[],
  strategy: JobStrategy = 'max_profit'
) => {
  if (jobs.length === 0) {
    return { scheduled: [], totalProfit: 0, slots: [], steps: [], sorted: [] };
  }

  const sorted = [...jobs];
  if (strategy === 'max_profit') {
    sorted.sort((a, b) => b.profit - a.profit || a.deadline - b.deadline);
  } else if (strategy === 'earliest_deadline') {
    sorted.sort((a, b) => a.deadline - b.deadline || b.profit - a.profit);
  } else if (strategy === 'shortest_deadline') {
    sorted.sort((a, b) => a.deadline - b.deadline || a.profit - b.profit);
  }

  const maxDeadline = Math.max(...jobs.map(j => j.deadline), 1);
  const slots: (JobItem | null)[] = Array(maxDeadline + 1).fill(null); // 1-indexed slots (1 to maxDeadline)
  const scheduled: JobItem[] = [];
  const steps: AlgorithmStep[] = [];
  let totalProfit = 0;

  const strategyDescriptions: Record<JobStrategy, string> = {
    max_profit: 'Highest Profit First (Optimal Greedy with Backward Slot Allocation)',
    earliest_deadline: 'Earliest Deadline First (Heuristic — Can Fail on High Profit)',
    shortest_deadline: 'Shortest Deadline & Low Profit First (Heuristic)',
  };

  steps.push({
    stepNumber: 0,
    action: 'Initialize Time Slots',
    explanation: `Sorted ${jobs.length} jobs by ${strategyDescriptions[strategy]}. Available time slots: 1 to ${maxDeadline}.`,
    scheduleSlots: [...slots],
    currentProfit: 0
  });

  sorted.forEach((job, idx) => {
    // Find the latest available free slot <= job.deadline
    let assignedSlot = -1;
    for (let s = Math.min(job.deadline, maxDeadline); s >= 1; s--) {
      if (slots[s] === null) {
        assignedSlot = s;
        break;
      }
    }

    if (assignedSlot !== -1) {
      const scheduledJob = { ...job, slotAssigned: assignedSlot };
      slots[assignedSlot] = scheduledJob;
      scheduled.push(scheduledJob);
      totalProfit += job.profit;

      steps.push({
        stepNumber: idx + 1,
        action: `Assign Job ${job.id} to Slot ${assignedSlot}`,
        explanation: `Scheduled Job ${job.id} (Profit: $${job.profit}, Deadline: ${job.deadline}) into latest free Slot ${assignedSlot}. Total Profit: $${totalProfit}.`,
        currentJob: scheduledJob,
        scheduleSlots: [...slots],
        currentProfit: totalProfit
      });
    } else {
      steps.push({
        stepNumber: idx + 1,
        action: `Reject Job ${job.id} (No Slot)`,
        explanation: `All slots $\\le$ deadline ${job.deadline} are occupied. Job ${job.id} ($${job.profit}) could not be scheduled.`,
        currentJob: job,
        scheduleSlots: [...slots],
        currentProfit: totalProfit
      });
    }
  });

  return {
    scheduled,
    totalProfit,
    slots,
    maxDeadline,
    steps,
    sorted
  };
};
