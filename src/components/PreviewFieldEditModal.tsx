import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

import type { Biodata, PredefinedSectionKey } from "@/types/biodata";
import type { PreviewFieldRef } from "@/types/previewEdit";
import { sidebarFieldElementId } from "@/types/previewEdit";

export interface PreviewFieldEditModalProps {
  target: PreviewFieldRef | null;
  biodata: Biodata;
  onClose: () => void;
  /** Removes the row; custom sections keep the section shell (you can still add fields). */
  onDelete: (target: PreviewFieldRef) => void;
  onSavePredefined: (
    section: PredefinedSectionKey,
    fieldId: string,
    patch: { label: string; value: string },
  ) => void;
  onSaveCustom: (
    sectionId: string,
    fieldId: string,
    patch: { label: string; value: string },
  ) => void;
}

function findField(
  target: PreviewFieldRef,
  biodata: Biodata,
): { label: string; value: string } | undefined {
  if (target.kind === "predefined") {
    const f = biodata[target.section].find((x) => x.id === target.fieldId);
    return f ? { label: f.label, value: f.value } : undefined;
  }
  const s = biodata.customSections.find((x) => x.id === target.sectionId);
  const f = s?.fields.find((x) => x.id === target.fieldId);
  return f ? { label: f.label, value: f.value } : undefined;
}

export function PreviewFieldEditModal({
  target,
  biodata,
  onClose,
  onDelete,
  onSavePredefined,
  onSaveCustom,
}: PreviewFieldEditModalProps) {
  const dialogLabelId = useId();
  const firstInputRef = useRef<HTMLInputElement>(null);
  const [label, setLabel] = useState("");
  const [value, setValue] = useState("");

  useEffect(() => {
    if (!target) return;
    const f = findField(target, biodata);
    if (!f) {
      onClose();
      return;
    }
    setLabel(f.label);
    setValue(f.value);
    queueMicrotask(() => firstInputRef.current?.focus());
  }, [target, biodata, onClose]);

  useEffect(() => {
    if (!target) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [target, onClose]);

  if (!target || typeof document === "undefined") return null;

  const activeTarget = target;

  const title =
    activeTarget.kind === "predefined"
      ? "Edit field (preview)"
      : "Edit custom field (preview)";

  function scrollToSidebar() {
    const id = sidebarFieldElementId(activeTarget);
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }

  function apply() {
    if (activeTarget.kind === "predefined") {
      onSavePredefined(activeTarget.section, activeTarget.fieldId, {
        label,
        value,
      });
    } else {
      onSaveCustom(activeTarget.sectionId, activeTarget.fieldId, {
        label,
        value,
      });
    }
    onClose();
  }

  function confirmDelete() {
    if (
      !window.confirm(
        "Delete this field? You can add a new one from the sidebar if needed.",
      )
    ) {
      return;
    }
    onDelete(activeTarget);
    onClose();
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-[1px]"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={dialogLabelId}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-slate-200 bg-white p-6 shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h2
          id={dialogLabelId}
          className="text-lg font-semibold text-slate-900"
        >
          {title}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Changes apply to your biodata and show in the PDF.
        </p>

        <div className="mt-5 flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-slate-600">Label</span>
            <input
              ref={firstInputRef}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-400 focus:ring-2"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-slate-600">Value</span>
            <textarea
              rows={4}
              className="resize-y rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-400 focus:ring-2"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </label>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
            onClick={apply}
          >
            Save
          </button>
          <button
            type="button"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-800 hover:bg-red-100"
            onClick={confirmDelete}
          >
            Delete field
          </button>
          <button
            type="button"
            className="ml-auto rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            onClick={scrollToSidebar}
          >
            Show in sidebar
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
