import {
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { AdditionalPhotosAppendix } from "@/components/AdditionalPhotosAppendix";
import {
  A4_EXPORT_WIDTH_PX,
  a4ExportPageHeightPx,
} from "@/constants/a4Dimensions";
import type { Biodata } from "@/types/biodata";
import type { TemplateId } from "@/types/template";

const SLICE_H = a4ExportPageHeightPx(A4_EXPORT_WIDTH_PX);

export interface BiodataExportDocumentProps {
  biodata: Biodata;
  templateId: TemplateId;
  children: ReactNode;
}

/**
 * Stacks the main template with an optional appendix. Inserts vertical padding
 * so the appendix begins at an A4 slice boundary (same as PDF export slicing).
 */
export function BiodataExportDocument({
  biodata,
  templateId,
  children,
}: BiodataExportDocumentProps) {
  const photos = biodata.additionalPhotos ?? [];
  const mainRef = useRef<HTMLDivElement>(null);
  const [spacerH, setSpacerH] = useState(0);

  useLayoutEffect(() => {
    const main = mainRef.current;
    if (!main || photos.length === 0) {
      setSpacerH(0);
      return;
    }

    const update = () => {
      const h = main.scrollHeight;
      const r = h % SLICE_H;
      setSpacerH(r === 0 ? 0 : SLICE_H - r);
    };

    update();
    const ro = new ResizeObserver(() => queueMicrotask(update));
    ro.observe(main);
    return () => ro.disconnect();
  }, [biodata, photos.length, templateId]);

  return (
    <>
      <div ref={mainRef}>{children}</div>
      {photos.length > 0 ? (
        <>
          <div className="w-full shrink-0" style={{ height: spacerH }} aria-hidden />
          <AdditionalPhotosAppendix templateId={templateId} photos={photos} />
        </>
      ) : null}
    </>
  );
}
