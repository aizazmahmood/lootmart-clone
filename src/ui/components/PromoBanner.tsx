export default function PromoBanner() {
  return (
    <section className="rounded-3xl border border-[#efe6da] bg-[#fff8e6] px-6 py-6 shadow-[0_12px_30px_rgba(17,24,39,0.08)] md:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#c58a12]">
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <path d="M4 11h16" />
              <path d="M5 7h14l-1 10H6L5 7z" />
              <path d="M9 11v-3a3 3 0 0 1 6 0v3" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#0f1b2d]">
              Get Free Delivery on Your Orders
            </h3>
            <p className="mt-1 text-sm text-[#5b6474]">
              Sign up to unlock exclusive perks and faster checkout.
            </p>
          </div>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full bg-[#f4c44f] px-5 py-3 text-sm font-semibold text-[#1b2a3b] shadow-sm transition hover:bg-[#f0b93c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1b2a3b] focus-visible:ring-offset-2"
        >
          Sign up with Google
        </button>
      </div>
    </section>
  );
}
