import type { PredefinedSectionKey } from "@/types/biodata";

import { BiodataSectionPreview } from "@/components/BiodataSectionPreview";
import { PredefinedSectionPreviewBlock } from "@/components/PredefinedSectionPreviewBlock";
import type { TemplateProps } from "@/templates/types";
import {
  customSectionIsVisible,
  predefinedSectionIncluded,
} from "@/utils/fieldVisibility";

const BASIC_ORDER: PredefinedSectionKey[] = [
  "personalDetails",
  "overview",
  "property",
  "familyDetails",
  "education",
  "maternalDetails",
];

export function BasicTemplate({ biodata }: TemplateProps) {
  const sectionPreviewProps = {
    className: "min-w-0",
    headingClassName:
      "font-display mb-4 border-b border-stone-200 pb-1.5 text-[1.08rem] font-semibold italic text-stone-800",
    rowClassName:
      "flex flex-wrap gap-x-1 gap-y-1 border-b border-stone-100 py-2 text-[0.9rem] leading-relaxed",
    labelClassName: "shrink-0 text-stone-600",
    valueClassName: "min-w-0 flex-1 break-words text-stone-900",
  };

  const included = BASIC_ORDER.filter((k) =>
    predefinedSectionIncluded(biodata, k),
  );
  const leftKeys = included.filter((_, i) => i % 2 === 0);
  const rightKeys = included.filter((_, i) => i % 2 === 1);

  function renderPredefinedColumn(keys: PredefinedSectionKey[]) {
    return keys.map((key) => (
      <PredefinedSectionPreviewBlock
        key={key}
        sectionKey={key}
        fields={biodata[key]}
        sectionPreviewProps={{
          editScope: { kind: "predefined", section: key },
          ...sectionPreviewProps,
        }}
        propertyUlClassName="text-[0.9rem] leading-relaxed text-stone-900"
        propertyLiClassName="marker:text-stone-400"
      />
    ));
  }

  return (
    <div className="relative box-border overflow-hidden rounded-sm bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/80">
      <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-amber-100/40" />
      <div className="pointer-events-none absolute -bottom-20 -right-10 h-56 w-56 rounded-full bg-stone-200/35" />
      <div className="pointer-events-none absolute bottom-28 right-[18%] h-24 w-24 rotate-12 rounded-sm bg-amber-50/55" />

      <div className="relative px-10 pb-12 pt-10 font-serif">
        <header className="mb-8 border-b border-stone-200 pb-6">
          <h1 className="font-display text-[1.95rem] font-semibold tracking-wide text-stone-800">
            Biodata
          </h1>
          <p className="mt-2 text-xs uppercase tracking-[0.35em] text-stone-500">
            Formal marriage biodata
          </p>
        </header>

        <div className="grid gap-10 [grid-template-columns:220px_1fr]">
          <aside className="flex flex-col items-start">
            <div className="w-full rounded border-[3px] border-stone-300 bg-white p-1.5 shadow-[inset_0_0_0_1px_rgba(214,211,209,0.6)]">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100">
                {biodata.profilePhoto ? (
                  <img
                    src={biodata.profilePhoto}
                    alt="Profile"
                    className="biodata-profile-photo h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center px-4 text-center text-sm text-stone-400">
                    Photo
                  </div>
                )}
              </div>
            </div>
          </aside>

          <div className="min-w-0">
            <div className="grid gap-x-12 gap-y-2 [grid-template-columns:repeat(2,minmax(0,1fr))]">
              <div className="flex flex-col gap-8">
                {renderPredefinedColumn(leftKeys)}
              </div>
              <div className="flex flex-col gap-8">
                {renderPredefinedColumn(rightKeys)}
              </div>
            </div>

            {biodata.customSections
              .filter(customSectionIsVisible)
              .map((section) => (
                <div key={section.id} className="mt-10">
                  <BiodataSectionPreview
                    title={section.title}
                    fields={section.fields}
                    editScope={{ kind: "custom", sectionId: section.id }}
                    {...sectionPreviewProps}
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
