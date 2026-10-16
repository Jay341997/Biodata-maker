import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

import {
  A4_EXPORT_WIDTH_PX,
  a4ExportPageHeightPx,
} from "@/constants/a4Dimensions";

const PAGE_W = A4_EXPORT_WIDTH_PX;
const PAGE_H = a4ExportPageHeightPx(PAGE_W);

export interface PdfPagedLivePreviewProps {
  children: ReactNode;
  /** From ceil(scrollHeight / pageHeightPx) on the hidden export DOM. */
  pageCount: number;
}

/**
 * Stacks A4-shaped viewports over repeated document output, clipped like the PDF
 * raster slice (approximate vs html2canvas subpixels).
 */
export function PdfPagedLivePreview({
  children,
  pageCount,
}: PdfPagedLivePreviewProps) {
  const pages = Math.max(1, pageCount);
  const railRef = useRef<HTMLDivElement>(null);
  const [viewW, setViewW] = useState<number | null>(null);

  useLayoutEffect(() => {
    const rail = railRef.current;
    if (!rail || typeof ResizeObserver === "undefined") return;

    const update = () => {
      const w = rail.clientWidth;
      if (typeof w !== "number" || w <= 8) return;
      setViewW((prev) =>
        prev != null && Math.abs(prev - w) < 0.5 ? prev : Math.floor(w),
      );
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(rail);
    return () => ro.disconnect();
  }, []);

  const sliceW =
    typeof viewW === "number" && viewW > 8 ? viewW : A4_EXPORT_WIDTH_PX;
  const scale = sliceW / PAGE_W;
  const sliceH = PAGE_H * scale;

  return (
    <div ref={railRef} className="flex w-full min-w-0 flex-col gap-10 pb-4">
      {Array.from({ length: pages }, (_, i) => (
        <figure
          key={i}
          className="relative w-full shrink-0 overflow-hidden rounded-md border-[3px] border-neutral-900/90 bg-white shadow-[0_22px_50px_rgba(0,0,0,0.22)] ring-2 ring-neutral-950/85"
          style={{
            aspectRatio: "210 / 297",
          }}
        >
          <figcaption className="pointer-events-none absolute right-3 top-2 z-10 rounded bg-black/60 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
            PDF&nbsp;preview · Page {i + 1}/{pages}
          </figcaption>

          <div
            className="absolute left-0 top-0"
            style={{ height: sliceH, width: sliceW }}
          >
            <div
              className="absolute left-0 top-0 box-border bg-white origin-top-left"
              style={{
                transform: `scale(${scale})`,
                width: PAGE_W,
                willChange: "transform",
              }}
            >
              <div
                style={{
                  transform: `translateY(-${i * PAGE_H}px)`,
                  width: PAGE_W,
                }}
              >
                {children}
              </div>
            </div>
          </div>
        </figure>
      ))}
    </div>
  );
}
