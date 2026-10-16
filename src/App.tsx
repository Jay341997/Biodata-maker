import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react";

import { BiodataExportDocument } from "@/components/BiodataExportDocument";
import { CustomSectionEditor } from "@/components/CustomSectionEditor";
import { PdfPagedLivePreview } from "@/components/PdfPagedLivePreview";
import { PreviewFieldEditModal } from "@/components/PreviewFieldEditModal";
import { SectionEditor } from "@/components/SectionEditor";
import { useBiodata } from "@/context/BiodataContext";
import { PreviewEditDispatchProvider } from "@/context/PreviewEditDispatchContext";
import { sampleBiodataForTemplate } from "@/data/sampleBiodata";
import { PREDEFINED_SECTION_TITLES } from "@/constants/sections";
import { TEMPLATE_COMPONENTS } from "@/templates/registry";
import { PREDEFINED_SECTION_KEYS } from "@/types/biodata";
import {
  TEMPLATE_IDS,
  TEMPLATE_LABELS,
  type TemplateId,
} from "@/types/template";
import { A4_EXPORT_WIDTH_PX, a4ExportPageHeightPx } from "@/constants/a4Dimensions";
import { parseBiodataJson } from "@/utils/biodataJson";
import { livePreviewPdfPageCount } from "@/utils/livePreviewPageCount";
import { exportNodeToPdf } from "@/utils/pdfExport";
import type { Biodata } from "@/types/biodata";
import type { PreviewFieldRef } from "@/types/previewEdit";

const A4_PAGE_SLICE_PX = a4ExportPageHeightPx(A4_EXPORT_WIDTH_PX);

function BiodataPrintTree({
  biodata,
  template,
}: {
  biodata: Biodata;
  template: TemplateId;
}) {
  const TemplateImpl = TEMPLATE_COMPONENTS[template];
  return (
    <BiodataExportDocument biodata={biodata} templateId={template}>
      <TemplateImpl biodata={biodata} />
    </BiodataExportDocument>
  );
}

