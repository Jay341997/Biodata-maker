export const TEMPLATE_IDS = [
  "basic",
  "compact",
  "heritageTan",
  "classic",
  "royal",
  "artDeco",
  "botanical",
] as const;

export type TemplateId = (typeof TEMPLATE_IDS)[number];

export function isTemplateId(value: string): value is TemplateId {
  return (TEMPLATE_IDS as readonly string[]).includes(value);
}

export const TEMPLATE_LABELS: Record<TemplateId, string> = {
  basic: "Basic",
  compact: "Compact (1 page)",
  heritageTan: "Heritage Tan",
  classic: "Classic",
  royal: "Royal Heritage",
  artDeco: "Art Deco",
  botanical: "Botanical",
};
