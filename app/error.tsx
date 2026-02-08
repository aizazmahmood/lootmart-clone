"use client";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: ErrorProps) {
  return (
    <div className="min-h-screen bg-[#f8f5f0] px-4 py-16 font-sans text-[#0f1b2d] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl rounded-3xl border border-[#efe6da] bg-white p-8 text-center shadow-[0_18px_40px_rgba(17,24,39,0.08)]">
        <h1 className="text-2xl font-semibold">Something went wrong</h1>
        <p className="mt-3 text-sm text-[#6b7280]">
          We hit an unexpected error. Please try again.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 inline-flex items-center justify-center rounded-full bg-[#f4c44f] px-5 py-3 text-sm font-semibold text-[#1b2a3b] shadow-sm transition hover:bg-[#f0b93c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1b2a3b] focus-visible:ring-offset-2"
        >
          Try again
        </button>
        {error?.digest ? (
          <p className="mt-4 text-xs text-[#9aa3b2]">Error ID: {error.digest}</p>
        ) : null}
      </div>
    </div>
  );
}
