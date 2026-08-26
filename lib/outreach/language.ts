import type { LeadLanguage } from "./types";

export const COUNTRY_OPTIONS = [
  { value: "Mexico", label: "Mexico — Spanish", language: "es" as const },
  { value: "Spain", label: "Spain — Spanish", language: "es" as const },
  { value: "Poland", label: "Poland — Polish", language: "pl" as const },
  { value: "Germany", label: "Germany — English", language: "en" as const },
  { value: "Netherlands", label: "Netherlands — English", language: "en" as const },
  { value: "United Kingdom", label: "United Kingdom — English", language: "en" as const },
  { value: "United States", label: "United States — English", language: "en" as const },
  { value: "France", label: "France — English", language: "en" as const },
  { value: "Belgium", label: "Belgium — English", language: "en" as const },
  { value: "Italy", label: "Italy — English", language: "en" as const },
  { value: "Other", label: "Other — English", language: "en" as const },
] as const;

export function normalizeCountry(country: string) {
  return country.trim();
}

export function languageFromCountry(country: string): LeadLanguage {
  const n = country
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  if (!n) {
    return "en";
  }
  if (
    /^(mx|mex|mexico|meksyk|es|esp|spain|espana|espana)$/.test(n) ||
    n.includes("mexico") ||
    n.includes("spain") ||
    n.includes("espana")
  ) {
    return "es";
  }
  if (/^(pl|pol|poland|polska)$/.test(n) || n.includes("poland") || n.includes("polska")) {
    return "pl";
  }
  return "en";
}

export function companyFromEmail(email: string) {
  const domain = email.split("@")[1] || "";
  const host = domain.split(".")[0] || "buyer";
  if (!host || host === "gmail" || host === "outlook" || host === "hotmail" || host === "wp") {
    return "Buyer";
  }
  return host.charAt(0).toUpperCase() + host.slice(1);
}

export function parseLanguage(value: string | undefined): LeadLanguage {
  const v = value?.trim().toLowerCase();
  if (v === "es" || v === "spanish" || v === "espanol") {
    return "es";
  }
  if (v === "pl" || v === "polish" || v === "polski") {
    return "pl";
  }
  if (v === "en" || v === "english") {
    return "en";
  }
  return "en";
}
