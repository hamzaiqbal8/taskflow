import type { Category, Priority, Task } from "./schema";

export type StatusFilter = "all" | "active" | "completed";
export type SortKey = "created" | "due" | "priority" | "title";

export interface TaskFilters {
  query: string;
  category: Category | "all";
  priority: Priority | "all";
  status: StatusFilter;
}

export const DEFAULT_FILTERS: TaskFilters = {
  query: "",
  category: "all",
  priority: "all",
  status: "all",
};

const PRIORITY_RANK: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

export function filterTasks(tasks: Task[], filters: TaskFilters): Task[] {
  const query = filters.query.trim().toLowerCase();

  return tasks.filter((task) => {
    if (filters.category !== "all" && task.category !== filters.category) return false;
    if (filters.priority !== "all" && task.priority !== filters.priority) return false;
    if (filters.status === "active" && task.completed) return false;
    if (filters.status === "completed" && !task.completed) return false;
    if (query) {
      const haystack = `${task.title} ${task.description}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });
}

export function sortTasks(tasks: Task[], sort: SortKey): Task[] {
  // [...tasks]: original array ko mat chhedo, copy ko sort karo
  const copy = [...tasks];

  switch (sort) {
    case "created":
      return copy.sort((a, b) => b.createdAt.localeCompare(a.createdAt)); // naya pehle
    case "due":
      // "YYYY-MM-DD" text ki tarah bhi sahi order mein sort hota hai; deadline-less aakhir mein
      return copy.sort((a, b) => {
        if (a.dueDate === b.dueDate) return 0;
        if (a.dueDate === null) return 1;
        if (b.dueDate === null) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      });
    case "priority":
      return copy.sort((a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]);
    case "title":
      return copy.sort((a, b) => a.title.localeCompare(b.title));
  }
}

export interface TaskStats {
  total: number;
  completed: number;
  active: number;
  overdue: number;
  percent: number;
}

/** `today` bahar se aata hai ("YYYY-MM-DD") taake function pure rahe aur test ho sake. */
export function getStats(tasks: Task[], today: string): TaskStats {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const overdue = tasks.filter((t) => !t.completed && t.dueDate !== null && t.dueDate < today).length;

  return {
    total,
    completed,
    active: total - completed,
    overdue,
    percent: total === 0 ? 0 : Math.round((completed / total) * 100),
  };
}