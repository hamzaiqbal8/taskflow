import { z } from "zod";

export const CATEGORIES = ["work", "personal", "study", "health", "other"] as const;
export const PRIORITIES = ["low", "medium", "high"] as const;

export const taskSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1, "Title is required").max(120, "Max 120 characters"),
  description: z.string().max(500, "Max 500 characters"),
  category: z.enum(CATEGORIES),
  priority: z.enum(PRIORITIES),
  completed: z.boolean(),
  /** "YYYY-MM-DD" ya null (koi deadline nahi) */
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(),
  /** ISO timestamp */
  createdAt: z.string(),
});

export const tasksSchema = z.array(taskSchema);

/** Form mein user sirf ye fields bharta hai; baaki (id, completed...) hum khud banate hain. */
export const taskFormSchema = taskSchema.pick({
  title: true,
  description: true,
  category: true,
  priority: true,
  dueDate: true,
});

export type Task = z.infer<typeof taskSchema>;
export type TaskFormValues = z.infer<typeof taskFormSchema>;
export type Category = (typeof CATEGORIES)[number];
export type Priority = (typeof PRIORITIES)[number]; 