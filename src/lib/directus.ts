/**
 * Directus CMS Client
 *
 * Fetches content from the Directus API with hardcoded fallbacks.
 * If Directus is unreachable or the collection doesn't exist yet,
 * the app gracefully falls back to the default values.
 */

const DIRECTUS_URL = process.env.DIRECTUS_INTERNAL_URL || "http://directus:8055";

interface SiteSettings {
  first_name: string;
  last_name: string;
  full_name: string;
  short_name: string;
  job_title: string;
  twitter_handle: string;
  country_name: string;
  country_code: string;
  timezone: string;
  github_url: string;
  linkedin_url: string;
  email: string;
  site_url: string;
  about_intro: string;
  about_detail: string;
  now_text: string;
  now_link_text: string;
  now_link_url: string;
  intro_text: string;
  intro_cta: string;
}

interface Skill {
  id: number;
  name: string;
  sort: number;
}

interface VisitedCountry {
  id: number;
  name: string;
}

// Default fallback values (your current hardcoded content)
const DEFAULT_SETTINGS: SiteSettings = {
  first_name: "Zaidan",
  last_name: "Chaudhary",
  full_name: "Zaidan Chaudhary",
  short_name: "Zaidan",
  job_title: "Full Stack Developer / AI Engineer",
  twitter_handle: "zaidanch",
  country_name: "Pakistan",
  country_code: "PK",
  timezone: "Asia/Karachi",
  github_url: "https://github.com/zaidanch",
  linkedin_url: "https://www.linkedin.com/in/",
  email: "zaidan@arxiron.com",
  site_url: "https://arxiron.com/",
  about_intro:
    "Hi, I'm Zaidan, a Senior Software Engineer with 6 years of experience building scalable, cloud-native web apps and data-driven platforms.",
  about_detail:
    "I enjoy owning production systems end-to-end, and recently led the architecture for a luxury real estate platform's core business model. I also actively build AI-driven features using RAG and supervised fine-tuning.",
  now_text: "Currently working fulltime at",
  now_link_text: "Devsinc",
  now_link_url: "https://devsinc.com",
  intro_text:
    "Hi, I'm <b>Zaidan Chaudhary</b>, a Senior Software Engineer & AI Engineer with a focus on scalable, cloud-native applications and AI-driven features.",
  intro_cta:
    "Feel free to reach out to me if you have any project in mind, want to collaborate, or just want to say hello.",
};

const DEFAULT_SKILLS: Skill[] = [
  { id: 1, name: "Python (Django, FastAPI)", sort: 1 },
  { id: 2, name: "React & Next.js / Vue & Nuxt", sort: 2 },
  { id: 3, name: "AWS & Terraform", sort: 3 },
  { id: 4, name: "LangChain & PyTorch", sort: 4 },
];

const DEFAULT_ABOUT_SKILLS = [
  "Python (Django, FastAPI)",
  "React, Next.js, Nuxt, Vue",
  "MERN Stack",
  "AWS, GCP, Terraform",
  "LangChain/Graph, PyTorch, Hugging Face",
  "Pinecone, Qdrant, FAISS",
];

const DEFAULT_COUNTRIES: VisitedCountry[] = [
  { id: 1, name: "Oman" },
  { id: 2, name: "Pakistan" },
  { id: 3, name: "UAE" },
  { id: 4, name: "Qatar" },
  { id: 5, name: "Saudi Arabia" },
  { id: 6, name: "China" },
  { id: 7, name: "Thailand" },
  { id: 8, name: "Malaysia" },
];

/**
 * Generic fetch helper for Directus items.
 * Returns null if Directus is unreachable or collection doesn't exist.
 */
async function fetchDirectus<T>(collection: string, params?: string): Promise<T | null> {
  try {
    const url = `${DIRECTUS_URL}/items/${collection}${params ? `?${params}` : ""}`;
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data as T;
  } catch {
    return null;
  }
}

/**
 * Get site settings. Returns the first (and only) item from the site_settings singleton.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  const data = await fetchDirectus<SiteSettings[]>("site_settings", "limit=1");
  return data?.[0] ?? DEFAULT_SETTINGS;
}

/**
 * Get the skills list, sorted by the `sort` field.
 */
export async function getSkills(): Promise<Skill[]> {
  const data = await fetchDirectus<Skill[]>("skills", "sort=sort");
  return data?.length ? data : DEFAULT_SKILLS;
}

/**
 * Get the about me tech stack list.
 */
export async function getAboutSkills(): Promise<string[]> {
  const data = await fetchDirectus<{ id: number; name: string; sort: number }[]>(
    "about_skills",
    "sort=sort"
  );
  return data?.length ? data.map((s) => s.name) : DEFAULT_ABOUT_SKILLS;
}

/**
 * Get visited countries.
 */
export async function getVisitedCountries(): Promise<string[]> {
  const data = await fetchDirectus<VisitedCountry[]>("visited_countries");
  return data?.length ? data.map((c) => c.name) : DEFAULT_COUNTRIES.map((c) => c.name);
}
