import {
  A4_EXPORT_WIDTH_PX,
  a4ExportPageHeightPx,
} from "@/constants/a4Dimensions";
import type { TemplateId } from "@/types/template";

const PAGE_H = a4ExportPageHeightPx(A4_EXPORT_WIDTH_PX);
const PHOTOS_PER_PAGE = 2;

const THEME: Record<
  TemplateId,
  { wrapper: string; title: string; accent: string }
> = {
  basic: {
    wrapper:
      "rounded-sm border-[3px] border-stone-300 bg-white px-8 py-8 shadow-sm ring-1 ring-stone-200/80",
    title: "font-display text-xl font-semibold text-stone-800",
    accent: "border-stone-200",
  },
  compact: {
    wrapper:
      "rounded-sm border-2 border-neutral-900/85 bg-white px-6 py-8 shadow-[0_6px_24px_rgba(15,23,42,0.07)]",
    title:
      "font-display text-base font-bold uppercase tracking-[0.12em] text-neutral-900",
    accent: "border-amber-800/35",
  },
  heritageTan: {
    wrapper: "border-4 border-[#111] px-7 py-8 shadow-[0_10px_28px_rgba(0,0,0,0.08)]",
    title:
      "font-baskerville text-lg font-bold uppercase tracking-[0.08em] text-[#2a2520]",
    accent: "border-[#a98759]/50",
  },
  classic: {
    wrapper:
      "rounded-lg border border-slate-300 bg-white p-10 shadow-md ring-1 ring-slate-200/70",
    title: "font-serif text-xl font-semibold text-slate-900",
    accent: "border-slate-200",
  },
  royal: {
    wrapper:
      "rounded-xl border-[3px] border-amber-700/85 bg-[#fffdf8] p-10 shadow-lg",
    title:
      "font-cinzel text-lg font-bold uppercase tracking-[0.12em] text-rose-950",
    accent: "border-amber-800/35",
  },
  artDeco: {
    wrapper:
      "rounded-[11px] border border-teal-950/25 bg-[#f4f7f6] p-10 shadow-[inset_0_0_0_3px_rgba(200,162,74,0.45)]",
    title:
      "font-cinzel text-[0.95rem] font-bold uppercase tracking-[0.22em] text-teal-950",
    accent: "border-teal-900/15",
  },
  botanical: {
    wrapper:
      "rounded-[18px] border border-emerald-900/12 bg-white/92 p-10 shadow-[4px_16px_40px_rgba(6,95,70,0.09)] backdrop-blur-sm",
    title: "font-serif text-xl font-semibold text-emerald-950",
    accent: "border-emerald-900/15",
  },
};

const PAGE_BG: Partial<Record<TemplateId, string>> = {
  heritageTan: "#fdfcfa",
  royal: "#fffdf8",
};

function chunkPhotos(photos: string[], size: number): string[][] {
  const pages: string[][] = [];
  for (let i = 0; i < photos.length; i += size) {
    pages.push(photos.slice(i, i + size));
  }
  return pages;
}

export interface AdditionalPhotosAppendixProps {
  templateId: TemplateId;
  photos: string[];
}

/**
 * Two photos per A4 page. Each page is exactly one slice tall so PDF /
 * live-preview never cuts through an image.
 */
export function AdditionalPhotosAppendix({
  templateId,
  photos,
}: AdditionalPhotosAppendixProps) {
  const t = THEME[templateId];
  const bg = PAGE_BG[templateId];
  const pages = chunkPhotos(photos, PHOTOS_PER_PAGE);

  return (
    <>
      {pages.map((pagePhotos, pageIndex) => (
        <section
          key={`appendix-page-${pageIndex}`}
          className={`box-border flex w-full flex-col overflow-hidden ${t.wrapper}`}
          style={{
            height: PAGE_H,
            backgroundColor: bg,
          }}
          aria-label={
            pageIndex === 0
              ? "Additional photographs"
              : `Additional photographs page ${pageIndex + 1}`
          }
        >
          {pageIndex === 0 ? (
            <header className={`mb-4 shrink-0 border-b pb-3 ${t.accent}`}>
              <h2 className={t.title}>Additional photographs</h2>
            </header>
          ) : null}

          <ul
            className={`m-0 grid min-h-0 list-none gap-4 p-0 ${
              pagePhotos.length === 1
                ? "grid-rows-1"
                : "grid-rows-2"
            } flex-1`}
          >
            {pagePhotos.map((src, i) => {
              const photoIndex = pageIndex * PHOTOS_PER_PAGE + i;
              return (
                <li
                  key={`${photoIndex}-${src.slice(0, 24)}`}
                  className={`relative min-h-0 overflow-hidden rounded-md border ${t.accent} bg-neutral-50/90`}
                >
                  <img
                    src={src}
                    alt={`Additional photograph ${photoIndex + 1}`}
                    className="biodata-extra-photo absolute left-1/2 top-1/2 max-h-full max-w-full -translate-x-1/2 -translate-y-1/2 object-contain p-2"
                    draggable={false}
                  />
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </>
  );
}
