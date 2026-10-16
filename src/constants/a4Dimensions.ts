/** Match jsPDF/html2canvas export width (~210 mm @ 96 dpi). */
export const A4_EXPORT_WIDTH_PX = 794 as const;

/** Vertical slice height in the same px space as the export root (297 ∶ 210). */
export function a4ExportPageHeightPx(widthPx: number = A4_EXPORT_WIDTH_PX): number {
  return Math.round((widthPx * 297) / 210);
}
