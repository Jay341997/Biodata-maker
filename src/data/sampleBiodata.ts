import { SAMPLE_AVATAR_DATA_URL } from "@/constants/sampleAvatar";
import type { Biodata, BiodataSection } from "@/types/biodata";
import type { TemplateId } from "@/types/template";

function clone<T>(v: T): T {
  return structuredClone(v);
}

/** Shared realistic content used as a base for every template demo. */
const REFERENCE_BASE: Biodata = {
  profilePhoto: SAMPLE_AVATAR_DATA_URL,
  personalDetails: [
    { id: "pd-dob", label: "Date Of Birth", value: "03 April 1997" },
    { id: "pd-height", label: "Height", value: '5\'6"' },
    { id: "pd-weight", label: "Weight", value: "75 kg" },
    {
      id: "pd-native",
      label: "Native Place",
      value: "Chitravad, Jamkandorda, Rajkot",
    },
    {
      id: "pd-address",
      label: "Address",
      value: "A/902, Shukan Rivera, Causeway Rd, Singanpore, Surat",
    },
    { id: "pd-mobile", label: "Mobile No", value: "+91 95101 44724" },
    {
      id: "oc-company",
      label: "Company",
      value: "Amberstudent, Pune",
    },
    { id: "oc-salary", label: "Salary", value: "51 LPA CTC" },
  ],
  overview: [
    {
      id: "ov-summary",
      label: "Summary",
      value:
        "Lead Software Engineer at Amberstudent, Pune · B.Tech ICT, DAIICT · Native: Chitravad, Jamkandorda, Rajkot.",
    },
  ],
  property: [
    {
      id: "pr-res",
      label: "Residence",
      value: "3 BHK flats at Surat & Ahmedabad",
    },
    { id: "pr-agri", label: "Agri. Land", value: "7 vigha at Chitravad" },
  ],
  familyDetails: [
    {
      id: "fd-father",
      label: "Father's Name",
      value: "Rasikbhai Nathabhai Bhut",
    },
    { id: "fd-fjob", label: "Father's Job", value: "Teacher" },
    {
      id: "fd-mother",
      label: "Mother's Name",
      value: "Vanitaben Rasikbhai Bhut",
    },
    { id: "fd-bro", label: "Brother", value: "Vikas Patel (Married)" },
    { id: "fd-bjob", label: "Brother's Job", value: "ONGC, Mumbai" },
    {
      id: "fd-sil",
      label: "Sister-in-Law",
      value: "Kajal Vikas Patel",
    },
    { id: "fd-sjob", label: "Her Job", value: "LTIMindtree, Mumbai" },
  ],
  education: [
    { id: "ed-level", label: "Education", value: "B.Tech in ICT" },
    {
      id: "ed-prof",
      label: "Profession",
      value: "Lead Software Engineer",
    },
    {
      id: "ed-college",
      label: "College",
      value: "DA-IICT, Gandhinagar",
    },
    { id: "ed-duration", label: "Duration", value: "2015–2019" },
  ],
  maternalDetails: [
    {
      id: "md-uncle1",
      label: "Uncle's Name",
      value: "Rajeshbhai Hirajibhai Manvar",
    },
    {
      id: "md-uncle2",
      label: "Uncle's Name",
      value: "Vinaybhai Hirajibhai Manvar",
    },
    {
      id: "md-native",
      label: "Native Place",
      value: "Anida Vachhra, Kotda, Rajkot",
    },
  ],
  customSections: [],
};

function withCustomSections(extra: BiodataSection[]): Biodata {
  const b = clone(REFERENCE_BASE);
  b.customSections = extra.map((s) => ({
    ...s,
    fields: s.fields.map((f) => ({ ...f })),
  }));
  return b;
}

const royalExtras: BiodataSection[] = [
  {
    id: "cs-gotra",
    title: "Heritage & Gotra",
    fields: [
      {
        id: "cs-g-1",
        label: "Kuladev / Surname",
        value: "Patel",
      },
      {
        id: "cs-g-2",
        label: "Native district",
        value: "Rajkot",
      },
    ],
  },
];

const artDecoExtras: BiodataSection[] = [
  {
    id: "cs-pref",
    title: "Preferences",
    fields: [
      { id: "cs-p-1", label: "Location", value: "Open to Pune / Mumbai" },
      { id: "cs-p-2", label: "Lifestyle", value: "Non-smoker, vegetarian" },
    ],
  },
];

