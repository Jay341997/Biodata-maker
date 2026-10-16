import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

import { LIVE_PREVIEW_TAIL_THRESHOLD_LAYOUT_PX } from "@/utils/livePreviewPageCount";

const A4_MM_W = 210;
const A4_MM_H = 297;

/**
 * ~3 ≈ 230 dpi on A4 — closer to on-screen sharpness; per-page JPEG keeps size sane.
 */
const HTML_CAPTURE_SCALE = 3;

/** Final page encode — high quality, still far smaller than PNG. */
const PDF_JPEG_QUALITY = 0.95;

const PROFILE_IMG_SELECTOR = "img.biodata-profile-photo";
const EXTRA_IMG_SELECTOR = "img.biodata-extra-photo";

/**
 * Bake photos at capture density (and a bit above) so html2canvas is not
 * upscaling a soft bitmap.
 */
const PHOTO_RASTER_SUPERSAMPLE = HTML_CAPTURE_SCALE;

type FitMode = "cover" | "contain";

function layoutBoxForImage(img: HTMLImageElement): { w: number; h: number } | null {
  let el: HTMLElement | null = img.parentElement;
  while (el) {
    const w = el.clientWidth;
    const h = el.clientHeight;
    if (w > 1 && h > 1) return { w, h };
    el = el.parentElement;
  }

  const iw = img.clientWidth;
  const ih = img.clientHeight;
  if (iw > 1 && ih > 1) return { w: iw, h: ih };
  return null;
}

/**
 * Pre-draw cover/contain from the *full* upload into a high-res bitmap.
 * Uses PNG for this step so we don’t JPEG-compress twice before the page encode.
 */
function rasterizePhotosInClone(
  clonedExportRoot: HTMLElement,
  selector: string,
  fit: FitMode,
): void {
  const imgs =
    clonedExportRoot.querySelectorAll<HTMLImageElement>(selector);
  imgs.forEach((img) => {
    const box = layoutBoxForImage(img);
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    if (!box || iw < 1 || ih < 1) return;

    const cw = Math.max(1, Math.round(box.w));
    const ch = Math.max(1, Math.round(box.h));

    let layoutW: number;
    let layoutH: number;

    if (fit === "cover") {
      layoutW = cw;
      layoutH = ch;
    } else {
      // Contain: size the bitmap to the photo’s fitted rect only (no letterbox
      // pixels), so resolution goes into the image — matching on-page look.
      const fitScale = Math.min(cw / iw, ch / ih);
      layoutW = Math.max(1, Math.round(iw * fitScale));
      layoutH = Math.max(1, Math.round(ih * fitScale));
    }

    let outW = Math.max(1, Math.round(layoutW * PHOTO_RASTER_SUPERSAMPLE));
    let outH = Math.max(1, Math.round(layoutH * PHOTO_RASTER_SUPERSAMPLE));

    // Prefer keeping more of the original when it is only modestly larger.
    const maxEdge = 3600;
    if (outW > maxEdge || outH > maxEdge) {
      const shrink = maxEdge / Math.max(outW, outH);
      outW = Math.max(1, Math.round(outW * shrink));
      outH = Math.max(1, Math.round(outH * shrink));
    }

    const canvas = document.createElement("canvas");
    canvas.width = outW;
    canvas.height = outH;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, outW, outH);

    if (fit === "cover") {
      const scale = Math.max(outW / iw, outH / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      const ox = (outW - dw) / 2;
      const oy = (outH - dh) / 2;
      ctx.drawImage(img, 0, 0, iw, ih, ox, oy, dw, dh);
    } else {
      // Fill the content-sized canvas from the full original.
      ctx.drawImage(img, 0, 0, iw, ih, 0, 0, outW, outH);
    }

    // Lossless intermediate — page JPEG is the only lossy step.
    img.src = canvas.toDataURL("image/png");
    img.style.objectFit = "fill";
    img.style.maxWidth = "none";
    img.style.maxHeight = "none";
    img.style.padding = "0";
    img.style.objectPosition = "center";
    img.removeAttribute("width");
    img.removeAttribute("height");

    if (fit === "cover") {
      // Fill the portrait frame (profile photo) — no absolute centering.
      img.style.position = "static";
      img.style.left = "";
      img.style.top = "";
      img.style.transform = "none";
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.display = "block";
    } else {
      // Extra photos: center the fitted bitmap in the cell.
      img.style.position = "absolute";
      img.style.left = "50%";
      img.style.top = "50%";
      img.style.transform = "translate(-50%, -50%)";
      img.style.width = `${layoutW}px`;
      img.style.height = `${layoutH}px`;
    }
  });
}

