import type {
  Biodata,
  BiodataField,
  BiodataSection,
  PredefinedSectionKey,
} from "@/types/biodata";

export function predefinedSectionIncluded(
  biodata: Biodata,
  key: PredefinedSectionKey,
): boolean {
  return !biodata.hiddenPredefinedSections?.includes(key);
}

export function predefinedSectionShowsInPreview(
  biodata: Biodata,
  key: PredefinedSectionKey,
): boolean {
  return (
    predefinedSectionIncluded(biodata, key) && sectionIsVisible(biodata[key])
  );
}

export function visibleFields(fields: BiodataField[]): BiodataField[] {
  return fields.filter((f) => f.value.trim() !== "");
}

export function sectionIsVisible(fields: BiodataField[]): boolean {
  return visibleFields(fields).length > 0;
}

export function customSectionIsVisible(section: BiodataSection): boolean {
  return sectionIsVisible(section.fields);
}
