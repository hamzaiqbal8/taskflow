import type { Task } from "../lib/schema";
import { TaskItem } from "./task-item";

interface TaskListProps {
  tasks: Task[];
  today: string;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskList({ tasks, today, onToggle, onDelete }: TaskListProps) {
  return (
    <ul className="space-y-3">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          today={today}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}