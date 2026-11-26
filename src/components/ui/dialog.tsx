"use client";

import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

/**
 * Browser ka apna <dialog> element use karta hai.
 * Faida: Esc se band hota hai, focus andar hi rehta hai, peeche ka page click nahi hota. Sab free.
 */
export function Dialog({ open, onClose, title, children }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  // React ka "open" state -> browser ke dialog ke commands (showModal / close)
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby="dialog-title"
      onClose={onClose} // Esc dabane par bhi ye chalta hai
      onClick={(e) => {
        // Sirf dhundhle peeche (backdrop) par click ho to band karo, andar ke click par nahi
        if (e.target === e.currentTarget) onClose();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-2xl border border-border bg-background p-0 text-foreground shadow-xl backdrop:bg-black/50 backdrop:backdrop-blur-sm"
    >
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h2 id="dialog-title" className="text-base font-semibold">
          {title}
        </h2>
        <Button variant="ghost" size="icon" aria-label="Close" onClick={onClose}>
          <X className="size-4" />
        </Button>
      </div>
      <div className="px-5 py-5">{children}</div>
    </dialog>
  );
}