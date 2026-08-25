export type LeadLanguage = "pl" | "en";

export type LeadStatus =
  | "new"
  | "active"
  | "paused"
  | "replied"
  | "opted_out"
  | "bounced"
  | "completed";

export type LeadEventType =
  | "created"
  | "enrolled"
  | "sent"
  | "paused"
  | "replied"
  | "opted_out"
  | "bounced"
  | "imported"
  | "updated";

export interface LeadEvent {
  at: string;
  type: LeadEventType;
  detail?: string;
}

export interface Lead {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  city: string;
  website: string;
  productsNoted: string;
  language: LeadLanguage;
  notes: string;
  status: LeadStatus;
  sequenceStep: number;
  lastSentAt: string | null;
  nextSendAt: string | null;
  createdAt: string;
  unsubscribeToken: string;
  events: LeadEvent[];
}

export interface LeadInput {
  companyName: string;
  contactName?: string;
  email: string;
  city?: string;
  website?: string;
  productsNoted?: string;
  language?: LeadLanguage;
  notes?: string;
}

export const SEQUENCE_STEP_LABELS = [
  "Not started",
  "1 · Opening email",
  "2 · Follow-up",
  "3 · Closing note",
] as const;
