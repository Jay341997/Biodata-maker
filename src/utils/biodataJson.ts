import type { Biodata, BiodataField, BiodataSection } from "@/types/biodata";
import { PREDEFINED_SECTION_KEYS } from "@/types/biodata";
import type { TemplateId } from "@/types/template";
import { isTemplateId } from "@/types/template";

export type BiodataJsonImportResult =
  | { ok: true; biodata: Biodata; template?: TemplateId }
  | { ok: false; error: string };

function newId(): string {
  return crypto.randomUUID();
}

function cloneBiodata(current: Biodata): Biodata {
  return {
    headerDisplayName: current.headerDisplayName,
    profilePhoto: current.profilePhoto,
    hiddenPredefinedSections: current.hiddenPredefinedSections?.length
      ? [...current.hiddenPredefinedSections]
      : undefined,
    additionalPhotos: current.additionalPhotos?.length
      ? [...current.additionalPhotos]
      : undefined,
    personalDetails: current.personalDetails.map((f) => ({ ...f })),
    overview: current.overview.map((f) => ({ ...f })),
    property: current.property.map((f) => ({ ...f })),
    familyDetails: current.familyDetails.map((f) => ({ ...f })),
    education: current.education.map((f) => ({ ...f })),
    maternalDetails: current.maternalDetails.map((f) => ({ ...f })),
    customSections: current.customSections.map((s) => ({
      ...s,
      fields: s.fields.map((f) => ({ ...f })),
    })),
  };
}

function asTrimmedString(v: unknown): string {
  if (typeof v === "string") return v;
  if (v === null || v === undefined) return "";
  return String(v);
}

function normalizeField(raw: unknown): BiodataField | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const id =
    typeof o.id === "string" && o.id.trim().length > 0 ? o.id.trim() : newId();
  const label = asTrimmedString(o.label);
  const value = asTrimmedString(o.value);
  const isCustom = o.isCustom === true;
  return isCustom ? { id, label, value, isCustom } : { id, label, value };
}

function normalizeCustomSection(raw: unknown): BiodataSection | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const id =
    typeof o.id === "string" && o.id.trim().length > 0 ? o.id.trim() : newId();
  const title = asTrimmedString(o.title);
  const rawFields = Array.isArray(o.fields) ? o.fields : [];
  const fields = rawFields
    .map(normalizeField)
    .filter((f): f is BiodataField => f !== null);
  return { id, title, fields };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function coerceBiodataRoot(input: Record<string, unknown>): Record<string, unknown> {
  if (isRecord(input.biodata)) {
    return input.biodata;
  }
  return input;
}

function parseTemplateFromWrapper(
  input: Record<string, unknown>,
): TemplateId | undefined {
  const t = input.template;
  if (typeof t !== "string" || !isTemplateId(t)) return undefined;
  return t;
}

/**
 * Merges an imported JSON blob into `current`. Only keys present in the file
 * are replaced; omit a section from the JSON to preserve what is already in
 * the editor.
 *
 * Accepts either a full payload or `{ template?: TemplateId, biodata: {...} }`.
 */
export function parseBiodataJson(
  text: string,
  current: Biodata,
): BiodataJsonImportResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text) as unknown;
  } catch {
    return { ok: false, error: "Invalid JSON (could not parse)." };
  }

  if (!isRecord(parsed)) {
    return { ok: false, error: "JSON root must be an object." };
  }

  const template = parseTemplateFromWrapper(parsed);
  const root = coerceBiodataRoot(parsed);
  if (!isRecord(root)) {
    return { ok: false, error: "Expected a biodata object." };
  }

  const out = cloneBiodata(current);

  if ("headerDisplayName" in root) {
    const h = root.headerDisplayName;
    if (h === null || h === undefined) {
      out.headerDisplayName = undefined;
    } else if (typeof h === "string") {
      out.headerDisplayName = h;
    }
  }

  if ("profilePhoto" in root) {
    const p = root.profilePhoto;
    if (p === null || p === undefined) {
      out.profilePhoto = undefined;
    } else if (typeof p === "string") {
      out.profilePhoto = p;
    }
  }

  if ("additionalPhotos" in root) {
    const raw = root.additionalPhotos;
    if (raw === null || raw === undefined) {
      out.additionalPhotos = undefined;
    } else if (!Array.isArray(raw)) {
      return {
        ok: false,
        error: 'Expected "additionalPhotos" to be an array of image URL strings.',
      };
    } else {
      const urls = raw.filter((x): x is string => typeof x === "string");
      out.additionalPhotos = urls.length ? urls : undefined;
    }
  }

  if ("hiddenPredefinedSections" in root) {
    const raw = root.hiddenPredefinedSections;
    if (raw === null || raw === undefined) {
      out.hiddenPredefinedSections = undefined;
    } else if (!Array.isArray(raw)) {
      return {
        ok: false,
        error: 'Expected "hiddenPredefinedSections" to be an array of section keys.',
      };
    } else {
      const allowed = new Set<string>(PREDEFINED_SECTION_KEYS);
      const next = raw
        .filter((x): x is string => typeof x === "string")
        .filter((x) => allowed.has(x));
      out.hiddenPredefinedSections = next.length
        ? ([...new Set(next)] as Biodata["hiddenPredefinedSections"])
        : undefined;
    }
  }

  for (const key of PREDEFINED_SECTION_KEYS) {
    if (!(key in root)) continue;
    const slice = root[key];
    if (!Array.isArray(slice)) {
      return {
        ok: false,
        error: `Expected "${key}" to be an array of fields.`,
      };
    }
    const fields = slice
      .map(normalizeField)
      .filter((f): f is BiodataField => f !== null);
    out[key] = fields;
  }

  /** Older JSON stores job fields under occupation — fold into personal details. */
  if ("occupation" in root) {
    const rawOcc = root.occupation;
    if (rawOcc === null || rawOcc === undefined) {
      /* skip */
    } else if (!Array.isArray(rawOcc)) {
      return {
        ok: false,
        error:
          'Expected legacy "occupation" to be an array of fields (merged into personalDetails).',
      };
    } else {
      const occFields = rawOcc
        .map(normalizeField)
        .filter((f): f is BiodataField => f !== null);
      const seen = new Set(out.personalDetails.map((f) => f.id));
      for (const f of occFields) {
        if (!seen.has(f.id)) {
          out.personalDetails = [...out.personalDetails, f];
          seen.add(f.id);
        }
      }
    }
  }

  if ("customSections" in root) {
    const cs = root.customSections;
    if (!Array.isArray(cs)) {
      return {
        ok: false,
        error: 'Expected "customSections" to be an array.',
      };
    }
    out.customSections = cs
      .map(normalizeCustomSection)
      .filter((s): s is BiodataSection => s !== null);
  }

  const extraKeys = Object.keys(root).filter(
    (k) =>
      !(
        k === "headerDisplayName" ||
        k === "profilePhoto" ||
        k === "additionalPhotos" ||
        k === "hiddenPredefinedSections" ||
        (PREDEFINED_SECTION_KEYS as readonly string[]).includes(k) ||
        k === "customSections" ||
        k === "occupation"
      ),
  );

  const allowedLooseKeys = ["template", "version", "_meta"];
  const unexpected = extraKeys.filter((k) => !allowedLooseKeys.includes(k));

  if (unexpected.length > 0) {
    return {
      ok: false,
      error: `Unknown keys: ${unexpected.map((x) => `"${x}"`).join(", ")}.`,
    };
  }

  return { ok: true, biodata: out, template };
}