const botanicalExtras: BiodataSection[] = [
  {
    id: "cs-life",
    title: "Interests",
    fields: [
      { id: "cs-l-1", label: "Interests", value: "Travel, reading, classical music" },
      {
        id: "cs-l-2",
        label: "Community",
        value: "Volunteer teaching on weekends",
      },
    ],
  },
];

const classicExtras: BiodataSection[] = [
  {
    id: "cs-note",
    title: "Note",
    fields: [
      {
        id: "cs-n-1",
        label: "Horoscope",
        value: "Details available on request",
      },
    ],
  },
];

/** Shorter copy so the compact layout usually stays on a single A4 page. */
const COMPACT_OVERRIDES: Partial<Biodata> = {
  overview: [
    {
      id: "ov-summary",
      label: "Summary",
      value:
        "Lead SWE (Amberstudent, Pune) · ICT, DA-IICT · Rajkot native.",
    },
  ],
  personalDetails: [
    { id: "pd-dob", label: "Date Of Birth", value: "03 Apr 1997" },
    { id: "pd-height", label: "Height", value: '5\'6"' },
    { id: "pd-weight", label: "Weight", value: "75 kg" },
    {
      id: "pd-native",
      label: "Native Place",
      value: "Chitravad, Jamkandorda, Rajkot",
    },
    {
      id: "pd-address",
      label: "Address",
      value: "A/902 Shukan Rivera, Singanpore, Surat",
    },
    { id: "pd-mobile", label: "Mobile No", value: "+91 95101 44724" },
    {
      id: "oc-company",
      label: "Company",
      value: "Amberstudent, Pune",
    },
    { id: "oc-salary", label: "Salary", value: "51 LPA CTC" },
  ],
  familyDetails: [
    {
      id: "fd-father",
      label: "Father's Name",
      value: "Rasikbhai N. Bhut",
    },
    { id: "fd-fjob", label: "Father's Job", value: "Teacher" },
    {
      id: "fd-mother",
      label: "Mother's Name",
      value: "Vanitaben R. Bhut",
    },
    { id: "fd-bro", label: "Brother", value: "Vikas Patel (m.)" },
    { id: "fd-bjob", label: "Brother's Job", value: "ONGC, Mumbai" },
    { id: "fd-sil", label: "Sister-in-Law", value: "Kajal V. Patel" },
    { id: "fd-sjob", label: "Her Job", value: "LTIMindtree, Mumbai" },
  ],
  maternalDetails: [
    {
      id: "md-uncle1",
      label: "Uncle's Name",
      value: "Rajeshbhai H. Manvar",
    },
    {
      id: "md-uncle2",
      label: "Uncle's Name",
      value: "Vinaybhai H. Manvar",
    },
    {
      id: "md-native",
      label: "Native Place",
      value: "Anida Vachhra, Kotda, Rajkot",
    },
  ],
};

function mergeCompact(): Biodata {
  const b = clone(REFERENCE_BASE);
  return {
    ...b,
    ...COMPACT_OVERRIDES,
    personalDetails: COMPACT_OVERRIDES.personalDetails ?? b.personalDetails,
    overview: COMPACT_OVERRIDES.overview ?? b.overview,
    familyDetails: COMPACT_OVERRIDES.familyDetails ?? b.familyDetails,
    maternalDetails: COMPACT_OVERRIDES.maternalDetails ?? b.maternalDetails,
  };
}

