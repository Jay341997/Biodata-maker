import { BiodataSectionPreview } from "@/components/BiodataSectionPreview";
import { PredefinedSectionPreviewBlock } from "@/components/PredefinedSectionPreviewBlock";
import type { TemplateProps } from "@/templates/types";
import { PREDEFINED_SECTION_KEYS } from "@/types/biodata";
import {
  customSectionIsVisible,
  predefinedSectionIncluded,
} from "@/utils/fieldVisibility";

export function ArtDecoTemplate({ biodata }: TemplateProps) {
  const row =
    "flex flex-wrap gap-x-1 border-b border-teal-900/10 py-2 text-[0.88rem]";

  return (
    <div
      className="relative box-border overflow-hidden rounded-xl border border-teal-950/30 bg-[#0b1e1c] p-1 shadow-2xl ring-1 ring-amber-400/30"
      style={{
        backgroundImage: `
          radial-gradient(circle at 20% 15%, rgba(250, 214, 138, 0.12), transparent 42%),
          radial-gradient(circle at 80% 0%, rgba(45, 212, 191, 0.09), transparent 40%),
          linear-gradient(165deg, #0b1e1c 0%, #0f2a28 45%, #08201e 100%)`,
      }}
    >
      <div
        className="relative overflow-hidden rounded-[11px] bg-[#f4f7f6] p-10"
        style={{
          boxShadow: "inset 0 0 0 6px #c8a24a, inset 0 0 0 9px #0b1e1c",
        }}
      >
        <div
          className="pointer-events-none absolute -right-10 top-0 h-72 w-72 rotate-12 opacity-70"
          style={{
            backgroundImage: `repeating-conic-gradient(from 0deg, rgba(200, 162, 74, 0.08) 0deg 8deg, transparent 8deg 18deg)`,
          }}
        />
        <div className="pointer-events-none absolute inset-x-8 top-28 h-px bg-gradient-to-r from-transparent via-teal-900/15 to-transparent" />

        <header className="relative z-10 mb-10 text-center">
          <div className="mx-auto flex max-w-3xl items-center justify-center gap-4">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-amber-600/55" />
            <p className="font-cinzel text-[0.65rem] uppercase tracking-[0.9em] text-teal-950/70">
              Deco
            </p>
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-amber-600/55" />
          </div>
          <h1 className="mt-4 font-ornate text-4xl uppercase tracking-[0.06em] text-teal-950">
            Biodata portrait
          </h1>
          <p className="mt-3 text-sm italic text-teal-900/65">
            Bold geometry, luminous gold lines, and teal depth.
          </p>
        </header>

        <div className="relative z-10 grid gap-10 [grid-template-columns:200px_1fr]">
          <div className="mx-auto flex w-full flex-col items-center">
            <div
              className="w-full max-w-[200px] rounded-sm p-1"
              style={{
                background:
                  "linear-gradient(135deg, #c8a24a, #f3e2a4 40%, #c8a24a 72%, #7a5a1c)",
                clipPath: "polygon(10% 0, 90% 0, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0 90%, 0 10%)",
              }}
            >
              <div className="overflow-hidden bg-teal-950" style={{ clipPath: "polygon(10% 0, 90% 0, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0 90%, 0 10%)" }}>
                <div className="relative aspect-[3/4] bg-teal-950">
                  {biodata.profilePhoto ? (
                    <img
                      src={biodata.profilePhoto}
                      alt="Profile"
                      className="biodata-profile-photo h-full w-full object-cover"
                      style={{ filter: "contrast(1.02) saturate(1.05)" }}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center px-4 text-center font-cinzel text-[0.72rem] uppercase tracking-[0.45em] text-amber-100/45">
                      Portrait
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid min-w-0 gap-6 [grid-template-columns:repeat(2,minmax(0,1fr))]">
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
                    "min-w-0 rounded-md border border-teal-950/10 bg-white/90 p-5 shadow-[2px_10px_35px_rgba(15,42,40,0.12)]",
                  headingClassName:
                    "font-cinzel mb-3 flex items-center gap-2 text-[0.78rem] font-bold uppercase tracking-[0.24em] text-teal-950",
                  rowClassName: row,
                  labelClassName: "shrink-0 text-teal-800/70",
                  valueClassName: "min-w-0 flex-1 text-teal-950",
                }}
                propertyUlClassName="text-[0.88rem] leading-relaxed text-teal-950"
                propertyLiClassName="marker:text-teal-800/60"
              />
            ))}
          </div>
        </div>

        {biodata.customSections
          .filter(customSectionIsVisible)
          .map((section) => (
            <div
              key={section.id}
              className="relative z-10 mt-10 rounded-md border border-teal-950/15 bg-white/90 p-6 shadow-[2px_10px_35px_rgba(15,42,40,0.12)]"
            >
              <BiodataSectionPreview
                title={section.title}
                fields={section.fields}
                editScope={{ kind: "custom", sectionId: section.id }}
                headingClassName="font-cinzel mb-3 flex items-center gap-2 text-[0.78rem] font-bold uppercase tracking-[0.24em] text-teal-950"
                rowClassName={row}
                labelClassName="shrink-0 text-teal-800/70"
                valueClassName="min-w-0 flex-1 text-teal-950"
              />
            </div>
          ))}
      </div>
    </div>
  );
}
