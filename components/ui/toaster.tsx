"use client";

import { X } from "lucide-react";
import { useToast } from "./use-toast";
import { cn } from "@/lib/utils";

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "pointer-events-auto rounded-lg border px-4 py-3 shadow-lg flex items-start gap-3 animate-in slide-in-from-right",
            t.variant === "destructive"
              ? "bg-red-950 border-red-900 text-red-50"
              : "bg-zinc-900 border-zinc-800 text-zinc-50"
          )}
        >
          <div className="flex-1 min-w-0">
            {t.title && <p className="text-sm font-semibold">{t.title}</p>}
            {t.description && (
              <p className="text-xs text-zinc-400 mt-0.5">{t.description}</p>
            )}
            {t.action}
          </div>
          <button
            onClick={() => dismiss(t.id)}
            className="text-zinc-500 hover:text-zinc-100 flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
