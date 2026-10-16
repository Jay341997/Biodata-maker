import type { Biodata } from "@/types/biodata";

export function createEmptyBiodata(): Biodata {
  return {
    profilePhoto: undefined,
    additionalPhotos: undefined,
    personalDetails: [
      { id: "pd-dob", label: "Date Of Birth", value: "" },
      { id: "pd-height", label: "Height", value: "" },
      { id: "pd-weight", label: "Weight", value: "" },
      { id: "pd-native", label: "Native Place", value: "" },
      { id: "pd-address", label: "Address", value: "" },
      { id: "pd-mobile", label: "Mobile No", value: "" },
      { id: "oc-company", label: "Company", value: "" },
      { id: "oc-salary", label: "Salary", value: "" },
    ],
    overview: [{ id: "ov-summary", label: "Summary", value: "" }],
    property: [
      { id: "pr-res", label: "Residence", value: "" },
      { id: "pr-agri", label: "Agri. Land", value: "" },
    ],
    familyDetails: [
      { id: "fd-father", label: "Father's Name", value: "" },
      { id: "fd-fjob", label: "Father's Job", value: "" },
      { id: "fd-mother", label: "Mother's Name", value: "" },
      { id: "fd-bro", label: "Brother", value: "" },
      { id: "fd-bjob", label: "Brother's Job", value: "" },
      { id: "fd-sil", label: "Sister-in-Law", value: "" },
      { id: "fd-sjob", label: "Her Job", value: "" },
    ],
    education: [
      { id: "ed-level", label: "Education", value: "" },
      { id: "ed-prof", label: "Profession", value: "" },
      { id: "ed-college", label: "College", value: "" },
      { id: "ed-duration", label: "Duration", value: "" },
    ],
    maternalDetails: [
      { id: "md-uncle1", label: "Uncle's Name", value: "" },
      { id: "md-uncle2", label: "Uncle's Name", value: "" },
      { id: "md-native", label: "Native Place", value: "" },
    ],
    customSections: [],
  };
}

