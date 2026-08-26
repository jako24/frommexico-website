import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { randomBytes, randomUUID } from "crypto";
import type { Lead, LeadEventType, LeadInput, LeadLanguage } from "./types";
import { companyFromEmail, languageFromCountry, parseLanguage as parseLanguageCode } from "./language";

export { parseLanguageCode as parseLanguage };

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "leads.json");
const REDIS_KEY = "frommexico:leads";

function redisConfigured() {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  );
}

async function redisCommand(command: unknown[]): Promise<unknown> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    throw new Error("Upstash Redis is not configured.");
  }
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Redis request failed (${response.status}): ${text}`);
  }
  const payload = (await response.json()) as { result?: unknown; error?: string };
  if (payload.error) {
    throw new Error(payload.error);
  }
  return payload.result;
}

function parseLeads(raw: string | null | undefined): Lead[] {
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw) as Lead[];
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.map((lead) => ({
      ...lead,
      country: lead.country || "",
      language: lead.language === "es" || lead.language === "pl" ? lead.language : lead.language === "en" ? "en" : "pl",
    }));
  } catch {
    return [];
  }
}

async function readFileStore(): Promise<Lead[]> {
  await mkdir(DATA_DIR, { recursive: true });
  try {
    return parseLeads(await readFile(DATA_FILE, "utf8"));
  } catch {
    await writeFile(DATA_FILE, "[]\n", "utf8");
    return [];
  }
}

async function writeFileStore(leads: Lead[]) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DATA_FILE, `${JSON.stringify(leads, null, 2)}\n`, "utf8");
}

export async function listLeads(): Promise<Lead[]> {
  if (redisConfigured()) {
    const result = await redisCommand(["GET", REDIS_KEY]);
    return parseLeads(typeof result === "string" ? result : null);
  }
  return readFileStore();
}

async function saveLeads(leads: Lead[]) {
  if (redisConfigured()) {
    await redisCommand(["SET", REDIS_KEY, JSON.stringify(leads)]);
    return;
  }
  await writeFileStore(leads);
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function pushEvent(lead: Lead, type: LeadEventType, detail?: string) {
  lead.events.push({ at: new Date().toISOString(), type, detail });
}

export async function createLead(input: LeadInput): Promise<Lead> {
  const email = normalizeEmail(input.email);
  if (!isValidEmail(email)) {
    throw new Error("A valid work email is required.");
  }

  const country = (input.country || "").trim();
  const language: LeadLanguage = input.language
    ? input.language
    : languageFromCountry(country);
  const companyName = input.companyName?.trim() || companyFromEmail(email);

  const leads = await listLeads();
  const existing = leads.find((lead) => lead.email === email);
  if (existing?.status === "opted_out") {
    throw new Error("This email opted out and will not be added again.");
  }
  if (existing) {
    throw new Error("This email is already on the list.");
  }

  const now = new Date().toISOString();
  const lead: Lead = {
    id: randomUUID(),
    companyName,
    contactName: input.contactName?.trim() || "",
    email,
    city: input.city?.trim() || "",
    country,
    website: input.website?.trim() || "",
    productsNoted: input.productsNoted?.trim() || "mango, avocado",
    language,
    notes: input.notes?.trim() || "",
    status: "new",
    sequenceStep: 0,
    lastSentAt: null,
    nextSendAt: null,
    createdAt: now,
    unsubscribeToken: randomBytes(18).toString("hex"),
    events: [],
  };
  pushEvent(lead, "created");
  leads.unshift(lead);
  await saveLeads(leads);
  return lead;
}

export async function updateLead(
  id: string,
  patch: Partial<Omit<Lead, "id" | "unsubscribeToken" | "createdAt" | "events">>
): Promise<Lead> {
  const leads = await listLeads();
  const lead = leads.find((item) => item.id === id);
  if (!lead) {
    throw new Error("Lead not found.");
  }
  if (patch.email) {
    patch.email = normalizeEmail(patch.email);
    if (!isValidEmail(patch.email)) {
      throw new Error("A valid work email is required.");
    }
  }
  Object.assign(lead, patch);
  pushEvent(lead, "updated");
  await saveLeads(leads);
  return lead;
}

export async function getLead(id: string) {
  const leads = await listLeads();
  return leads.find((lead) => lead.id === id) ?? null;
}

export async function getLeadByToken(token: string) {
  const leads = await listLeads();
  return leads.find((lead) => lead.unsubscribeToken === token) ?? null;
}

export async function getLeadByEmail(email: string) {
  const normalized = normalizeEmail(email);
  const leads = await listLeads();
  return leads.find((lead) => lead.email === normalized) ?? null;
}

export async function deleteLead(id: string) {
  const leads = await listLeads();
  const next = leads.filter((lead) => lead.id !== id);
  if (next.length === leads.length) {
    throw new Error("Lead not found.");
  }
  await saveLeads(next);
}

export async function replaceLead(updated: Lead) {
  const leads = await listLeads();
  const index = leads.findIndex((lead) => lead.id === updated.id);
  if (index === -1) {
    throw new Error("Lead not found.");
  }
  leads[index] = updated;
  await saveLeads(leads);
  return updated;
}

export async function saveAllLeads(leads: Lead[]) {
  await saveLeads(leads);
}

export function addEvent(lead: Lead, type: LeadEventType, detail?: string) {
  pushEvent(lead, type, detail);
}

export function isPersistentStoreConfigured() {
  return redisConfigured();
}
