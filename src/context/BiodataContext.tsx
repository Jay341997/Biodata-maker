import { createEmptyBiodata } from "@/data/defaultBiodata";
import type {
  Biodata,
  BiodataField,
  BiodataSection,
  PredefinedSectionKey,
} from "@/types/biodata";
import type { TemplateId } from "@/types/template";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

function newId(): string {
  return crypto.randomUUID();
}

export interface BiodataContextValue {
  template: TemplateId;
  biodata: Biodata;
  setTemplate: (t: TemplateId) => void;
  /** Optional large header name used by banner templates. */
  setHeaderDisplayName: (name: string | undefined) => void;
  setProfilePhoto: (dataUrl: string | undefined) => void;
  addAdditionalPhoto: (dataUrl: string) => void;
  removeAdditionalPhoto: (index: number) => void;
  updatePredefinedField: (
    section: PredefinedSectionKey,
    id: string,
    patch: Partial<BiodataField>,
  ) => void;
  addPredefinedField: (section: PredefinedSectionKey) => void;
  removePredefinedField: (section: PredefinedSectionKey, id: string) => void;
  hidePredefinedSection: (section: PredefinedSectionKey) => void;
  restorePredefinedSection: (section: PredefinedSectionKey) => void;
  addCustomSection: () => void;
  updateCustomSectionTitle: (sectionId: string, title: string) => void;
  updateCustomField: (
    sectionId: string,
    fieldId: string,
    patch: Partial<BiodataField>,
  ) => void;
  addCustomSectionField: (sectionId: string) => void;
  removeCustomSectionField: (sectionId: string, fieldId: string) => void;
  removeCustomSection: (sectionId: string) => void;
  /** Replaces the entire biodata document (e.g. after JSON import). */
  replaceBiodata: (next: Biodata) => void;
}

const BiodataContext = createContext<BiodataContextValue | undefined>(
  undefined,
);

export function BiodataProvider({ children }: { children: ReactNode }) {
  const [template, setTemplate] = useState<TemplateId>("basic");
  const [biodata, setBiodata] = useState<Biodata>(() => createEmptyBiodata());

  const setHeaderDisplayName = useCallback((headerDisplayName?: string) => {
    setBiodata((b) => ({ ...b, headerDisplayName }));
  }, []);

  const setProfilePhoto = useCallback((profilePhoto?: string) => {
    setBiodata((b) => ({ ...b, profilePhoto }));
  }, []);

  const addAdditionalPhoto = useCallback((dataUrl: string) => {
    setBiodata((b) => ({
      ...b,
      additionalPhotos: [...(b.additionalPhotos ?? []), dataUrl],
    }));
  }, []);

  const removeAdditionalPhoto = useCallback((index: number) => {
    setBiodata((b) => {
      const cur = [...(b.additionalPhotos ?? [])];
      cur.splice(index, 1);
      return { ...b, additionalPhotos: cur.length ? cur : undefined };
    });
  }, []);

  const updatePredefinedField = useCallback(
    (section: PredefinedSectionKey, id: string, patch: Partial<BiodataField>) => {
      setBiodata((b) => ({
        ...b,
        [section]: b[section].map((f) =>
          f.id === id ? { ...f, ...patch } : f,
        ),
      }));
    },
    [],
  );

  const addPredefinedField = useCallback((section: PredefinedSectionKey) => {
    const field: BiodataField = {
      id: newId(),
      label: "Custom field",
      value: "",
      isCustom: true,
    };
    setBiodata((b) => ({
      ...b,
      [section]: [...b[section], field],
    }));
  }, []);

  const removePredefinedField = useCallback(
    (section: PredefinedSectionKey, id: string) => {
      setBiodata((b) => ({
        ...b,
        [section]: b[section].filter((f) => f.id !== id),
      }));
    },
    [],
  );

  const hidePredefinedSection = useCallback((section: PredefinedSectionKey) => {
    setBiodata((b) => {
      const cur = b.hiddenPredefinedSections ?? [];
      if (cur.includes(section)) return b;
      return { ...b, hiddenPredefinedSections: [...cur, section] };
    });
  }, []);

  const restorePredefinedSection = useCallback(
    (section: PredefinedSectionKey) => {
      setBiodata((b) => {
        const cur = b.hiddenPredefinedSections;
        if (!cur?.length) return b;
        const next = cur.filter((k) => k !== section);
        return {
          ...b,
          hiddenPredefinedSections: next.length ? next : undefined,
        };
      });
    },
    [],
  );

  const addCustomSection = useCallback(() => {
    const section: BiodataSection = {
      id: newId(),
      title: "Custom section",
      fields: [
        {
          id: newId(),
          label: "Field",
          value: "",
        },
      ],
    };
    setBiodata((b) => ({
      ...b,
      customSections: [...b.customSections, section],
    }));
  }, []);

  const updateCustomSectionTitle = useCallback(
    (sectionId: string, title: string) => {
      setBiodata((b) => ({
        ...b,
        customSections: b.customSections.map((s) =>
          s.id === sectionId ? { ...s, title } : s,
        ),
      }));
    },
    [],
  );

  const updateCustomField = useCallback(
    (sectionId: string, fieldId: string, patch: Partial<BiodataField>) => {
      setBiodata((b) => ({
        ...b,
        customSections: b.customSections.map((s) =>
          s.id === sectionId
            ? {
                ...s,
                fields: s.fields.map((f) =>
                  f.id === fieldId ? { ...f, ...patch } : f,
                ),
              }
            : s,
        ),
      }));
    },
    [],
  );

  const addCustomSectionField = useCallback((sectionId: string) => {
    const field: BiodataField = {
      id: newId(),
      label: "Field",
      value: "",
    };
    setBiodata((b) => ({
      ...b,
      customSections: b.customSections.map((s) =>
        s.id === sectionId ? { ...s, fields: [...s.fields, field] } : s,
      ),
    }));
  }, []);

  const removeCustomSectionField = useCallback(
    (sectionId: string, fieldId: string) => {
      setBiodata((b) => ({
        ...b,
        customSections: b.customSections.map((s) =>
          s.id === sectionId
            ? { ...s, fields: s.fields.filter((f) => f.id !== fieldId) }
            : s,
        ),
      }));
    },
    [],
  );

  const removeCustomSection = useCallback((sectionId: string) => {
    setBiodata((b) => ({
      ...b,
      customSections: b.customSections.filter((s) => s.id !== sectionId),
    }));
  }, []);

  const replaceBiodata = useCallback((next: Biodata) => {
    setBiodata(next);
  }, []);

  const value = useMemo<BiodataContextValue>(
    () => ({
      template,
      biodata,
      setTemplate,
      setHeaderDisplayName,
      setProfilePhoto,
      addAdditionalPhoto,
      removeAdditionalPhoto,
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
      replaceBiodata,
    }),
    [
      template,
      biodata,
      setHeaderDisplayName,
      setProfilePhoto,
      addAdditionalPhoto,
      removeAdditionalPhoto,
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
      replaceBiodata,
    ],
  );

  return (
    <BiodataContext.Provider value={value}>{children}</BiodataContext.Provider>
  );
}

export function useBiodata(): BiodataContextValue {
  const ctx = useContext(BiodataContext);
  if (!ctx) throw new Error("useBiodata must be used within BiodataProvider");
  return ctx;
}
