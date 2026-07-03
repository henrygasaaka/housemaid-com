"use client";

import { useEffect } from "react";

type BottomSheetProps = {
  open: boolean;
  onDismiss: () => void;
  children: React.ReactNode;
};

export function BottomSheet({ open, onDismiss, children }: BottomSheetProps) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center">
      <button
        type="button"
        className="absolute inset-0 cursor-default border-none bg-black/40"
        onClick={onDismiss}
        aria-label="Close"
      />
      <div className="relative mt-auto w-full max-w-[390px] max-h-[70vh] overflow-hidden rounded-t-[20px] bg-white px-[18px] pb-6 pt-4 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border" />
        {children}
      </div>
    </div>
  );
}
