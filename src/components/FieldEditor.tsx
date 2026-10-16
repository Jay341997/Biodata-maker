import type { BiodataField } from "@/types/biodata";

export interface FieldEditorProps {
  field: BiodataField;
  /** Anchor for scroll-into-view from preview “Show in sidebar”. */
  fieldDomId?: string;
  onChangeLabel: (label: string) => void;
  onChangeValue: (value: string) => void;
  onRemove?: () => void;
}

export function FieldEditor({
  field,
  fieldDomId,
  onChangeLabel,
  onChangeValue,
  onRemove,
}: FieldEditorProps) {
  return (
    <div
      id={fieldDomId}
      className="flex scroll-mt-[7.5rem] flex-wrap items-start gap-2 rounded-lg border border-slate-200 bg-white p-3 shadow-sm"
    >
      <div className="grid flex-1 min-w-[200px] gap-2 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-slate-600">Label</span>
          <input
            className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-400 focus:ring-2"
            value={field.label}
            onChange={(e) => onChangeLabel(e.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm sm:col-span-1">
          <span className="font-medium text-slate-600">Value</span>
          <textarea
            rows={field.label.toLowerCase().includes("address") ? 3 : 2}
            className="resize-y rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-400 focus:ring-2"
            value={field.value}
            onChange={(e) => onChangeValue(e.target.value)}
          />
        </label>
      </div>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-100"
          title="Delete this field"
          aria-label="Delete field"
        >
          Delete field
        </button>
      )}
    </div>
  );
}
