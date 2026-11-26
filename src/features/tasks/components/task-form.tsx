"use client";

import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { CATEGORY_LABELS, PRIORITY_LABELS } from "../constants";
import {
  CATEGORIES,
  PRIORITIES,
  taskFormSchema,
  type Category,
  type Priority,
  type TaskFormValues,
} from "../lib/schema";

interface TaskFormProps {
  onSubmit: (values: TaskFormValues) => void;
  onCancel: () => void;
}

interface FormState {
  title: string;
  description: string;
  category: Category;
  priority: Priority;
  dueDate: string; // input se hamesha text aata hai; khali ho to "" 
}

type FieldErrors = Partial<Record<keyof FormState, string[]>>;

const INITIAL: FormState = {
  title: "",
  description: "",
  category: "work",
  priority: "medium",
  dueDate: "",
};

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/30 aria-[invalid=true]:border-red-500";

export function TaskForm({ onSubmit, onCancel }: TaskFormProps) {
  const [values, setValues] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<FieldErrors>({});

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); // page reload mat karo

    const result = taskFormSchema.safeParse({
      ...values,
      dueDate: values.dueDate || null, // "" ko null banao
    });

    if (!result.success) {
      setErrors(z.flattenError(result.error).fieldErrors);
      return;
    }
    onSubmit(result.data);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Title */}
      <div className="space-y-1.5">
        <label htmlFor="title" className="text-sm font-medium">
          Title
        </label>
        <input
          id="title"
          value={values.title}
          onChange={(e) => update("title", e.target.value)}
          placeholder="e.g. Finish landing page"
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? "title-error" : undefined}
          className={inputClass}
        />
        {errors.title && (
          <p id="title-error" className="text-xs text-red-600 dark:text-red-400">
            {errors.title[0]}
          </p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <label htmlFor="description" className="text-sm font-medium">
          Description <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <textarea
          id="description"
          rows={3}
          value={values.description}
          onChange={(e) => update("description", e.target.value)}
          aria-invalid={!!errors.description}
          className={inputClass}
        />
        {errors.description && (
          <p className="text-xs text-red-600 dark:text-red-400">{errors.description[0]}</p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {/* Category */}
        <div className="space-y-1.5">
          <label htmlFor="category" className="text-sm font-medium">
            Category
          </label>
          <select
            id="category"
            value={values.category}
            onChange={(e) => update("category", e.target.value as Category)}
            className={inputClass}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABELS[c]}
              </option>
            ))}
          </select>
        </div>

        {/* Due date */}
        <div className="space-y-1.5">
          <label htmlFor="dueDate" className="text-sm font-medium">
            Due date <span className="font-normal text-muted-foreground">(optional)</span>
          </label>
          <input
            id="dueDate"
            type="date"
            value={values.dueDate}
            onChange={(e) => update("dueDate", e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {/* Priority */}
      <fieldset className="space-y-1.5">
        <legend className="text-sm font-medium">Priority</legend>
        <div className="grid grid-cols-3 gap-2">
          {PRIORITIES.map((p) => (
            <label
              key={p}
              className="cursor-pointer rounded-lg border border-border px-3 py-2 text-center text-sm transition-colors hover:bg-muted has-[:checked]:border-accent has-[:checked]:bg-accent/10 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent"
            >
              <input
                type="radio"
                name="priority"
                value={p}
                checked={values.priority === p}
                onChange={() => update("priority", p)}
                className="sr-only"
              />
              {PRIORITY_LABELS[p]}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Add task</Button>
      </div>
    </form>
  );
}