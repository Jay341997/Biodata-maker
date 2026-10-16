/** CSS px — match PDF export trimming in `pdfExport.ts` (× capture scale there). */
export const LIVE_PREVIEW_TAIL_THRESHOLD_LAYOUT_PX = 72;

/**
 * Page count for clipped “PDF pages” live preview.
 *
 * `scrollHeight` often lands a few pixels past an A4 boundary; `ceil` would
 * show an extra page that is visually empty. Omit a final slice when the tail
 * is too small to carry meaningful content.
 */
export function livePreviewPdfPageCount(
  scrollHeightPx: number,
  pageSliceHeightPx: number,
  /** Ignore a trailing band at most this tall (subpixel / rounding noise). */
  minMeaningfulTailPx = LIVE_PREVIEW_TAIL_THRESHOLD_LAYOUT_PX,
): number {
  if (scrollHeightPx <= 0 || pageSliceHeightPx <= 0) return 1;

  const fullPages = Math.floor(scrollHeightPx / pageSliceHeightPx);
  const tailPx = scrollHeightPx - fullPages * pageSliceHeightPx;

  if (tailPx === 0) {
    return Math.max(1, fullPages);
  }
  if (tailPx > minMeaningfulTailPx) {
    return Math.max(1, fullPages + 1);
  }
  return Math.max(1, fullPages);
}
