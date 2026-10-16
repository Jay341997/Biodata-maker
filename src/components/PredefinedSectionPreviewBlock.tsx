import type { BiodataSectionPreviewProps } from "@/components/BiodataSectionPreview";
import { BiodataSectionPreview } from "@/components/BiodataSectionPreview";
import { PropertyListPreview } from "@/components/PropertyListPreview";
import { PREDEFINED_SECTION_TITLES } from "@/constants/sections";
import type { BiodataField, PredefinedSectionKey } from "@/types/biodata";
import { sectionIsVisible } from "@/utils/fieldVisibility";

type PreviewProps = Omit<BiodataSectionPreviewProps, "title" | "fields">;

/** Renders predefined sections; property uses a titled block with value-only bullet lines. */
export function PredefinedSectionPreviewBlock({
  sectionKey,
  fields,
  sectionPreviewProps,
  propertyUlClassName,
  propertyLiClassName,
}: {
  sectionKey: PredefinedSectionKey;
  fields: BiodataField[];
  sectionPreviewProps: PreviewProps;
  /** Classes for the `<ul>` when sectionKey is `property`. */
  propertyUlClassName?: string;
  /** Classes for each `<li>` when sectionKey is `property`. */
  propertyLiClassName?: string;
}) {
  if (sectionKey === "property") {
    if (!sectionIsVisible(fields)) return null;
    const { headingClassName, headingStyle, className } = sectionPreviewProps;
    return (
      <div className={className}>
        <h3 className={headingClassName ?? ""} style={headingStyle}>
          {PREDEFINED_SECTION_TITLES.property}
        </h3>
        <PropertyListPreview
          fields={fields}
          className={propertyUlClassName ?? ""}
          itemClassName={propertyLiClassName ?? ""}
        />
      </div>
    );
  }

  return (
    <BiodataSectionPreview
      title={PREDEFINED_SECTION_TITLES[sectionKey]}
      fields={fields}
      {...sectionPreviewProps}
    />
  );
}
