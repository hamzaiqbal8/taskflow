import { CheckCheck } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export function Header() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="inline-flex size-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <CheckCheck className="size-4" />
          </span>
          TaskFlow
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}