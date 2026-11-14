"use client";

import { GiftsProvider } from "@/lib/repository/context";
import { ToastProvider } from "@/components/ui/Toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GiftsProvider>
      <ToastProvider>{children}</ToastProvider>
    </GiftsProvider>
  );
}
