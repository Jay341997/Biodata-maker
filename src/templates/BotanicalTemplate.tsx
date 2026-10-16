import { BiodataSectionPreview } from "@/components/BiodataSectionPreview";
import { PredefinedSectionPreviewBlock } from "@/components/PredefinedSectionPreviewBlock";
import type { TemplateProps } from "@/templates/types";
import { PREDEFINED_SECTION_KEYS } from "@/types/biodata";
import {
  customSectionIsVisible,
  predefinedSectionIncluded,
} from "@/utils/fieldVisibility";

export function BotanicalTemplate({ biodata }: TemplateProps) {
  const row =
    "flex flex-wrap gap-x-1 border-b border-emerald-900/10 py-2 text-[0.88rem]";

  return (
    <div className="relative box-border overflow-hidden rounded-[22px] bg-gradient-to-b from-emerald-50 via-white to-teal-50 p-8 shadow-xl ring-1 ring-emerald-900/10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.09]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Cpath fill='%23064e3b' d='M62 8c8 10 6 24-2 32-6-10-4-24 2-32zM18 70c12-4 28-2 36 8-14 2-28-2-36-8zM88 74c-10 8-12 22-6 34 8-12 10-26 6-34z'/%3E%3C/svg%3E\")",
          backgroundSize: "380px 380px",
        }}
      />

      <svg
        className="pointer-events-none absolute left-2 top-2 h-44 w-44 text-emerald-900/18"
        viewBox="0 0 220 220"
        fill="none"
        aria-hidden
      >
        <path
          d="M28 28c24 8 38 24 44 44-20-4-36-18-44-44zm128 0c-8 26-24 40-44 44 6-20 20-36 44-44zM28 164c8-26 24-40 44-44-6 20-18 36-44 44zm128 0c-24-8-38-24-44-44 20 4 36 18 44 44z"
          stroke="currentColor"
          strokeWidth="1.4"
        />
      </svg>

      <div className="relative z-10 mx-auto max-w-4xl rounded-[18px] border border-emerald-900/12 bg-white/80 p-10 shadow-[8px_26px_55px_rgba(6,95,70,0.12)] backdrop-blur-sm">
        <header className="mb-10 flex flex-wrap items-center justify-between gap-6 border-b border-emerald-900/10 pb-8">
          <div>
            <p className="font-script text-3xl text-emerald-900/80">With love</p>
            <h1 className="font-serif text-3xl font-semibold tracking-tight text-emerald-950">
              Garden biodata
            </h1>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-emerald-900/70">
              Botanical texture, airy panels, and understated romance.
            </p>
          </div>
          <div className="h-40 w-36 overflow-hidden rounded-2xl border-2 border-emerald-800/25 bg-emerald-50 shadow-inner ring-4 ring-white">
            {biodata.profilePhoto ? (
              <img
                src={biodata.profilePhoto}
                alt="Profile"
                className="biodata-profile-photo h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-emerald-800/35">
                Photo
              </div>
            )}
          </div>
        </header>

        <div className="grid gap-8 [grid-template-columns:repeat(2,minmax(0,1fr))]">
          {PREDEFINED_SECTION_KEYS.filter((key) =>
            predefinedSectionIncluded(biodata, key),
          ).map((key) => (
            <PredefinedSectionPreviewBlock
              key={key}
              sectionKey={key}
              fields={biodata[key]}
              sectionPreviewProps={{
                editScope: { kind: "predefined", section: key },
                className:
                  "min-w-0 rounded-2xl border border-emerald-900/10 bg-gradient-to-b from-white to-emerald-50/70 p-6",
                headingClassName:
                  "font-serif mb-4 text-[1.05rem] font-semibold text-emerald-950",
                rowClassName: row,
                labelClassName: "shrink-0 text-emerald-800/65",
                valueClassName: "min-w-0 flex-1 text-emerald-950",
              }}
              propertyUlClassName="text-[0.92rem] leading-relaxed text-emerald-950"
              propertyLiClassName="marker:text-emerald-800/50"
            />
          ))}
        </div>

        {biodata.customSections
          .filter(customSectionIsVisible)
          .map((section) => (
            <div
              key={section.id}
              className="mt-10 rounded-2xl border border-emerald-900/10 bg-gradient-to-b from-white to-emerald-50/70 p-6"
            >
              <BiodataSectionPreview
                title={section.title}
                fields={section.fields}
                editScope={{ kind: "custom", sectionId: section.id }}
                headingClassName="font-serif mb-4 text-[1.05rem] font-semibold text-emerald-950"
                rowClassName={row}
                labelClassName="shrink-0 text-emerald-800/65"
                valueClassName="min-w-0 flex-1 text-emerald-950"
              />
            </div>
          ))}
      </div>
    </div>
  );
}
