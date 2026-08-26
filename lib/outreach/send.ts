import { Resend } from "resend";
import * as React from "react";
import OutreachSequenceEmail from "@/components/emails/OutreachSequenceEmail";
import { getFromAddress, getReplyTo, sender } from "./config";
import {
  addEvent,
  listLeads,
  saveAllLeads,
} from "./store";
import type { Lead } from "./types";
import {
  TOTAL_STEPS,
  buildSequenceEmail,
  delayForStep,
  dueLeads,
  nextSendDate,
  remainingDailyCapacity,
  unsubscribeUrl,
} from "./sequence";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error("RESEND_API_KEY is not set.");
  }
  return new Resend(key);
}

export async function sendSequenceStep(lead: Lead, forcedStep?: number) {
  const step = forcedStep ?? lead.sequenceStep + 1;
  if (step < 1 || step > TOTAL_STEPS) {
    throw new Error("Sequence is already finished.");
  }
  if (lead.status === "opted_out") {
    throw new Error("This contact opted out.");
  }

  const email = buildSequenceEmail(lead, step);
  const resend = getResend();
  const fromValue = getFromAddress();
  const from = fromValue.includes("<")
    ? fromValue
    : `${sender.name} / ${sender.company} <${fromValue}>`;
  const { error } = await resend.emails.send({
    from,
    to: [lead.email],
    replyTo: getReplyTo(),
    subject: email.subject,
    react: React.createElement(OutreachSequenceEmail, {
      lead,
      email,
      unsubscribeHref: unsubscribeUrl(lead),
    }),
    headers: {
      "List-Unsubscribe": `<${unsubscribeUrl(lead)}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
  });

  if (error) {
    throw new Error(error.message || "Resend rejected the message.");
  }

  const now = new Date();
  lead.sequenceStep = step;
  lead.lastSentAt = now.toISOString();
  lead.status = "active";
  if (step >= TOTAL_STEPS) {
    lead.nextSendAt = null;
    lead.status = "completed";
  } else {
    lead.nextSendAt = nextSendDate(now, delayForStep(step + 1));
  }
  addEvent(lead, "sent", `Step ${step}: ${email.subject}`);
  return lead;
}

export async function processDueSequences() {
  const leads = await listLeads();
  const capacity = remainingDailyCapacity(leads);
  const due = dueLeads(leads).slice(0, capacity);
  const sent: string[] = [];
  const errors: { email: string; error: string }[] = [];

  for (const lead of due) {
    try {
      await sendSequenceStep(lead);
      sent.push(lead.email);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      errors.push({ email: lead.email, error: message });
      if (/bounce|invalid|not found/i.test(message)) {
        lead.status = "bounced";
        lead.nextSendAt = null;
        addEvent(lead, "bounced", message);
      }
    }
  }

  await saveAllLeads(leads);
  return {
    sent: sent.length,
    skipped: Math.max(0, due.length - sent.length),
    remainingToday: remainingDailyCapacity(leads),
    errors,
  };
}
