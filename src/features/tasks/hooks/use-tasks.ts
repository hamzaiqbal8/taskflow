"use client";

import { useSyncExternalStore } from "react";
import { dispatch, getServerSnapshot, getSnapshot, subscribe } from "../lib/store";

const subscribeNoop = () => () => {};

export function useTasks() {
  const tasks = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Server par false, browser mein hydrate hone ke baad true.
  // Isse "No tasks yet" ka empty-state data aane se pehle ek second ke liye flash nahi hota.
  const isHydrated = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );

  return { tasks, isHydrated, dispatch };
}