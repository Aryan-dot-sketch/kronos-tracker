import React from 'react';
import { Task } from '@/types';
import { useKronos } from '@/context/KronosContext';
import { TZ, formatMinutes, titleCase } from '@/lib/time/ist';
import { Button } from '../ui/Button';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { fireConfetti } from '@/lib/utils/confetti';
import { Edit3, Clock, Trash2 } from 'lucide-react';

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
      fireConfetti('mild');
    }
  };

  const priorityColor = {
    critical: 'red',
    high: 'gold',
    medium: 'blue',
    low: 'default',
  }[task.priority] || 'default';

  return (
    <motion.div
      className={clsx('task-row premium-task', isDone && 'completed', isMissed && 'missed')}
      whileHover={{ 
        scale: 1.006, 
        boxShadow: 'var(--shadow-md)' 
      }}
      whileTap={{ scale: 0.992 }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
    >
      {/* Premium Check Button */}
      <motion.button
        className="check-button premium-check"
        onClick={handleToggle}
        aria-label="Toggle task completion"
        whileTap={{ scale: 0.75 }}
        animate={isDone ? { scale: [1, 1.25, 1] } : {}}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        {isDone ? '✓' : ''}
      </motion.button>

      <div className="task-content">
        <div className="task-title">{task.title}</div>
        <div className="task-meta">
          <span className={clsx('priority-pill', `priority-${task.priority}`, `pill-${priorityColor}`)}>
            {task.priority}
          </span>
          <span className="task-subject">{task.subject}</span>
          <span className="task-estimate">{formatMinutes(task.estimate)}</span>
          <span className="task-difficulty">{task.difficulty}</span>
          {!compact && <span className="task-status">{completionText}</span>}
        </div>
      </div>

      {/* Premium Action Buttons */}
      <div className="task-actions premium-actions">
        <Button 
          variant="icon" 
          size="sm" 
          onClick={() => openModal('task', task.id)}
          title="Edit task"
        >
          <Edit3 size={15} />
        </Button>
        <Button 
          variant="icon" 
          size="sm" 
          onClick={() => logTaskTime(task.id)}
          title="Log time"
        >
          <Clock size={15} />
        </Button>
        <Button 
          variant="icon" 
          size="sm" 
          onClick={() => deleteTask(task.id)}
          title="Delete task"
        >
          <Trash2 size={15} />
        </Button>
      </div>
    </motion.div>
  );
};
