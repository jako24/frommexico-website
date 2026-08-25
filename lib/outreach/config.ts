import copy from "@/lib/copy";

export const OUTREACH_COOKIE = "frommexico_outreach";
export const DAILY_SEND_CAP = 25;
export const SEQUENCE_DELAYS_DAYS = [0, 4, 6] as const;
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://frommexico.com";

export const sender = {
  name: "Jan Korczyński",
  firstName: "Jan",
  title: "Sales & operations",
  company: copy.brand.displayName,
  phone: copy.contact.details.phone,
  phoneMx: copy.contact.details.phone2,
  email: copy.contact.details.email,
  website: SITE_URL,
  address: copy.contact.details.address,
};

export function getFromAddress() {
  return process.env.CONTACT_EMAIL_FROM || "onboarding@resend.dev";
}

export function getReplyTo() {
  return process.env.CONTACT_EMAIL_TO || sender.email;
}
