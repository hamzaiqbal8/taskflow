import { CalendarDays, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDue } from "@/lib/date";
import { cn } from "@/lib/utils";
import { CATEGORY_LABELS, PRIORITY_LABELS, PRIORITY_STYLES } from "../constants";
import type { Task } from "../lib/schema";

interface TaskItemProps {
  task: Task;
  /** "YYYY-MM-DD", ya "" agar abhi pata nahi (hydrate hone se pehle) */
  today: string;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ task, today, onToggle, onDelete }: TaskItemProps) {
  const isOverdue =
    today !== "" && !task.completed && task.dueDate !== null && task.dueDate < today;

  return (
    <li className="flex items-start gap-3 rounded-xl border border-border p-4 transition-colors hover:bg-muted/50">
      <input
        id={`task-${task.id}`}
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        className="mt-1 size-4 shrink-0 cursor-pointer accent-accent"
      />

      <div className="min-w-0 flex-1">
        <label
          htmlFor={`task-${task.id}`}
          className={cn(
            "block cursor-pointer break-words font-medium",
            task.completed && "text-muted-foreground line-through",
          )}
        >
          {task.title}
        </label>

        {task.description && (
          <p className="mt-1 break-words text-sm text-muted-foreground">{task.description}</p>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
          <span className={cn("rounded-md px-2 py-0.5 font-medium", PRIORITY_STYLES[task.priority])}>
            {PRIORITY_LABELS[task.priority]}
          </span>
          <span className="rounded-md bg-muted px-2 py-0.5 text-muted-foreground">
            {CATEGORY_LABELS[task.category]}
          </span>
          {task.dueDate && (
            <span
              className={cn(
                "inline-flex items-center gap-1",
                isOverdue ? "font-medium text-red-600 dark:text-red-400" : "text-muted-foreground",
              )}
            >
              <CalendarDays className="size-3.5" />
              {formatDue(task.dueDate)}
              {isOverdue && " · Overdue"}
            </span>
          )}
        </div>
      </div>

      <Button
        variant="danger"
        size="icon"
        aria-label={`Delete task: ${task.title}`}
        onClick={() => onDelete(task.id)}
      >
        <Trash2 className="size-4" />
      </Button>
    </li>
  );
}