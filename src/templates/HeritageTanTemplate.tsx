import { Fragment, type CSSProperties } from "react";

import { BiodataSectionPreview } from "@/components/BiodataSectionPreview";
import { PropertyListPreview } from "@/components/PropertyListPreview";
import { PREDEFINED_SECTION_TITLES } from "@/constants/sections";
import type { TemplateProps } from "@/templates/types";
import type { PredefinedSectionKey } from "@/types/biodata";
import {
  customSectionIsVisible,
  predefinedSectionShowsInPreview,
} from "@/utils/fieldVisibility";

/**
 * Aligned with amber-ai-code/biodata-redesign/amrita-biodata.html (+ .css).
 */

const LEFT_BODY: PredefinedSectionKey[] = ["personalDetails"];
const RIGHT_BODY: PredefinedSectionKey[] = [
  "familyDetails",
  "education",
  "maternalDetails",
];
const SECONDARY_LEFT: PredefinedSectionKey[] = ["overview"];

const paper = "#fdfcfa";
const ink = "#1f1d1b";
const tan = "#ccb28d";
const tanLine = "#a98759";
const matteBlue = "rgba(181, 228, 235, 0.82)";
const footerTan = "#e6cfac";

function HeroTitle({ text }: { text: string }) {
  const parts = text.trim().split(/\s+/).filter(Boolean);
  const line1 = parts[0] ?? "";
  const line2 = parts.slice(1).join(" ");

  if (!line1) {
    return (
      <h1 className="m-0 font-bodoni text-[4.75rem] font-medium leading-[0.94] tracking-[-0.04em] text-[#1f1f21]/45">
        Name
      </h1>
    );
  }

  return (
    <h1 className="m-0 font-bodoni text-[4.75rem] font-medium leading-[0.94] tracking-[-0.04em] text-[#1f1f21]">
      {line1}
      {line2 ? (
        <>
          <br />
          {line2}
        </>
      ) : null}
    </h1>
  );
}

function TextureTopLeft() {
  const before: CSSProperties = {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(140deg, rgba(244, 226, 195, 0.92) 0 20%, transparent 20% 34%, rgba(244, 226, 195, 0.82) 34% 46%, transparent 46% 58%, rgba(244, 226, 195, 0.88) 58% 67%, transparent 67% 100%)",
    transform: "rotate(-8deg)",
  };
  const after: CSSProperties = {
    position: "absolute",
    inset: "2px 0 auto 40px",
    height: 56,
    background: `
      radial-gradient(circle at 15% 50%, rgba(183, 153, 113, 0.45) 0 3px, transparent 4px),
      radial-gradient(circle at 40% 35%, rgba(183, 153, 113, 0.4) 0 3px, transparent 4px),
      radial-gradient(circle at 58% 62%, rgba(183, 153, 113, 0.4) 0 3px, transparent 4px),
      radial-gradient(circle at 76% 28%, rgba(183, 153, 113, 0.45) 0 4px, transparent 5px)
    `,
  };
  return (
    <div
      className="pointer-events-none absolute left-[-16px] top-[10px] z-[5] h-[94px] w-[180px] opacity-[0.7]"
      aria-hidden
    >
      <span className="block" style={before} />
      <span className="block" style={after} />
    </div>
  );
}

function TextureTopRight() {
  const before: CSSProperties = {
    position: "absolute",
    inset: 0,
    background: `
      linear-gradient(140deg, transparent 0 34%, rgba(242, 231, 212, 0.88) 34% 64%, transparent 64%),
      linear-gradient(20deg, transparent 0 44%, rgba(242, 231, 212, 0.88) 44% 68%, transparent 68%)
    `,
    transform: "rotate(16deg)",
  };
  return (
    <div
      className="pointer-events-none absolute right-[-14px] top-[102px] z-[5] h-[72px] w-[76px] opacity-[0.7]"
      aria-hidden
    >
      <span className="block h-full w-full" style={before} />
    </div>
  );
}

