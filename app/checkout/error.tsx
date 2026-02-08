"use client";

import Link from "next/link";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function CheckoutError({ error, reset }: ErrorProps) {
  return (
    <div className="min-h-screen bg-[#f8f5f0] px-4 py-16 font-sans text-[#0f1b2d] sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-6 rounded-3xl border border-[#efe6da] bg-white p-8 text-center shadow-[0_18px_40px_rgba(17,24,39,0.08)]">
        <div>
          <h1 className="text-2xl font-semibold">Checkout error</h1>
          <p className="mt-3 text-sm text-[#6b7280]">
            We couldn’t load the checkout experience. Please retry.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center rounded-full bg-[#f4c44f] px-5 py-3 text-sm font-semibold text-[#1b2a3b] shadow-sm transition hover:bg-[#f0b93c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1b2a3b] focus-visible:ring-offset-2"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-[#efe6da] bg-white px-5 py-3 text-sm font-semibold text-[#1f2a44] shadow-sm transition hover:bg-[#f7f1e7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4c44f]"
          >
            Back to home
          </Link>
        </div>
        {error?.digest ? (
          <p className="text-xs text-[#9aa3b2]">Error ID: {error.digest}</p>
        ) : null}
      </div>
    </div>
  );
}
