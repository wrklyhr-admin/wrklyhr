"use client";

import * as React from "react";

type ToastVariant = "default" | "destructive";

export type Toast = {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  action?: React.ReactNode;
};

type Listener = (toasts: Toast[]) => void;

let toasts: Toast[] = [];
const listeners: Listener[] = [];

function emit() {
  listeners.forEach((l) => l(toasts));
}

function addToast(t: Omit<Toast, "id">) {
  const id = Math.random().toString(36).slice(2);
  const toast: Toast = { id, variant: "default", ...t };
  toasts = [toast, ...toasts].slice(0, 5);
  emit();
  setTimeout(() => {
    toasts = toasts.filter((x) => x.id !== id);
    emit();
  }, 5000);
  return id;
}

function dismiss(id: string) {
  toasts = toasts.filter((x) => x.id !== id);
  emit();
}

export function toast(t: Omit<Toast, "id">) {
  return addToast(t);
}

export function useToast() {
  const [list, setList] = React.useState<Toast[]>(toasts);
  React.useEffect(() => {
    listeners.push(setList);
    return () => {
      const i = listeners.indexOf(setList);
      if (i >= 0) listeners.splice(i, 1);
    };
  }, []);
  return { toasts: list, toast, dismiss };
}
