"use client";

import { useState } from "react";
import { loginAction } from "@/app/actions/outreach";

export default function LoginForm() {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  return (
    <form
      className="mt-6 space-y-3"
      onSubmit={async (event) => {
        event.preventDefault();
        setPending(true);
        setError("");
        const formData = new FormData(event.currentTarget);
        const result = await loginAction(formData);
        if (result?.error) {
          setError(result.error);
          setPending(false);
        }
      }}
    >
      <label className="block text-sm font-medium text-stone-700">
        Password
        <input
          name="password"
          type="password"
          required
          className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-teal-600 sm:py-2 sm:text-sm"
        />
      </label>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full min-h-12 rounded-full bg-teal-700 px-4 py-3 text-sm font-medium text-white hover:bg-teal-800 disabled:opacity-50"
      >
        {pending ? "Checking..." : "Open desk"}
      </button>
    </form>
  );
}
