import type { BiodataField } from "@/types/biodata";
import { sectionIsVisible, visibleFields } from "@/utils/fieldVisibility";

/** Property lines: one bullet per non-empty value (labels omitted; section title lives on the template). */
export function PropertyListPreview({
  fields,
  className = "",
  itemClassName = "",
}: {
  fields: BiodataField[];
  /** `<ul>` */
  className?: string;
  /** `<li>` */
  itemClassName?: string;
}) {
  if (!sectionIsVisible(fields)) return null;
  const rows = visibleFields(fields);
  return (
    <ul
      className={`m-0 list-outside list-disc ps-5 [list-style-position:outside] ${className}`.trim()}
    >
      {rows.map((f) => (
        <li key={f.id} className={`ps-1 ${itemClassName}`.trim()}>
          {f.value}
        </li>
      ))}
    </ul>
  );
}
