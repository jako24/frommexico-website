"use client";

import { useMemo, useState, useTransition } from "react";
import {
  addLeadAction,
  deleteLeadAction,
  enrollLeadAction,
  importCsvAction,
  logoutAction,
  markStatusAction,
  processDueAction,
  sendNowAction,
} from "@/app/actions/outreach";
import { DAILY_SEND_CAP, sender } from "@/lib/outreach/config";
import { researchLinks, researchPlaybook } from "@/lib/outreach/research";
import {
  remainingDailyCapacity,
  buildSequenceEmail,
  closingLine,
  sentTodayCount,
} from "@/lib/outreach/sequence";
import { COUNTRY_OPTIONS } from "@/lib/outreach/language";
import copy from "@/lib/copy";
import type { Lead, LeadStatus } from "@/lib/outreach/types";
import { SEQUENCE_STEP_LABELS } from "@/lib/outreach/types";

const inputClass =
  "w-full rounded-lg border border-stone-200 bg-white px-3 py-3 text-base text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-600 sm:py-2 sm:text-sm";

export default function OutreachDesk({
  leads,
  persistent,
  replyTo,
}: {
  leads: Lead[];
  persistent: boolean;
  replyTo: string;
}) {
  const [filter, setFilter] = useState("all");
  const [selectedId, setSelectedId] = useState(leads[0]?.id ?? "");
  const [message, setMessage] = useState("");
  const [previewStep, setPreviewStep] = useState(1);
  const [pending, startTransition] = useTransition();

  const selected = leads.find((lead) => lead.id === selectedId) ?? leads[0] ?? null;
  const remaining = remainingDailyCapacity(leads);
  const sentToday = sentTodayCount(leads);

  const visible = useMemo(() => {
    if (filter === "all") {
      return leads;
    }
    return leads.filter((lead) => lead.status === filter);
  }, [filter, leads]);

  const previewLead: Lead = selected ?? {
    id: "preview",
    companyName: "Hurtownia Przykład",
    contactName: "",
    email: "zakupy@example.com",
    city: "Warszawa",
    country: "Poland",
    website: "",
    productsNoted: "mango, awokado",
    language: "pl",
    notes: "",
    status: "new",
    sequenceStep: 0,
    lastSentAt: null,
    nextSendAt: null,
    createdAt: new Date().toISOString(),
    unsubscribeToken: "preview",
    events: [],
  };

  const preview = buildSequenceEmail(previewLead, previewStep);
  const links = researchLinks(previewLead.companyName, previewLead.city);

  function run(
    action: () => Promise<{
      error?: string;
      ok?: boolean;
      imported?: number;
      skipped?: number;
      sent?: number;
    }>
  ) {
    startTransition(async () => {
      const result = await action();
      if (result.error) {
        setMessage(result.error);
        return;
      }
      if (typeof result.imported === "number") {
        setMessage(
          `Imported ${result.imported} leads${result.skipped ? `, skipped ${result.skipped}` : ""}.`
        );
        return;
      }
      if (typeof result.sent === "number") {
        setMessage(
          `Sent ${result.sent} due follow-up${result.sent === 1 ? "" : "s"}. ${
            result.skipped ? `${result.skipped} still waiting.` : ""
          }`.trim()
        );
        return;
      }
      setMessage("Saved.");
    });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4 sm:mb-8">
        <div>
          <p className="text-sm font-medium text-teal-700">FromMexico sales desk</p>
          <h1 className="font-serif text-3xl text-stone-900">Buyer outreach</h1>
          <p className="mt-2 max-w-2xl text-sm text-stone-600">
            Paste a work email and the country. English is the default template. Mexico and Spain
            send in Spanish; Poland sends in Polish. Follow-ups go out on weekdays. Replies land
            in Gmail on your phone.
          </p>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="min-h-11 rounded-full border border-stone-300 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50"
          >
            Sign out
          </button>
        </form>
      </header>

      {!persistent ? (
        <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          Follow-ups will not remember this list on Vercel until{" "}
          <code className="rounded bg-amber-100 px-1">UPSTASH_REDIS_REST_URL</code> and{" "}
          <code className="rounded bg-amber-100 px-1">UPSTASH_REDIS_REST_TOKEN</code> are set.
          Local development still uses a file on disk.
        </p>
      ) : null}

      <p className="mb-6 rounded-lg border border-teal-100 bg-teal-50 px-4 py-3 text-sm text-teal-950">
        Replies go to <strong>{replyTo}</strong>. Turn on Gmail notifications on your phone. When
        someone writes back, open this desk and tap <strong>Mark replied</strong> so follow-ups
        stop.
      </p>

      {message ? (
        <p className="mb-6 rounded-lg border border-teal-100 bg-teal-50 px-4 py-3 text-sm text-teal-900">
          {message}
        </p>
      ) : null}

      <section className="mb-8 grid grid-cols-3 gap-3 sm:gap-4">
        <Stat label="On the list" value={String(leads.length)} />
        <Stat label="Sent today" value={`${sentToday} / ${DAILY_SEND_CAP}`} />
        <Stat label="Left today" value={String(remaining)} />
      </section>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-8">
          <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-semibold text-stone-900">Send to a buyer</h2>
            <p className="mt-1 text-sm text-stone-600">
              You do not need to research the company here. Email + country is enough. We pick the
              language: Spanish for Mexico (and Spain), Polish for Poland, English for everyone else.
            </p>
            <form
              className="mt-4 grid gap-3 sm:grid-cols-2"
              action={(formData) => run(() => addLeadAction(formData))}
            >
              <Field
                label="Work email"
                name="email"
                type="email"
                required
                placeholder="compras@empresa.mx"
                autoComplete="email"
              />
              <label className="text-sm font-medium text-stone-700">
                Country
                <select name="country" className={`${inputClass} mt-1`} defaultValue="Mexico" required>
                  {COUNTRY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <Field label="Company (optional)" name="companyName" placeholder="From the email domain if empty" />
              <Field label="City (optional)" name="city" placeholder="Optional" />
              <input type="hidden" name="startNow" value="on" />
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={pending}
                  className="min-h-12 w-full rounded-full bg-teal-700 px-5 py-3 text-sm font-medium text-white hover:bg-teal-800 disabled:opacity-50 sm:w-auto"
                >
                  {pending ? "Sending..." : "Send email 1 now"}
                </button>
              </div>
            </form>
          </section>

          <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-stone-900">Sequence queue</h2>
              <div className="flex w-full flex-wrap gap-2 sm:w-auto">
                <select
                  value={filter}
                  onChange={(event) => setFilter(event.target.value)}
                  className={inputClass}
                >
                  <option value="all">All statuses</option>
                  {["new", "active", "paused", "replied", "completed", "opted_out", "bounced"].map(
                    (status) => (
                      <option key={status} value={status}>
                        {status.replace("_", " ")}
                      </option>
                    )
                  )}
                </select>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => run(() => processDueAction())}
                  className="min-h-11 flex-1 rounded-full bg-stone-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 sm:flex-none"
                >
                  Send due follow-ups
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-2 lg:hidden">
              {visible.length === 0 ? (
                <p className="py-8 text-center text-stone-500">
                  No buyers yet. Add one above or import a CSV.
                </p>
              ) : (
                visible.map((lead) => (
                  <button
                    key={lead.id}
                    type="button"
                    onClick={() => setSelectedId(lead.id)}
                    className={`w-full rounded-xl border px-4 py-3 text-left ${
                      selected?.id === lead.id
                        ? "border-teal-300 bg-teal-50"
                        : "border-stone-200 bg-white"
                    }`}
                  >
                    <p className="font-medium text-stone-900">{lead.companyName}</p>
                    <p className="truncate text-sm text-stone-600">{lead.email}</p>
                    <p className="mt-1 text-xs text-stone-500">
                      {lead.status.replace("_", " ")} ·{" "}
                      {SEQUENCE_STEP_LABELS[lead.sequenceStep] ?? lead.sequenceStep}
                      {lead.nextSendAt
                        ? ` · next ${new Date(lead.nextSendAt).toLocaleDateString("pl-PL")}`
                        : ""}
                    </p>
                  </button>
                ))
              )}
            </div>

            <div className="mt-4 hidden overflow-x-auto lg:block">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-stone-200 text-stone-500">
                  <tr>
                    <th className="py-2 pr-3 font-medium">Company</th>
                    <th className="py-2 pr-3 font-medium">Email</th>
                    <th className="py-2 pr-3 font-medium">Status</th>
                    <th className="py-2 pr-3 font-medium">Step</th>
                    <th className="py-2 font-medium">Next</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-stone-500">
                        No buyers yet. Add one above or import a CSV.
                      </td>
                    </tr>
                  ) : (
                    visible.map((lead) => (
                      <tr
                        key={lead.id}
                        className={`cursor-pointer border-b border-stone-100 ${
                          selected?.id === lead.id ? "bg-teal-50" : "hover:bg-stone-50"
                        }`}
                        onClick={() => setSelectedId(lead.id)}
                      >
                        <td className="py-3 pr-3 font-medium text-stone-900">{lead.companyName}</td>
                        <td className="py-3 pr-3 text-stone-600">{lead.email}</td>
                        <td className="py-3 pr-3 capitalize text-stone-600">
                          {lead.status.replace("_", " ")}
                        </td>
                        <td className="py-3 pr-3 text-stone-600">
                          {SEQUENCE_STEP_LABELS[lead.sequenceStep] ?? lead.sequenceStep}
                        </td>
                        <td className="py-3 text-stone-600">
                          {lead.nextSendAt
                            ? new Date(lead.nextSendAt).toLocaleDateString("pl-PL")
                            : "—"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {selected ? (
            <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-semibold text-stone-900">{selected.companyName}</h2>
              <p className="text-sm text-stone-600">
                {selected.contactName ? `${selected.contactName} · ` : ""}
                {selected.email}
                {selected.country ? ` · ${selected.country}` : ""}
                {selected.city ? ` · ${selected.city}` : ""}
              </p>
              <div className="mt-4 grid grid-cols-1 gap-2 sm:flex sm:flex-wrap">
                {selected.status === "new" || selected.status === "paused" ? (
                  <DeskButton
                    disabled={pending}
                    onClick={() => run(() => enrollLeadAction(selected.id))}
                    primary
                  >
                    Start sequence (send email 1)
                  </DeskButton>
                ) : null}
                {selected.status === "active" && selected.sequenceStep < 3 ? (
                  <DeskButton
                    disabled={pending}
                    onClick={() => run(() => sendNowAction(selected.id))}
                  >
                    Send next email now
                  </DeskButton>
                ) : null}
                <DeskButton
                  disabled={pending}
                  onClick={() => run(() => markStatusAction(selected.id, "replied"))}
                  highlight
                >
                  Mark replied — stop follow-ups
                </DeskButton>
                <DeskButton
                  disabled={pending}
                  onClick={() => run(() => markStatusAction(selected.id, "paused" as LeadStatus))}
                >
                  Pause
                </DeskButton>
                <DeskButton
                  disabled={pending}
                  onClick={() => run(() => deleteLeadAction(selected.id))}
                >
                  Remove
                </DeskButton>
              </div>
              {selected.notes ? (
                <p className="mt-4 rounded-lg bg-stone-50 p-3 text-sm text-stone-700">{selected.notes}</p>
              ) : null}
              <div className="mt-4">
                <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
                  Research this company (opens Google — you copy the email yourself)
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-stone-200 px-3 py-2 text-sm text-teal-800 hover:bg-teal-50"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </section>
          ) : null}
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-stone-900">Email preview</h2>
            <div className="mt-3 flex gap-2">
              {[1, 2, 3].map((step) => (
                <button
                  key={step}
                  type="button"
                  onClick={() => setPreviewStep(step)}
                  className={`min-h-9 rounded-full px-3 py-1 text-xs font-medium ${
                    previewStep === step
                      ? "bg-teal-700 text-white"
                      : "bg-stone-100 text-stone-700"
                  }`}
                >
                  Email {step}
                </button>
              ))}
            </div>
            <p className="mt-4 text-xs font-medium uppercase tracking-wide text-stone-500">
              Subject
            </p>
            <p className="text-sm font-medium text-stone-900">{preview.subject}</p>
            <div className="mt-3 space-y-3 text-sm leading-6 text-stone-700">
              {preview.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <p>{closingLine(previewLead.language)}</p>
              <p>
                {sender.name}
                <br />
                {sender.company}
                <br />
                {sender.phone}
              </p>
              <div className="border-t border-stone-200 pt-4 text-center">
                <p className="font-semibold text-stone-900">{copy.brand.displayName}</p>
                <p className="text-xs text-stone-500">{copy.brand.tagline}</p>
                <p className="text-xs text-teal-800">{sender.website.replace(/^https:\/\//, "")}</p>
                <p className="text-xs text-stone-500">
                  {sender.email} · {sender.phone}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-stone-900">Import CSV</h2>
            <p className="mt-1 text-sm text-stone-600">
              Columns: email, country. Optional: company, contact, city, website, products, language, notes
            </p>
            <form className="mt-3 space-y-3" action={(formData) => run(() => importCsvAction(formData))}>
              <input name="file" type="file" accept=".csv,text/csv" className="text-sm" required />
              <button
                type="submit"
                disabled={pending}
                className="min-h-11 rounded-full border border-stone-300 px-4 py-2 text-sm text-stone-800 disabled:opacity-50"
              >
                Import
              </button>
            </form>
            <a
              href="/leads.example.csv"
              className="mt-3 inline-block min-h-11 py-2 text-sm text-teal-800 underline"
            >
              Download example CSV
            </a>
          </section>

          <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-stone-900">When someone replies</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-4 text-sm text-stone-600">
              <li>Gmail on your phone notifies you (reply-to is {replyTo}).</li>
              <li>Open this desk and tap Mark replied so email 2 and 3 do not go out.</li>
              <li>Answer from Gmail as usual.</li>
            </ol>
          </section>

          <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-stone-900">Why the old mail got silence</h2>
            <ul className="mt-3 list-disc space-y-2 pl-4 text-sm text-stone-600">
              <li>Gmail from a personal address looks like a solo pitch, not a shipper.</li>
              <li>Writing to BIURO with “I noticed you sell mango” is the same letter every importer sends.</li>
              <li>There was no spec, port, transit time or question a buyer can answer in one line.</li>
              <li>No follow-up cadence, so one ignored message was the whole campaign.</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-stone-900">How to find buyers</h2>
            <ul className="mt-3 space-y-3">
              {researchPlaybook.map((item) => (
                <li key={item.title}>
                  <p className="text-sm font-medium text-stone-900">{item.title}</p>
                  <p className="text-sm text-stone-600">{item.body}</p>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-3 shadow-sm sm:p-5">
      <p className="text-xs text-stone-500 sm:text-sm">{label}</p>
      <p className="mt-1 font-serif text-xl text-stone-900 sm:text-3xl">{value}</p>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  autoComplete,
  inputMode,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: "text" | "email" | "url" | "search" | "tel" | "none" | "numeric" | "decimal";
}) {
  return (
    <label className="text-sm font-medium text-stone-700">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        className={`${inputClass} mt-1`}
      />
    </label>
  );
}

function DeskButton({
  children,
  onClick,
  disabled,
  primary,
  highlight,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  primary?: boolean;
  highlight?: boolean;
}) {
  const tone = primary
    ? "bg-teal-700 text-white hover:bg-teal-800 border-teal-700"
    : highlight
      ? "border-teal-300 bg-teal-50 text-teal-950 hover:bg-teal-100"
      : "border-stone-300 text-stone-800 hover:bg-stone-50";
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`min-h-11 rounded-full border px-4 py-2 text-sm disabled:opacity-50 ${tone}`}
    >
      {children}
    </button>
  );
}
