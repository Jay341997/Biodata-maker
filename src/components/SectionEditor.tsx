import type { BiodataField, PredefinedSectionKey } from "@/types/biodata";
import { sidebarFieldElementId } from "@/types/previewEdit";

import { FieldEditor } from "./FieldEditor";

export interface SectionEditorProps {
  sectionKey: PredefinedSectionKey;
  title: string;
  fields: BiodataField[];
  onUpdateField: (
    section: PredefinedSectionKey,
    id: string,
    patch: Partial<BiodataField>,
  ) => void;
  onAddField: (section: PredefinedSectionKey) => void;
  onRemoveField: (section: PredefinedSectionKey, id: string) => void;
  /** Omit this predefined section from the biodata UI and PDF (data kept for restore). */
  onRemoveSection?: (section: PredefinedSectionKey) => void;
}

export function SectionEditor({
  sectionKey,
  title,
  fields,
  onUpdateField,
  onAddField,
  onRemoveField,
  onRemoveSection,
}: SectionEditorProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 shadow-sm">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold tracking-tight text-slate-800">
          {title}
        </h2>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onAddField(sectionKey)}
            className="rounded-lg bg-slate-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700"
          >
            Add Field
          </button>
          {onRemoveSection ? (
            <button
              type="button"
              onClick={() => onRemoveSection(sectionKey)}
              className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50"
            >
              Delete section
            </button>
          ) : null}
        </div>
      </header>
      <div className="flex flex-col gap-3">
        {fields.map((f) => (
          <FieldEditor
            key={f.id}
            field={f}
            fieldDomId={sidebarFieldElementId({
              kind: "predefined",
              section: sectionKey,
              fieldId: f.id,
            })}
            onChangeLabel={(label) =>
              onUpdateField(sectionKey, f.id, { label })
            }
            onChangeValue={(value) =>
              onUpdateField(sectionKey, f.id, { value })
            }
            onRemove={() => onRemoveField(sectionKey, f.id)}
          />
        ))}
      </div>
    </article>
  );
}