async function ensurePhotosDecoded(root: HTMLElement): Promise<void> {
  const imgs = root.querySelectorAll<HTMLImageElement>(
    `${PROFILE_IMG_SELECTOR}, ${EXTRA_IMG_SELECTOR}`,
  );
  await Promise.all(
    [...imgs].map((img) => img.decode().catch(() => undefined)),
  );
}

function trimTrailingEmptyPdfSlice(source: HTMLCanvasElement): HTMLCanvasElement {
  const w = source.width;
  const h = source.height;
  const slicePx = Math.round((w * A4_MM_H) / A4_MM_W);
  if (slicePx < 16 || h < 16) return source;

  const fullPages = Math.floor(h / slicePx);
  const tailPx = h - fullPages * slicePx;
  const tailThresh = Math.max(
    32,
    Math.round(LIVE_PREVIEW_TAIL_THRESHOLD_LAYOUT_PX * HTML_CAPTURE_SCALE),
  );

  if (fullPages === 0 || tailPx === 0 || tailPx >= tailThresh) {
    return source;
  }

  const newH = fullPages * slicePx;
  const out = document.createElement("canvas");
  out.width = w;
  out.height = newH;
  const ctx = out.getContext("2d");
  if (!ctx) return source;
  ctx.drawImage(source, 0, 0, w, newH, 0, 0, w, newH);
  return out;
}

/** One A4-tall JPEG per PDF page — avoids embedding one giant image N times. */
function addCanvasAsJpegPages(
  pdf: jsPDF,
  source: HTMLCanvasElement,
  quality: number,
): void {
  const pageW = A4_MM_W;
  const pageH = A4_MM_H;
  const slicePx = Math.round((source.width * A4_MM_H) / A4_MM_W);
  const totalPages = Math.max(1, Math.ceil(source.height / slicePx));

  const pageCanvas = document.createElement("canvas");
  pageCanvas.width = source.width;
  pageCanvas.height = slicePx;
  const ctx = pageCanvas.getContext("2d");
  if (!ctx) {
    const fallback = source.toDataURL("image/jpeg", quality);
    pdf.addImage(fallback, "JPEG", 0, 0, pageW, pageH, undefined, "NONE");
    return;
  }

  for (let page = 0; page < totalPages; page++) {
    const sy = page * slicePx;
    const sh = Math.min(slicePx, source.height - sy);

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
    ctx.drawImage(
      source,
      0,
      sy,
      source.width,
      sh,
      0,
      0,
      source.width,
      sh,
    );

    const jpeg = pageCanvas.toDataURL("image/jpeg", quality);
    if (page > 0) pdf.addPage();
    // NONE = don’t re-encode again inside jsPDF.
    pdf.addImage(jpeg, "JPEG", 0, 0, pageW, pageH, undefined, "NONE");
  }
}

export async function exportNodeToPdf(
  element: HTMLElement,
  fileName = "biodata.pdf",
): Promise<void> {
  await ensurePhotosDecoded(element);

  const rawCanvas = await html2canvas(element, {
    scale: HTML_CAPTURE_SCALE,
    useCORS: true,
    logging: false,
    backgroundColor: "#ffffff",
    imageTimeout: 0,
    onclone: (_documentClone, clonedRoot) => {
      rasterizePhotosInClone(clonedRoot, PROFILE_IMG_SELECTOR, "cover");
      rasterizePhotosInClone(clonedRoot, EXTRA_IMG_SELECTOR, "contain");
    },
  });

  const canvas = trimTrailingEmptyPdfSlice(rawCanvas);

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  addCanvasAsJpegPages(pdf, canvas, PDF_JPEG_QUALITY);
  pdf.save(fileName);
}
