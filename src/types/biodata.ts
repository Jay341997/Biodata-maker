export interface BiodataField {
  id: string;
  label: string;
  value: string;
  /** When true (e.g. “Add Field”), row was added in the UI; legacy JSON may still tag rows. Any field row can be deleted. */
  isCustom?: boolean;
}

export interface BiodataSection {
  id: string;
  title: string;
  fields: BiodataField[];
}

export const PREDEFINED_SECTION_KEYS = [
  "personalDetails",
  "overview",
  "property",
  "familyDetails",
  "education",
  "maternalDetails",
] as const;

export type PredefinedSectionKey = (typeof PREDEFINED_SECTION_KEYS)[number];

export interface Biodata {
  /** Large serif header on banner-style layouts (e.g. Heritage Tan). */
  headerDisplayName?: string;
  profilePhoto?: string;
  /** Extra images (typically data URLs) printed on an appendix sheet after the main template (new PDF page). */
  additionalPhotos?: string[];
  /**
   * Predefined sections hidden from the editor, preview, and PDF.
   * Field data is kept so “Restore” can bring the section back.
   */
  hiddenPredefinedSections?: PredefinedSectionKey[];
  personalDetails: BiodataField[];
  overview: BiodataField[];
  property: BiodataField[];
  familyDetails: BiodataField[];
  education: BiodataField[];
  maternalDetails: BiodataField[];
  customSections: BiodataSection[];
}
