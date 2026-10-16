import { BiodataSectionPreview } from "@/components/BiodataSectionPreview";
import { PredefinedSectionPreviewBlock } from "@/components/PredefinedSectionPreviewBlock";
import { PREDEFINED_SECTION_TITLES } from "@/constants/sections";
import type { TemplateProps } from "@/templates/types";
import type { PredefinedSectionKey } from "@/types/biodata";
import {
  customSectionIsVisible,
  predefinedSectionIncluded,
} from "@/utils/fieldVisibility";

const TOP_BAND_KEYS: PredefinedSectionKey[] = ["overview"];

const BODY_ROWS: PredefinedSectionKey[][] = [
  ["personalDetails", "familyDetails", "education"],
  ["property", "maternalDetails"],
];

export function CompactTemplate({ biodata }: TemplateProps) {
  const rowBase =
    "flex flex-wrap items-baseline gap-x-1 border-b border-neutral-200/70 py-[0.08rem]";
  const lp = {
    className: "min-w-0",
    headingClassName:
      "mb-1 border-b border-neutral-900/80 pb-[0.1rem] text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-900",
    rowClassName: `${rowBase} text-[9.5px] leading-[1.32]`,
    labelClassName: "shrink-0 font-semibold text-neutral-600",
    valueClassName: "min-w-0 flex-1 break-words text-neutral-900",
  };

  return (
    <div className="box-border rounded-sm border border-neutral-900/15 bg-white text-neutral-950 shadow-[0_10px_40px_rgba(15,23,42,0.06)]">
      <div className="border-b-2 border-amber-800/85 bg-[#e8dfc8] px-4 py-2 text-center font-display text-[17px] font-semibold tracking-wide text-neutral-900">
        Biodata
      </div>

      <div className="grid grid-cols-[118px_minmax(0,1fr)] gap-3 p-4">
        <aside className="min-w-0">
          <div className="rounded-sm border-2 border-amber-800/60 bg-white p-0.5 shadow-sm">
            <div className="relative aspect-[3/3.75] w-full overflow-hidden bg-neutral-100">
              {biodata.profilePhoto ? (
                <img
                  src={biodata.profilePhoto}
                  alt="Profile"
                  className="biodata-profile-photo h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-[9px] text-neutral-400">
                  Photo
                </div>
              )}
            </div>
          </div>
        </aside>

        <div className="min-w-0 space-y-2">
          {TOP_BAND_KEYS.filter((key) =>
            predefinedSectionIncluded(biodata, key),
          ).map((key) => (
            <BiodataSectionPreview
              key={key}
              title={PREDEFINED_SECTION_TITLES[key]}
              fields={biodata[key]}
              editScope={{ kind: "predefined", section: key }}
              {...lp}
              headingClassName={`${lp.headingClassName} text-[9.5px]`}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-y-2 px-4 pb-4">
        {BODY_ROWS.map((row, ri) => {
          const keys = row.filter((key) =>
            predefinedSectionIncluded(biodata, key),
          );
          if (keys.length === 0) return null;
          return (
            <div
              key={ri}
              className="grid gap-x-4 gap-y-2"
              style={{
                gridTemplateColumns: `repeat(${keys.length}, minmax(0, 1fr))`,
              }}
            >
              {keys.map((key) => (
                <PredefinedSectionPreviewBlock
                  key={key}
                  sectionKey={key}
                  fields={biodata[key]}
                  sectionPreviewProps={{
                    editScope: { kind: "predefined", section: key },
                    ...lp,
                  }}
                  propertyUlClassName="text-[9.5px] leading-[1.35] text-neutral-900"
                  propertyLiClassName="marker:text-neutral-500"
                />
              ))}
            </div>
          );
        })}
      </div>

      {biodata.customSections.filter(customSectionIsVisible).length > 0 && (
        <div className="grid gap-x-4 gap-y-2 border-t border-neutral-200 px-4 py-3 [grid-template-columns:repeat(3,minmax(0,1fr))]">
          {biodata.customSections
            .filter(customSectionIsVisible)
            .map((section) => (
              <BiodataSectionPreview
                key={section.id}
                title={section.title}
                fields={section.fields}
                editScope={{ kind: "custom", sectionId: section.id }}
                {...lp}
              />
            ))}
        </div>
      )}
    </div>
  );
}
