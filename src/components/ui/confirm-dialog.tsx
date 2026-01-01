"use client";

import type { ReactNode } from "react";

import { SpotlightModal } from "@/components/ui/spotlight-modal";

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  description?: string | ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "default" | "danger";
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title = "Are you sure?",
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "default",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <SpotlightModal open={open} onClose={onCancel} title={title}>
      <div className="space-y-3 p-4 text-slate-900 sm:p-5">
        <div className="space-y-1">
          <p className="text-sm font-semibold">{title}</p>
          {description && (
            <p className="text-[11px] text-slate-500 sm:text-xs">{description}</p>
          )}
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-full border border-slate-300 px-3 py-1.5 text-[11px] font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => {
              if (!loading) onConfirm();
            }}
            disabled={loading}
            className={`rounded-full px-3 py-1.5 text-[11px] font-semibold shadow-sm disabled:cursor-not-allowed disabled:opacity-60 ${
              tone === "danger"
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-slate-900 text-slate-50 hover:bg-slate-800"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </SpotlightModal>
  );
}