/** Demo matching the layered tan header / two-column matrimonial aesthetic. */
const HERITAGE_TAN_SAMPLE: Biodata = {
  profilePhoto: SAMPLE_AVATAR_DATA_URL,
  headerDisplayName: "Amrita Singh",
  personalDetails: [
    { id: "pd-dob", label: "Date Of Birth", value: "12 May 1996" },
    { id: "pd-height", label: "Height", value: '5\'4"' },
    { id: "pd-weight", label: "Weight", value: "52 kg" },
    { id: "pd-religion", label: "Religion", value: "Sikhism", isCustom: true },
    { id: "pd-native", label: "Native Place", value: "Dwarka, New Delhi" },
    {
      id: "pd-district",
      label: "District",
      value: "South West Delhi",
      isCustom: true,
    },
    {
      id: "pd-bg",
      label: "Blood Group",
      value: "B+",
      isCustom: true,
    },
    {
      id: "pd-address",
      label: "Address",
      value:
        "B-902, Sunrise Residency, Sector 19, Dwarka, New Delhi · 110075",
    },
    { id: "oc-company", label: "Company", value: "" },
    { id: "oc-salary", label: "Salary", value: "" },
  ],
  overview: [{ id: "ov-summary", label: "Summary", value: "" }],
  property: [
    { id: "pr-res", label: "Residence", value: "" },
    { id: "pr-agri", label: "Agri. Land", value: "" },
  ],
  familyDetails: [
    {
      id: "fd-father",
      label: "Father's Name",
      value: "Harpreet Singh Khurana",
    },
    { id: "fd-fjob", label: "Father's Job", value: "Retd. Army Officer" },
    {
      id: "fd-mobile-f",
      label: "Mobile No",
      value: "+91 98100 44556",
      isCustom: true,
    },
    {
      id: "fd-mother",
      label: "Mother's Name",
      value: "Simran Kaur Khurana",
    },
    {
      id: "fd-mjob",
      label: "Mother's Job",
      value: "Principal, KV School",
      isCustom: true,
    },
    {
      id: "fd-sibs",
      label: "Siblings",
      value: "Ishita Singh (married), Kabir Singh (unmarried)",
      isCustom: true,
    },
  ],
  education: [
    {
      id: "ed-level",
      label: "Education",
      value: "MBA, Marketing",
    },
    {
      id: "ed-prof",
      label: "Profession",
      value: "Marketing Manager",
    },
    {
      id: "ed-college",
      label: "College",
      value: "IIM Ahmedabad (2020)",
    },
    {
      id: "ed-hs",
      label: "High School",
      value: "Modern School, Barakhamba Road (2014)",
      isCustom: true,
    },
  ],
  maternalDetails: [
    {
      id: "md-uncle1",
      label: "Uncle's Name",
      value: "Paramjeet Singh Kohli",
    },
    {
      id: "md-uncle2",
      label: "Uncle's Name",
      value: "Gurpreet Singh Kohli",
    },
    {
      id: "md-native",
      label: "Native Place",
      value: "Amritsar, Punjab",
    },
    {
      id: "md-district",
      label: "District",
      value: "Amritsar",
      isCustom: true,
    },
  ],
  customSections: [
    {
      id: "cs-hobbies",
      title: "Hobbies",
      fields: [
        {
          id: "cs-h-1",
          label: "Hobbies",
          value: "Reading, travel, photography, classical dance workshops",
        },
        {
          id: "cs-h-2",
          label: "Interests",
          value:
            "Kathak, art walks, sustainable fashion; volunteers with literacy drives on weekends",
        },
      ],
    },
  ],
};

const cache: Partial<Record<TemplateId, Biodata>> = {};

/**
 * Fresh clone of the demo biodata styled for the given template.
 * Import via “Load demo for this layout” or call from tests.
 */
export function sampleBiodataForTemplate(id: TemplateId): Biodata {
  if (cache[id]) return clone(cache[id]!);

  let next: Biodata;
  switch (id) {
    case "basic":
      next = clone(REFERENCE_BASE);
      break;
    case "classic":
      next = withCustomSections(classicExtras);
      break;
    case "royal":
      next = withCustomSections(royalExtras);
      break;
    case "artDeco":
      next = withCustomSections(artDecoExtras);
      break;
    case "botanical":
      next = withCustomSections(botanicalExtras);
      break;
    case "compact":
      next = mergeCompact();
      break;
    case "heritageTan":
      next = clone(HERITAGE_TAN_SAMPLE);
      break;
  }
  cache[id] = next;
  return clone(next);
}

/** All templates → demo payload (for exporting JSON fixtures if needed). */
export function allSampleBiodata(): Record<TemplateId, Biodata> {
  return {
    basic: sampleBiodataForTemplate("basic"),
    classic: sampleBiodataForTemplate("classic"),
    royal: sampleBiodataForTemplate("royal"),
    artDeco: sampleBiodataForTemplate("artDeco"),
    botanical: sampleBiodataForTemplate("botanical"),
    compact: sampleBiodataForTemplate("compact"),
    heritageTan: sampleBiodataForTemplate("heritageTan"),
  };
}