function TextureMidRight() {
  const before: CSSProperties = {
    position: "absolute",
    inset: 0,
    background: `
      radial-gradient(circle at 48% 38%, rgba(195, 194, 192, 0.7) 0 28px, transparent 29px),
      radial-gradient(circle at 64% 72%, rgba(195, 194, 192, 0.55) 0 24px, transparent 25px),
      linear-gradient(160deg, transparent 0 34%, rgba(226, 226, 226, 0.8) 34% 58%, transparent 58%)
    `,
  };
  return (
    <div
      className="pointer-events-none absolute right-[-18px] top-[430px] z-[5] h-[128px] w-[84px] opacity-[0.7]"
      aria-hidden
    >
      <span className="block h-full w-full" style={before} />
    </div>
  );
}

function TextureBottomCenter() {
  const before: CSSProperties = {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(145deg, transparent 0 14%, rgba(196, 165, 122, 0.78) 14% 28%, transparent 28% 46%, rgba(196, 165, 122, 0.52) 46% 54%, transparent 54% 100%)",
    transform: "rotate(2deg)",
  };
  const after: CSSProperties = {
    position: "absolute",
    inset: "auto 0 6px 0",
    height: 20,
    background: `
      radial-gradient(circle at 32% 50%, rgba(255, 255, 255, 0.95) 0 4px, transparent 5px),
      radial-gradient(circle at 44% 50%, rgba(255, 255, 255, 0.85) 0 3px, transparent 4px),
      radial-gradient(circle at 56% 50%, rgba(255, 255, 255, 0.9) 0 4px, transparent 5px)
    `,
  };
  return (
    <div
      className="pointer-events-none absolute bottom-[-4px] left-1/2 z-[5] h-[56px] w-[210px] -translate-x-1/2 opacity-[0.7]"
      aria-hidden
    >
      <span className="block h-full w-full" style={before} />
      <span className="absolute left-0 right-0 block" style={after} />
    </div>
  );
}

