import type { BiodataSection } from "@/types/biodata";
import { sidebarFieldElementId } from "@/types/previewEdit";

import { FieldEditor } from "./FieldEditor";

export interface CustomSectionEditorProps {
  section: BiodataSection;
  onChangeTitle: (sectionId: string, title: string) => void;
  onUpdateField: (
    sectionId: string,
    fieldId: string,
    patch: Partial<{ label: string; value: string }>,
  ) => void;
  onAddField: (sectionId: string) => void;
  onRemoveField: (sectionId: string, fieldId: string) => void;
  onRemoveSection: (sectionId: string) => void;
}

export function CustomSectionEditor({
  section,
  onChangeTitle,
  onUpdateField,
  onAddField,
  onRemoveField,
  onRemoveSection,
}: CustomSectionEditorProps) {
  return (
    <article className="rounded-xl border border-indigo-200 bg-indigo-50/60 p-4 shadow-sm ring-1 ring-indigo-100">
      <header className="mb-4 flex flex-wrap items-end gap-3">
        <label className="flex min-w-[200px] flex-1 flex-col gap-1 text-sm">
          <span className="font-medium text-indigo-900">Section title</span>
          <input
            className="rounded-md border border-indigo-200 bg-white px-3 py-2 text-base font-semibold text-slate-900 outline-none ring-indigo-300 focus:ring-2"
            value={section.title}
            onChange={(e) => onChangeTitle(section.id, e.target.value)}
          />
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onAddField(section.id)}
            className="rounded-lg bg-indigo-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-600"
          >
            Add Field
          </button>
          <button
            type="button"
            onClick={() => onRemoveSection(section.id)}
            className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50"
          >
            Delete section
          </button>
        </div>
      </header>
      <div className="flex flex-col gap-3">
        {section.fields.map((f) => (
          <FieldEditor
            key={f.id}
            field={f}
            fieldDomId={sidebarFieldElementId({
              kind: "custom",
              sectionId: section.id,
              fieldId: f.id,
            })}
            onChangeLabel={(label) =>
              onUpdateField(section.id, f.id, { label })
            }
            onChangeValue={(value) =>
              onUpdateField(section.id, f.id, { value })
            }
            onRemove={() => onRemoveField(section.id, f.id)}
          />
        ))}
      </div>
    </article>
  );
}
