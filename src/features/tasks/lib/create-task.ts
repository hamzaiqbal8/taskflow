import type { Task, TaskFormValues } from "./schema";

/** Form ki values se poora Task banata hai (id, completed, createdAt hum khud lagate hain). */
export function createTask(values: TaskFormValues): Task {
  return {
    ...values,
    id: crypto.randomUUID(),
    completed: false,
    createdAt: new Date().toISOString(),
  };
}