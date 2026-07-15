import React from 'react';
import { Task } from '@/types';
import { useKronos } from '@/context/KronosContext';
import { TZ, formatMinutes, titleCase } from '@/lib/time/ist';
import { Button } from '../ui/Button';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { fireConfetti } from '@/lib/utils/confetti';

interface TaskCardProps {
  task: Task;
  compact?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, compact = false }) => {
  const { toggleTask, deleteTask, logTaskTime, openModal } = useKronos();

  const isDone = task.status === 'completed';
  const isMissed = task.status === 'missed';

  const completionText = task.completedAt
    ? `${new Intl.DateTimeFormat('en-IN', { timeZone: TZ, hour: '2-digit', minute: '2-digit' }).format(new Date(task.completedAt))} IST`
    : titleCase(task.status || 'pending');

  const handleToggle = () => {
    const wasCompleted = isDone;
    toggleTask(task.id);

    if (!wasCompleted) {
      // Premium completion delight
      fireConfetti('mild');
    }
  };

  return (
    <motion.div 
      className={clsx('task-row', isDone && 'completed', isMissed && 'missed')}
      whileHover={{ scale: 1.005 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <motion.button
        className="check-button"
        onClick={handleToggle}
        aria-label="Toggle task completion"
        whileTap={{ scale: 0.8 }}
        animate={isDone ? { scale: [1, 1.3, 1] } : {}}
        transition={{ duration: 0.4 }}
      >
        ✓
      </motion.button>

      <div>
        <div className="task-title">{task.title}</div>
        <div className="task-meta">
          <span className={clsx('priority-pill', `priority-${task.priority}`)}>
            {task.priority}
          </span>
          <span>{task.subject}</span>
          <span>{formatMinutes(task.estimate)}</span>
          <span>{task.difficulty}</span>
          {!compact && <span>{completionText}</span>}
        </div>
      </div>

      <div className="task-actions">
        <Button variant="tiny" onClick={() => openModal('task', task.id)}>Edit</Button>
        <Button variant="tiny" onClick={() => logTaskTime(task.id)}>Log Time</Button>
        <Button variant="tiny" onClick={() => deleteTask(task.id)}>Delete</Button>
      </div>
    </div>
  );
};