export function HeritageTanTemplate({ biodata }: TemplateProps) {
  const name = biodata.headerDisplayName?.trim() || "";
  const visibleCustoms = biodata.customSections.filter(customSectionIsVisible);

  const hasSecondaryLeft = SECONDARY_LEFT.some((k) =>
    predefinedSectionShowsInPreview(biodata, k),
  );
  const hasSecondaryRight = predefinedSectionShowsInPreview(
    biodata,
    "property",
  );

  const rowGrid =
    "grid grid-cols-[106px_14px_minmax(0,1fr)] items-start gap-x-[6px] font-sans text-[0.92rem] leading-[1.18]";

  const sectionHeading =
    "mb-[15px] font-baskerville text-base font-bold uppercase tracking-[0.02em] text-[#2a2520] [word-spacing:0.08em]";

  const sectionWrap = "mb-[30px]";

  const previewProps = {
    className: "min-w-0",
    headingClassName: `${sectionHeading} uppercase`,
    rowClassName: rowGrid,
    labelClassName: "font-bold",
    valueClassName: "whitespace-pre-line font-normal font-sans",
    separator: ":",
    separatorClassName:
      "inline-block w-[14px] text-center font-bold tabular-nums",
    fieldStackClassName: "flex flex-col gap-[10px]",
  };

  function renderSection(
    key: PredefinedSectionKey,
    wrapperClassName: string = sectionWrap,
  ) {
    if (!predefinedSectionShowsInPreview(biodata, key)) return null;
    return (
      <div className={wrapperClassName}>
        <BiodataSectionPreview
          title={PREDEFINED_SECTION_TITLES[key]}
          fields={biodata[key]}
          editScope={{ kind: "predefined", section: key }}
          {...previewProps}
        />
      </div>
    );
  }

  return (
    <article
      className="relative w-full max-w-full border-4 border-[#111] shadow-[0_10px_28px_rgba(0,0,0,0.08)]"
      style={{ backgroundColor: paper, color: ink }}
      aria-label="Biodata"
    >
      <div className="relative min-h-[952px] overflow-hidden">
        {/* amrita sheet-inner frame; typography sits inward via padded wrapper */}
        <div className="pointer-events-none absolute inset-4 z-[8] border-2 border-[#111]" />

        <TextureTopLeft />
        <TextureTopRight />
        <TextureMidRight />

        <div className="relative z-[1] px-[22px] pb-[72px] pt-5 sm:px-7 sm:pb-20 sm:pt-6">
          <div className="relative isolate grid min-h-[860px] grid-cols-[44%_56%] pb-4">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[228px]"
            style={{ backgroundColor: tan }}
            aria-hidden
          />

          <section className="relative z-[1] flex flex-col pl-5 pr-[18px] pt-[34px] pb-6">
            {/* Inner stack keeps photo ⇄ PERSONAL spacing; overview band sits under custom sections */}
            <div className="flex flex-col gap-11 sm:gap-12">
            {/* Tighter matte/frame; gap below separates PERSONAL DETAILS (flex gap avoids margin collapse). */}
            <div className="relative ml-[18px] w-[252px] max-w-[calc(100%-18px)] shrink-0">
              <div
                className="pointer-events-none absolute -left-2 -top-2 h-[308px] w-[232px] sm:h-[318px] sm:w-[238px]"
                style={{ backgroundColor: matteBlue }}
                aria-hidden
              />
              <div
                className="relative border-[3px] p-0.5"
                style={{
                  borderColor: tanLine,
                  backgroundColor: "rgba(255,255,255,0.42)",
                }}
              >
                <div className="aspect-[3/4] w-full overflow-hidden bg-gradient-to-b from-[#d6eef4] to-[#97cad6]">
                  {biodata.profilePhoto ? (
                    <img
                      src={biodata.profilePhoto}
                      alt="Portrait"
                      className="biodata-profile-photo block h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-neutral-500">
                      Photo
                    </div>
                  )}
                </div>
              </div>
            </div>

            {LEFT_BODY.map((k) => (
              <Fragment key={k}>
                {/* Tighter bottom under PERSONAL DETAILS so PROPERTY sits closer */}
                {renderSection(k, "mb-3")}
              </Fragment>
            ))}

            {visibleCustoms.map((section, idx) => (
              <div
                key={section.id}
                className={`${sectionWrap} ${idx === 0 ? "mt-2" : ""}`}
              >
                <BiodataSectionPreview
                  title={section.title.toUpperCase()}
                  fields={section.fields}
                  editScope={{ kind: "custom", sectionId: section.id }}
                  {...previewProps}
                />
              </div>
            ))}
            </div>

            {hasSecondaryLeft && (
              <div className="mt-2 border-t border-black/12 pt-2">
                {SECONDARY_LEFT.map((k) => (
                  <Fragment key={k}>{renderSection(k)}</Fragment>
                ))}
              </div>
            )}
          </section>

          <section className="relative z-[1] pl-4 pr-[34px] pt-[34px] pb-6">
            <header className="min-h-[228px] pl-[42px] pt-2">
              <HeroTitle text={name} />
            </header>

            {RIGHT_BODY.map((key, idx) => {
              const block = renderSection(key);
              if (!block) return null;
              const mt =
                idx === 0 ? "mt-0.5" : idx === 1 ? "mt-5" : "mt-[26px]";
              return (
                <div key={key} className={mt}>
                  {block}
                </div>
              );
            })}

            {hasSecondaryRight ? (
              <div className="mt-8 border-t border-black/15 pt-4">
                <h3 className={`${sectionHeading} uppercase`}>
                  {PREDEFINED_SECTION_TITLES.property}
                </h3>
                <PropertyListPreview
                  fields={biodata.property}
                  className="font-sans text-[0.92rem] leading-[1.38] text-[#2a2520]"
                  itemClassName="marker:text-[#a98759]"
                />
              </div>
            ) : null}
          </section>
          </div>
        </div>

        <footer className="absolute bottom-0 left-0 right-0 h-[60px] bg-[#e6cfac]">
          <div
            className="relative h-full w-full overflow-hidden"
            style={{ backgroundColor: footerTan }}
          >
            <TextureBottomCenter />
          </div>
        </footer>
      </div>
    </article>
  );
}
