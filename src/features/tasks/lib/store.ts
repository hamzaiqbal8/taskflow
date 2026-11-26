import { tasksReducer, type TaskAction } from "./reducer";
import { tasksSchema, type Task } from "./schema";

const STORAGE_KEY = "taskflow:tasks:v1";
const EMPTY: Task[] = []; // server par hamesha yahi (ek hi reference, taake React bar bar re-render na kare)

let tasks: Task[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function readFromStorage(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    // JSON.parse ka result ko kabhi seedha mat maano: zod se check karo (data kharab bhi ho sakta hai)
    const result = tasksSchema.safeParse(JSON.parse(raw));
    return result.success ? result.data : EMPTY;
  } catch {
    return EMPTY; // storage band (private mode) ya JSON kharab
  }
}

function persist(next: Task[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // storage full/blocked: app chalti rahe gi, bas refresh par data nahi bachega
  }
}

function emit() {
  listeners.forEach((listener) => listener());
}

function ensureLoaded() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  tasks = readFromStorage();
}

// --- React ke useSyncExternalStore ke liye 3 functions ---

export function subscribe(listener: () => void) {
  listeners.add(listener);

  // Doosre browser tab mein badlav ho to yahan bhi nazar aaye
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    tasks = readFromStorage();
    emit();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function getSnapshot(): Task[] {
  ensureLoaded();
  return tasks;
}

export function getServerSnapshot(): Task[] {
  return EMPTY;
}

export function dispatch(action: TaskAction) {
  ensureLoaded();
  tasks = tasksReducer(tasks, action);
  persist(tasks);
  emit();
}