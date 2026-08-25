import { unsubscribeAction } from "@/app/actions/outreach";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Unsubscribe",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  if (!token) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="font-serif text-3xl text-stone-900">Missing link</h1>
        <p className="mt-3 text-stone-600">This unsubscribe address needs a valid token.</p>
      </div>
    );
  }

  const result = await unsubscribeAction(token);

  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="font-serif text-3xl text-stone-900">
        {result.ok ? "You are unsubscribed" : "We could not update this contact"}
      </h1>
      <p className="mt-3 text-stone-600">
        {result.ok
          ? "FromMexico will not send further outreach to this address."
          : result.error}
      </p>
      <Link href="/" className="mt-8 inline-block text-sm text-teal-800 underline">
        Back to frommexico.com
      </Link>
    </div>
  );
}
