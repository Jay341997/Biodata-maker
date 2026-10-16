import { BiodataSectionPreview } from "@/components/BiodataSectionPreview";
import { PredefinedSectionPreviewBlock } from "@/components/PredefinedSectionPreviewBlock";
import type { TemplateProps } from "@/templates/types";
import { PREDEFINED_SECTION_KEYS } from "@/types/biodata";
import {
  customSectionIsVisible,
  predefinedSectionIncluded,
} from "@/utils/fieldVisibility";

export function RoyalHeritageTemplate({ biodata }: TemplateProps) {
  const row =
    "flex flex-wrap gap-x-1 border-b border-amber-900/10 py-2 text-[0.88rem]";

  return (
    <div className="relative box-border overflow-hidden rounded-xl border-[3px] border-amber-700/80 bg-gradient-to-b from-amber-50 via-rose-50 to-amber-50 p-1 shadow-2xl">
      <div
        className="relative rounded-[11px] bg-[#fffdf8] p-10"
        style={{
          boxShadow:
            "inset 0 0 0 2px rgba(180, 138, 76, 0.55), inset 0 0 40px rgba(255, 237, 212, 0.6)",
        }}
      >
        <svg
          className="pointer-events-none absolute left-3 top-3 h-28 w-28 text-amber-700/55"
          viewBox="0 0 120 120"
          fill="none"
          aria-hidden
        >
          <path
            d="M8 8h30v30H8zm74 0h30v30H82zM8 82h30v30H8zm74 0h30v30H82z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M60 20c8 12 20 20 20 20s-12 8-20 20c-8-12-20-20-20-20s12-8 20-20z"
            fill="currentColor"
            opacity="0.28"
          />
        </svg>
        <svg
          className="pointer-events-none absolute bottom-3 right-3 h-28 w-28 rotate-180 text-amber-700/55"
          viewBox="0 0 120 120"
          fill="none"
          aria-hidden
        >
          <path
            d="M8 8h30v30H8zm74 0h30v30H82zM8 82h30v30H8zm74 0h30v30H82z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M60 20c8 12 20 20 20 20s-12 8-20 20c-8-12-20-20-20-20s12-8 20-20z"
            fill="currentColor"
            opacity="0.28"
          />
        </svg>

        <header className="relative z-10 mb-10 border-b border-rose-900/10 pb-8 text-center">
          <p className="font-cinzel text-[0.7rem] uppercase tracking-[0.6em] text-amber-800/80">
            Heritage
          </p>
          <h1 className="mt-3 font-cinzel text-4xl font-bold text-rose-950 drop-shadow-sm">
            Matrimonial biodata
          </h1>
          <div className="mx-auto mt-4 h-px w-40 bg-gradient-to-r from-transparent via-amber-700/60 to-transparent" />
        </header>

        <div className="relative z-10 grid gap-10 [grid-template-columns:220px_1fr]">
          <div className="mx-auto w-full max-w-[220px]">
            <div className="rounded-xl border-4 border-amber-700/80 bg-gradient-to-br from-amber-100 to-amber-50 p-2 shadow-lg">
              <div className="overflow-hidden rounded-lg border border-amber-900/20 bg-white">
                <div className="relative aspect-[3/4] bg-rose-950/5">
                  {biodata.profilePhoto ? (
                    <img
                      src={biodata.profilePhoto}
                      alt="Profile"
                      className="biodata-profile-photo h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center p-4 text-center font-cinzel text-sm text-rose-900/40">
                      Portrait
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid min-w-0 gap-8 [grid-template-columns:repeat(2,minmax(0,1fr))]">
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
                    "min-w-0 rounded-lg border border-amber-900/10 bg-white/70 p-5 shadow-sm backdrop-blur-sm",
                  headingClassName:
                    "font-cinzel mb-3 text-[0.95rem] font-bold uppercase tracking-[0.08em] text-rose-950",
                  rowClassName: row,
                  labelClassName: "shrink-0 text-amber-900/70",
                  valueClassName: "min-w-0 flex-1 font-medium text-rose-950",
                }}
                propertyUlClassName="text-[0.88rem] font-medium leading-relaxed text-rose-950"
                propertyLiClassName="marker:text-amber-900/55"
              />
            ))}
          </div>
        </div>

        {biodata.customSections
          .filter(customSectionIsVisible)
          .map((section) => (
            <div
              key={section.id}
              className="relative z-10 mt-10 rounded-lg border border-amber-900/15 bg-white/70 p-6"
            >
              <BiodataSectionPreview
                title={section.title}
                fields={section.fields}
                editScope={{ kind: "custom", sectionId: section.id }}
                headingClassName="font-cinzel mb-3 text-[0.95rem] font-bold uppercase tracking-[0.08em] text-rose-950"
                rowClassName={row}
                labelClassName="shrink-0 text-amber-900/70"
                valueClassName="min-w-0 flex-1 font-medium text-rose-950"
              />
            </div>
          ))}
      </div>
    </div>
  );
}
