"use client";

import { ClipboardList, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { todayISO } from "@/lib/date";
import { useTasks } from "../hooks/use-tasks";
import { createTask } from "../lib/create-task";
import type { TaskFormValues } from "../lib/schema";
import { TaskForm } from "./task-form";
import { TaskList } from "./task-list";

export function TaskApp() {
  const { tasks, isHydrated, dispatch } = useTasks();
  const [dialogOpen, setDialogOpen] = useState(false);

  // Aaj ki tareekh sirf browser mein pooch'te hain (server par "" rehta hai)
  const today = isHydrated ? todayISO() : "";

  function handleAdd(values: TaskFormValues) {
    dispatch({ type: "add", task: createTask(values) });
    setDialogOpen(false);
  }

  const activeCount = tasks.filter((t) => !t.completed).length;

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Your tasks</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isHydrated ? `${activeCount} active · ${tasks.length - activeCount} done` : "Loading…"}
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="size-4" /> New task
        </Button>
      </div>

      <div className="mt-8">
        {!isHydrated ? (
          <div className="space-y-3" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center rounded-xl border border-dashed border-border px-6 py-16 text-center">
            <ClipboardList className="size-10 text-muted-foreground" />
            <h2 className="mt-4 font-medium">No tasks yet</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Add your first task to get started.
            </p>
            <Button className="mt-6" onClick={() => setDialogOpen(true)}>
              <Plus className="size-4" /> New task
            </Button>
          </div>
        ) : (
          <TaskList
            tasks={tasks}
            today={today}
            onToggle={(id) => dispatch({ type: "toggle", id })}
            onDelete={(id) => dispatch({ type: "delete", id })}
          />
        )}
      </div>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} title="New task">
        {/* Dialog band hone par form hat jata hai, is liye har baar khali form milta hai */}
        {dialogOpen && <TaskForm onSubmit={handleAdd} onCancel={() => setDialogOpen(false)} />}
      </Dialog>
    </div>
  );
}