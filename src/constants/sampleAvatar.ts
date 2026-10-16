/** Lightweight inline SVG for packaged demo biodata (no external fetch). */
export const SAMPLE_AVATAR_DATA_URL =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="200" viewBox="0 0 160 200">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#f3f4f6"/><stop offset="1" stop-color="#e5e7eb"/>
  </linearGradient></defs>
  <rect width="160" height="200" fill="url(#g)"/>
  <circle cx="80" cy="78" r="34" fill="#d1d5db"/>
  <path d="M28 186c8-38 32-58 52-58s44 20 52 58" fill="#d1d5db"/>
  <text x="80" y="194" text-anchor="middle" fill="#6b7280" font-family="system-ui,sans-serif" font-size="10">Sample</text>
</svg>`,
  );
