import type { PredefinedSectionKey } from "@/types/biodata";

/** Identifies one field for preview click-to-edit */
export type PreviewFieldRef =
  | { kind: "predefined"; section: PredefinedSectionKey; fieldId: string }
  | { kind: "custom"; sectionId: string; fieldId: string };

export type SectionEditScope =
  | { kind: "predefined"; section: PredefinedSectionKey }
  | { kind: "custom"; sectionId: string };

export function sidebarFieldElementId(ref: PreviewFieldRef): string {
  return ref.kind === "predefined"
    ? `fld-predef-${ref.section}-${ref.fieldId}`
    : `fld-custom-${ref.sectionId}-${ref.fieldId}`;
}