export default function App() {
  const {
    template,
    biodata,
    setTemplate,
    setHeaderDisplayName,
    setProfilePhoto,
    addAdditionalPhoto,
    removeAdditionalPhoto,
    replaceBiodata,
    updatePredefinedField,
    addPredefinedField,
    removePredefinedField,
    hidePredefinedSection,
    restorePredefinedSection,
    addCustomSection,
    updateCustomSectionTitle,
    updateCustomField,
    addCustomSectionField,
    removeCustomSectionField,
    removeCustomSection,
  } = useBiodata();

  const exportRootRef = useRef<HTMLDivElement>(null);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [previewMode, setPreviewMode] = useState<"pdf-pages" | "screen">(
    "pdf-pages",
  );
  const [pdfPageCount, setPdfPageCount] = useState(1);
  const [jsonImportNotice, setJsonImportNotice] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [previewEditTarget, setPreviewEditTarget] =
    useState<PreviewFieldRef | null>(null);

  const handlePreviewFieldActivate = useCallback((ref: PreviewFieldRef) => {
    setPreviewEditTarget(ref);
  }, []);

  const handlePreviewEditClose = useCallback(() => {
    setPreviewEditTarget(null);
  }, []);

  useLayoutEffect(() => {
    const el = exportRootRef.current;
    if (!el) return;

    const update = () => {
      const h = el.scrollHeight;
      setPdfPageCount(livePreviewPdfPageCount(h, A4_PAGE_SLICE_PX));
    };

    update();
    const ro = new ResizeObserver(() => {
      queueMicrotask(update);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [biodata, template]);

  const templateOptions = useMemo(
    () =>
      TEMPLATE_IDS.map((id) => ({
        id,
        label: TEMPLATE_LABELS[id],
      })),
    [],
  );

  async function handleExportPdf() {
    const node = exportRootRef.current;
    if (!node || pdfBusy) return;
    setPdfBusy(true);
    try {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }
      await exportNodeToPdf(node, "biodata.pdf");
    } finally {
      setPdfBusy(false);
    }
  }

  function handleImportJson(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? "");
      const result = parseBiodataJson(text, biodata);
      if (!result.ok) {
        setJsonImportNotice({ type: "error", message: result.error });
        input.value = "";
        return;
      }
      replaceBiodata(result.biodata);
      if (result.template) {
        setTemplate(result.template);
        setJsonImportNotice({
          type: "success",
          message: `Imported. Layout set to “${TEMPLATE_LABELS[result.template]}”.`,
        });
      } else {
        setJsonImportNotice({
          type: "success",
          message: "Imported biodata from JSON.",
        });
      }
      input.value = "";
    };
    reader.onerror = () => {
      setJsonImportNotice({
        type: "error",
        message: "Could not read this file.",
      });
      input.value = "";
    };
    reader.readAsText(file);
  }

  function loadDemoForTemplate() {
    replaceBiodata(sampleBiodataForTemplate(template));
    setJsonImportNotice({
      type: "success",
      message: `Fictional demo data loaded for “${TEMPLATE_LABELS[template]}” (your edits were replaced).`,
    });
  }

  function downloadSampleJson() {
    const payload = {
      template,
      biodata: sampleBiodataForTemplate(template),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `biodata-sample-${template}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function downloadCurrentBiodataJson() {
    const payload = { template, biodata };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `biodata-export-${template}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <aside className="w-full max-w-xl shrink-0 border-r border-slate-200 bg-white lg:min-h-screen lg:w-[420px] xl:w-[460px]">
        <div className="sticky top-0 flex max-h-screen flex-col gap-6 overflow-y-auto p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
              Biodata Builder
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
              Editor
            </h1>
          </div>

          <section className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h2 className="text-sm font-semibold text-slate-700">Template</h2>
            <label className="mt-3 flex flex-col gap-1 text-sm">
              <span className="text-slate-600">Choose layout</span>
              <select
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 outline-none ring-slate-400 focus:ring-2"
                value={template}
                onChange={(e) => setTemplate(e.target.value as TemplateId)}
              >
                {templateOptions.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
            <p className="mt-3 text-xs text-slate-500">
              Switching layouts keeps your biodata unchanged. Pick{" "}
              <span className="font-medium text-slate-700">Compact</span> for a
              dense, single-page-focused design (very long text may still spill
              to a second PDF page).
            </p>
            <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={loadDemoForTemplate}
                className="rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
              >
                Load demo for this layout
              </button>
              <button
                type="button"
                onClick={downloadSampleJson}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
              >
                Download sample JSON
              </button>
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
              Each layout bundles tailored demo rows (extra custom sections in
              some styles). Downloads include the bundled{" "}
              <code className="rounded bg-white px-1 py-px text-[10px] shadow-sm">
                profilePhoto
              </code>{" "}
              avatar placeholder.
            </p>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-700">
              Import from JSON
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              Load a biodata backup or merge a file that matches our{" "}
              <code className="rounded bg-slate-100 px-1 py-px text-[11px] text-slate-700">
                Biodata
              </code>{" "}
              shape. Omit sections you do not wish to overwrite; omitted keys
              keep the values already in the editor. You may wrap payload as{" "}
              <code className="rounded bg-slate-100 px-1 py-px text-[11px] text-slate-700">
                &#123; &quot;biodata&quot;: …, &quot;template&quot;:
                &quot;basic&quot; &#125;
              </code>
              .
            </p>
            <div className="mt-3">
              <label className="inline-flex cursor-pointer flex-col gap-2 text-sm">
                <span className="text-slate-600">Choose .json file</span>
                <input
                  type="file"
                  accept="application/json,.json"
                  className="max-w-full text-sm text-slate-600 file:mr-3 file:rounded-md file:border file:border-slate-300 file:bg-white file:px-3 file:py-1.5 file:text-sm file:font-medium hover:file:bg-slate-50"
                  onChange={handleImportJson}
                />
              </label>
              {jsonImportNotice && (
                <p
                  role="status"
                  className={
                    jsonImportNotice.type === "success"
                      ? "mt-2 text-sm text-emerald-700"
                      : "mt-2 text-sm text-red-700"
                  }
                >
                  {jsonImportNotice.message}
                </p>
              )}
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-700">
              Profile photo
            </h2>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <input
                type="file"
                accept="image/*"
                className="text-sm text-slate-600 file:mr-3 file:rounded-md file:border file:border-slate-300 file:bg-white file:px-3 file:py-1.5 file:text-sm file:font-medium hover:file:bg-slate-50"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () =>
                    setProfilePhoto(String(reader.result ?? ""));
                  reader.readAsDataURL(file);
                  e.target.value = "";
                }}
              />
              {biodata.profilePhoto && (
                <button
                  type="button"
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                  onClick={() => setProfilePhoto(undefined)}
                >
                  Remove photo
                </button>
              )}
            </div>
            <label className="mt-4 flex flex-col gap-1 text-sm">
              <span className="text-slate-600">
                Featured name (banner layouts)
              </span>
              <input
                type="text"
                placeholder="e.g. Amrita Singh"
                className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-400 focus:ring-2"
                value={biodata.headerDisplayName ?? ""}
                onChange={(e) => {
                  const v = e.target.value;
                  setHeaderDisplayName(v.length === 0 ? undefined : v);
                }}
              />
              <p className="text-[11px] text-slate-500">
                Printed large in the{" "}
                <span className="font-medium text-slate-600">Heritage Tan</span>{" "}
                hero column (match file{" "}
                <code className="rounded bg-slate-100 px-1 text-[10px]">
                  biodata-redesign/amrita-biodata.html
                </code>
                ): 44% · 56% sheet, tan band height 228px, Libre Baskerville section
                titles, Bodoni-style name size. Overview / Property / Occupation
                render below only when they contain text.
              </p>
            </label>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-700">
              Additional photos (appendix page)
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              These print on a separate sheet after your main template, styled to
              match the layout you selected. They are included when you download
              PDF or JSON.
            </p>
            <div className="mt-3">
              <label className="inline-flex cursor-pointer flex-col gap-2 text-sm">
                <span className="text-slate-600">
                  Add images (you can pick several)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="max-w-full text-sm text-slate-600 file:mr-3 file:rounded-md file:border file:border-slate-300 file:bg-white file:px-3 file:py-1.5 file:text-sm file:font-medium hover:file:bg-slate-50"
                  onChange={(e) => {
                    const list = e.target.files;
                    if (!list?.length) return;
                    for (const file of Array.from(list)) {
                      const reader = new FileReader();
                      reader.onload = () =>
                        addAdditionalPhoto(String(reader.result ?? ""));
                      reader.readAsDataURL(file);
                    }
                    e.target.value = "";
                  }}
                />
              </label>
            </div>
            {(biodata.additionalPhotos ?? []).length > 0 && (
              <ul className="mt-4 grid list-none gap-3 p-0 sm:grid-cols-2">
                {biodata.additionalPhotos!.map((src, idx) => (
                  <li
                    key={`${idx}-${src.slice(0, 32)}`}
                    className="overflow-hidden rounded-md border border-slate-200 bg-slate-50"
                  >
                    <div className="flex h-28 items-center justify-center px-2">
                      <img
                        src={src}
                        alt={`Additional ${idx + 1}`}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="flex justify-end border-t border-slate-200 bg-white px-2 py-1.5">
                      <button
                        type="button"
                        onClick={() => removeAdditionalPhoto(idx)}
                        className="text-xs font-medium text-red-700 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <div className="flex flex-col gap-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
              Sections
            </h2>
            {biodata.hiddenPredefinedSections &&
              biodata.hiddenPredefinedSections.length > 0 && (
                <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-3 text-sm">
                  <p className="font-medium text-amber-950">Removed sections</p>
                  <p className="mt-1 text-xs text-amber-900/80">
                    Data is kept — restore a section to edit it again or show it
                    in the PDF.
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {biodata.hiddenPredefinedSections.map((key) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => restorePredefinedSection(key)}
                        className="rounded-md border border-amber-300 bg-white px-2.5 py-1 text-xs font-medium text-amber-950 hover:bg-amber-100/80"
                      >
                        Restore {PREDEFINED_SECTION_TITLES[key]}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            {PREDEFINED_SECTION_KEYS.filter(
              (key) => !biodata.hiddenPredefinedSections?.includes(key),
            ).map((key) => (
              <SectionEditor
                key={key}
                sectionKey={key}
                title={PREDEFINED_SECTION_TITLES[key]}
                fields={biodata[key]}
                onUpdateField={updatePredefinedField}
                onAddField={addPredefinedField}
                onRemoveField={removePredefinedField}
                onRemoveSection={hidePredefinedSection}
              />
            ))}
          </div>

          <section className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-4">
            <header className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-indigo-950">
                Custom Sections
              </h2>
              <button
                type="button"
                onClick={addCustomSection}
                className="rounded-lg bg-indigo-700 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-600"
              >
                Add Custom Section
              </button>
            </header>
            <p className="mt-2 text-xs text-indigo-900/70">
              Sections you add stay in your data and render on every template,
              including Basic.
            </p>
            <div className="mt-4 flex flex-col gap-4">
              {biodata.customSections.map((section) => (
                <CustomSectionEditor
                  key={section.id}
                  section={section}
                  onChangeTitle={updateCustomSectionTitle}
                  onUpdateField={updateCustomField}
                  onAddField={addCustomSectionField}
                  onRemoveField={removeCustomSectionField}
                  onRemoveSection={removeCustomSection}
                />
              ))}
            </div>
          </section>
        </div>
      </aside>

      <main className="relative flex min-h-screen flex-1 flex-col overflow-x-hidden bg-slate-100/90">
        <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white/90 px-6 py-4 backdrop-blur">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              Live preview
            </p>
            <p className="mt-1 text-sm text-slate-600">
              {previewMode === "pdf-pages" ? (
                <>
                  {pdfPageCount} A4 clip{pdfPageCount === 1 ? "" : "s"} — same
                  slice height as PDF; tiny trailing blanks are not shown as an
                  extra page.
                </>
              ) : (
                <>Approximate A4 width, scaled for on-screen reading.</>
              )}{" "}
              Tap any visible field row in the preview to edit it inline.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div
              className="flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs font-semibold"
              role="group"
              aria-label="Preview mode"
            >
              <button
                type="button"
                onClick={() => setPreviewMode("pdf-pages")}
                className={`rounded-md px-3 py-1.5 transition-colors ${
                  previewMode === "pdf-pages"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                PDF pages
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode("screen")}
                className={`rounded-md px-3 py-1.5 transition-colors ${
                  previewMode === "screen"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Single scroll
              </button>
            </div>
            <button
              type="button"
              onClick={downloadCurrentBiodataJson}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
            >
              Download JSON
            </button>
            <button
              type="button"
              onClick={handleExportPdf}
              disabled={pdfBusy}
              className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pdfBusy ? "Saving PDF…" : "Download PDF"}
            </button>
          </div>
        </header>

        <div className="relative flex flex-1 flex-col items-stretch px-6 pb-16 pt-10 sm:px-8">
          {/* Off-screen A4-width node for PDF */}
          <div
            ref={exportRootRef}
            className="pointer-events-none absolute left-[-12000px] top-0 bg-white"
            style={{ width: A4_EXPORT_WIDTH_PX }}
            aria-hidden
          >
            <BiodataPrintTree biodata={biodata} template={template} />
          </div>

          <PreviewEditDispatchProvider
            onActivateField={handlePreviewFieldActivate}
          >
            {previewMode === "pdf-pages" ? (
              <div className="relative isolate z-10 w-full min-w-0">
                <PdfPagedLivePreview pageCount={pdfPageCount}>
                  <BiodataPrintTree biodata={biodata} template={template} />
                </PdfPagedLivePreview>
              </div>
            ) : (
              <div
                className="relative isolate z-10 mx-auto origin-top scale-[0.68] max-[1100px]:scale-[0.58] sm:scale-[0.72]"
                style={{ width: A4_EXPORT_WIDTH_PX }}
              >
                <BiodataPrintTree biodata={biodata} template={template} />
              </div>
            )}
          </PreviewEditDispatchProvider>
        </div>
      </main>

      <PreviewFieldEditModal
        target={previewEditTarget}
        biodata={biodata}
        onClose={handlePreviewEditClose}
        onDelete={(ref) => {
          if (ref.kind === "predefined") {
            removePredefinedField(ref.section, ref.fieldId);
          } else {
            removeCustomSectionField(ref.sectionId, ref.fieldId);
          }
        }}
        onSavePredefined={(section, fieldId, patch) => {
          updatePredefinedField(section, fieldId, patch);
        }}
        onSaveCustom={(sectionId, fieldId, patch) => {
          updateCustomField(sectionId, fieldId, patch);
        }}
      />
    </div>
  );
}
