import { isOutreachAuthenticated, outreachConfigured } from "@/lib/outreach/auth";
import { isPersistentStoreConfigured, listLeads } from "@/lib/outreach/store";
import { getReplyTo } from "@/lib/outreach/config";
import OutreachDesk from "@/components/outreach/OutreachDesk";
import LoginForm from "@/components/outreach/LoginForm";
import Logo from "@/components/Logo";
import copy from "@/lib/copy";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Outreach",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function OutreachPage() {
  if (!outreachConfigured()) {
    return (
      <Gate>
        <h1 className="font-serif text-3xl text-stone-900">Outreach is not configured</h1>
        <p className="mt-3 text-sm leading-6 text-stone-600">
          Set <code className="rounded bg-stone-100 px-1">OUTREACH_SECRET</code>,{" "}
          <code className="rounded bg-stone-100 px-1">RESEND_API_KEY</code>,{" "}
          <code className="rounded bg-stone-100 px-1">CONTACT_EMAIL_FROM</code> and{" "}
          <code className="rounded bg-stone-100 px-1">CONTACT_EMAIL_TO</code> on the host,
          then reload this page.
        </p>
      </Gate>
    );
  }

  if (!(await isOutreachAuthenticated())) {
    return (
      <Gate>
        <h1 className="font-serif text-3xl text-stone-900">FromMexico sales desk</h1>
        <p className="mt-2 text-sm text-stone-600">
          Add a buyer on your phone: email and country. Mexico is Spanish, Poland is Polish, everything else is English.
        </p>
        <p className="mt-2 text-xs text-stone-500">
          On iPhone: Share → Add to Home Screen. On Android: menu → Add to Home screen.
        </p>
        <LoginForm />
      </Gate>
    );
  }

  const leads = await listLeads();
  return (
    <OutreachDesk
      leads={leads}
      persistent={isPersistentStoreConfigured()}
      replyTo={getReplyTo()}
    />
  );
}

function Gate({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex items-center gap-2">
          <Logo size={32} />
          <span className="font-serif text-lg font-semibold">{copy.brand.displayName}</span>
        </div>
        {children}
      </div>
    </div>
  );
}
