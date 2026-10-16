import { BiodataSectionPreview } from "@/components/BiodataSectionPreview";
import { PredefinedSectionPreviewBlock } from "@/components/PredefinedSectionPreviewBlock";
import type { TemplateProps } from "@/templates/types";
import { PREDEFINED_SECTION_KEYS } from "@/types/biodata";
import {
  customSectionIsVisible,
  predefinedSectionIncluded,
} from "@/utils/fieldVisibility";

export function ClassicTemplate({ biodata }: TemplateProps) {
  const row =
    "flex flex-wrap gap-x-1 border-b border-slate-100 py-2 text-[0.92rem]";

  return (
    <div className="box-border rounded-lg border border-slate-200 bg-white p-10 shadow-md">
      <div className="mb-8 flex flex-wrap items-center gap-8 border-b border-slate-200 pb-8">
        <div className="h-44 w-36 overflow-hidden rounded-md border border-slate-200 bg-slate-50 shadow-inner ring-1 ring-slate-100">
          {biodata.profilePhoto ? (
            <img
              src={biodata.profilePhoto}
              alt="Profile"
              className="biodata-profile-photo h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-400">
              Photo
            </div>
          )}
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Biodata
          </p>
          <h1 className="mt-2 font-serif text-4xl font-semibold text-slate-800">
            Marriage profile
          </h1>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-600">
            A concise, print-friendly layout with serif headings and gentle
            separators.
          </p>
        </div>
      </div>

      <div className="grid gap-10 [grid-template-columns:repeat(2,minmax(0,1fr))]">
        {PREDEFINED_SECTION_KEYS.filter((key) =>
          predefinedSectionIncluded(biodata, key),
        ).map((key) => (
          <PredefinedSectionPreviewBlock
            key={key}
            sectionKey={key}
            fields={biodata[key]}
            sectionPreviewProps={{
              editScope: { kind: "predefined", section: key },
              className: "min-w-0",
              headingClassName: "mb-3 font-serif text-[1.05rem] font-semibold text-slate-800",
              rowClassName: row,
              labelClassName: "shrink-0 text-slate-500",
              valueClassName: "min-w-0 flex-1 text-slate-900",
            }}
            propertyUlClassName="text-[0.92rem] leading-relaxed text-slate-900"
            propertyLiClassName="marker:text-slate-400"
          />
        ))}
      </div>

      {biodata.customSections.filter(customSectionIsVisible).map((section) => (
        <div key={section.id} className="mt-10">
          <BiodataSectionPreview
            title={section.title}
            fields={section.fields}
            editScope={{ kind: "custom", sectionId: section.id }}
            className="min-w-0"
            headingClassName="mb-3 font-serif text-[1.05rem] font-semibold text-slate-800"
            rowClassName={row}
            labelClassName="shrink-0 text-slate-500"
            valueClassName="min-w-0 flex-1 text-slate-900"
          />
        </div>
      ))}
    </div>
  );
}
