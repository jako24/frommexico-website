"use server";

import { redirect } from "next/navigation";
import {
  clearOutreachSession,
  isOutreachAuthenticated,
  setOutreachSession,
  verifyPassword,
} from "@/lib/outreach/auth";
import { parseLeadCsv } from "@/lib/outreach/csv";
import { processDueSequences, sendSequenceStep } from "@/lib/outreach/send";
import { nextSendDate } from "@/lib/outreach/sequence";
import {
  addEvent,
  createLead,
  deleteLead,
  getLead,
  getLeadByToken,
  listLeads,
  parseLanguage,
  replaceLead,
  updateLead,
} from "@/lib/outreach/store";
import type { LeadInput, LeadLanguage, LeadStatus } from "@/lib/outreach/types";

async function requireAuth() {
  if (!(await isOutreachAuthenticated())) {
    throw new Error("Not signed in.");
  }
}

export async function loginAction(formData: FormData) {
  const password = String(formData.get("password") || "");
  if (!verifyPassword(password)) {
    return { error: "Wrong password." };
  }
  await setOutreachSession();
  redirect("/outreach");
}

export async function logoutAction() {
  await clearOutreachSession();
  redirect("/outreach");
}

export async function addLeadAction(formData: FormData) {
  await requireAuth();
  try {
    const lead = await createLead(formFrom(formData));
    if (String(formData.get("startNow") || "") === "on") {
      return enrollLeadAction(lead.id);
    }
    return { ok: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Could not add lead." };
  }
}

export async function importCsvAction(formData: FormData) {
  await requireAuth();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose a CSV file." };
  }
  try {
    const rows = parseLeadCsv(await file.text());
    let imported = 0;
    let skipped = 0;
    for (const row of rows) {
      try {
        await createLead(row);
        imported += 1;
      } catch {
        skipped += 1;
      }
    }
    return { ok: true, imported, skipped };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "CSV import failed." };
  }
}

export async function enrollLeadAction(id: string) {
  await requireAuth();
  const lead = await getLead(id);
  if (!lead) {
    return { error: "Lead not found." };
  }
  if (lead.status === "opted_out") {
    return { error: "This contact opted out." };
  }
  lead.status = "active";
  lead.nextSendAt = nextSendDate(new Date(), 0);
  addEvent(lead, "enrolled");
  await replaceLead(lead);
  try {
    await sendSequenceStep(lead);
    await replaceLead(lead);
    return { ok: true };
  } catch (error) {
    await replaceLead(lead);
    return { error: error instanceof Error ? error.message : "Could not send." };
  }
}

export async function sendNowAction(id: string) {
  await requireAuth();
  const lead = await getLead(id);
  if (!lead) {
    return { error: "Lead not found." };
  }
  try {
    await sendSequenceStep(lead);
    await replaceLead(lead);
    return { ok: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Could not send." };
  }
}

export async function markStatusAction(id: string, status: LeadStatus) {
  await requireAuth();
  const lead = await getLead(id);
  if (!lead) {
    return { error: "Lead not found." };
  }
  lead.status = status;
  if (status === "replied") {
    lead.nextSendAt = null;
    addEvent(lead, "replied");
  } else if (status === "paused") {
    lead.nextSendAt = null;
    addEvent(lead, "paused");
  } else if (status === "opted_out") {
    lead.nextSendAt = null;
    addEvent(lead, "opted_out");
  } else if (status === "active" && lead.sequenceStep < 3) {
    lead.nextSendAt = nextSendDate(new Date(), 0);
    addEvent(lead, "enrolled", "Resumed");
  }
  await replaceLead(lead);
  return { ok: true };
}

export async function deleteLeadAction(id: string) {
  await requireAuth();
  await deleteLead(id);
  return { ok: true };
}

export async function updateLeadAction(id: string, formData: FormData) {
  await requireAuth();
  try {
    await updateLead(id, formFrom(formData));
    return { ok: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Could not update." };
  }
}

export async function processDueAction() {
  await requireAuth();
  try {
    return { ok: true, ...(await processDueSequences()) };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Could not process." };
  }
}

export async function unsubscribeAction(token: string) {
  const lead = await getLeadByToken(token);
  if (!lead) {
    return { error: "This unsubscribe link is not valid." };
  }
  lead.status = "opted_out";
  lead.nextSendAt = null;
  addEvent(lead, "opted_out");
  await replaceLead(lead);
  return { ok: true, companyName: lead.companyName };
}

export async function getOutreachSnapshot() {
  if (!(await isOutreachAuthenticated())) {
    return null;
  }
  return listLeads();
}

function formFrom(formData: FormData): LeadInput {
  return {
    companyName: String(formData.get("companyName") || ""),
    contactName: String(formData.get("contactName") || ""),
    email: String(formData.get("email") || ""),
    city: String(formData.get("city") || ""),
    website: String(formData.get("website") || ""),
    productsNoted: String(formData.get("productsNoted") || ""),
    language: parseLanguage(String(formData.get("language") || "")) as LeadLanguage,
    notes: String(formData.get("notes") || ""),
  };
}
