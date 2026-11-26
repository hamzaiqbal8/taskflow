import type { Task } from "./schema";

export type TaskChanges = Partial<Omit<Task, "id" | "createdAt">>;

export type TaskAction =
  | { type: "add"; task: Task }
  | { type: "update"; id: string; changes: TaskChanges }
  | { type: "toggle"; id: string }
  | { type: "delete"; id: string }
  /** Delete ko undo karna: task ko uski purani jagah (index) par wapas rakho */
  | { type: "restore"; task: Task; index: number }
  | { type: "clearCompleted" }
  | { type: "replaceAll"; tasks: Task[] };

/**
 * Pure function: purani list + action -> nayi list.
 * State ko kabhi badalta nahi (mutate nahi), hamesha nayi array return karta hai.
 */
export function tasksReducer(state: Task[], action: TaskAction): Task[] {
  switch (action.type) {
    case "add":
      return [action.task, ...state];

    case "update":
      return state.map((t) => (t.id === action.id ? { ...t, ...action.changes } : t));

    case "toggle":
      return state.map((t) => (t.id === action.id ? { ...t, completed: !t.completed } : t));

    case "delete":
      return state.filter((t) => t.id !== action.id);

    case "restore": {
      if (state.some((t) => t.id === action.task.id)) return state;
      const index = Math.min(Math.max(action.index, 0), state.length);
      return [...state.slice(0, index), action.task, ...state.slice(index)];
    }

    case "clearCompleted":
      return state.filter((t) => !t.completed);

    case "replaceAll":
      return action.tasks;
  }
}