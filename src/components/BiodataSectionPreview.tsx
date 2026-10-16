import type { BiodataField } from "@/types/biodata";
import type { CSSProperties } from "react";

import { usePreviewFieldActivate } from "@/context/PreviewEditDispatchContext";
import type { SectionEditScope } from "@/types/previewEdit";
import { sectionIsVisible, visibleFields } from "@/utils/fieldVisibility";

export interface BiodataSectionPreviewProps {
  title: string;
  fields: BiodataField[];
  /**
   * When preview edit mode is on (see App), rows become clickable to open the
   * quick-edit dialog. Omit for non-interactive export trees.
   */
  editScope?: SectionEditScope;
  /** Added to wrapper <section> */
  className?: string;
  /** Heading element class */
  headingClassName?: string;
  /** Row wrapper class */
  rowClassName?: string;
  /** Label cell class */
  labelClassName?: string;
  /** Value cell class */
  valueClassName?: string;
  /** Separator between label and value (default ": ") */
  separator?: string;
  separatorClassName?: string;
  headingStyle?: CSSProperties;
  /** Wrapper around rows (spacing between label rows) */
  fieldStackClassName?: string;
}

export function BiodataSectionPreview({
  title,
  fields,
  editScope,
  className = "",
  headingClassName = "",
  rowClassName = "",
  labelClassName = "",
  valueClassName = "",
  separator = ": ",
  separatorClassName = "",
  headingStyle,
  fieldStackClassName = "flex flex-col gap-0.5",
}: BiodataSectionPreviewProps) {
  const activatePreviewField = usePreviewFieldActivate();

  if (!sectionIsVisible(fields)) return null;

  const rows = visibleFields(fields);
  const clickable = Boolean(editScope && activatePreviewField);

  function activateField(fieldId: string) {
    if (!activatePreviewField || !editScope) return;
    activatePreviewField(
      editScope.kind === "predefined"
        ? { kind: "predefined", section: editScope.section, fieldId }
        : { kind: "custom", sectionId: editScope.sectionId, fieldId },
    );
  }

  return (
    <section className={className}>
      <h3 className={headingClassName} style={headingStyle}>
        {title}
      </h3>
      <div className={fieldStackClassName}>
        {rows.map((f) =>
          clickable ? (
            <button
              key={f.id}
              type="button"
              className={`${rowClassName} group m-0 w-full cursor-pointer appearance-none border-0 bg-transparent p-0 text-left font-inherit transition-colors hover:bg-black/[0.04] focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-sky-500`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                activateField(f.id);
              }}
              aria-label={`Edit field: ${f.label}`}
            >
              <span className={labelClassName}>{f.label}</span>
              <span className={`shrink-0 ${separatorClassName}`.trim()}>
                {separator}
              </span>
              <span className={`min-w-0 flex-1 ${valueClassName}`}>{f.value}</span>
            </button>
          ) : (
            <div key={f.id} className={rowClassName}>
              <span className={labelClassName}>{f.label}</span>
              <span className={`shrink-0 ${separatorClassName}`.trim()}>
                {separator}
              </span>
              <span className={`min-w-0 flex-1 ${valueClassName}`}>{f.value}</span>
            </div>
          ),
        )}
      </div>
    </section>
  );
}
