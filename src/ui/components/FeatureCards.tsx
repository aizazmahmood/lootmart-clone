import { Card } from "@/src/ui/primitives/Card";

const FEATURES = [
  {
    title: "Same-Day",
    subtitle: "Fast delivery for essentials.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Free Delivery",
    subtitle: "Unlock savings on big carts.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M3 7h11v9H3z" />
        <path d="M14 9h4l3 3v4h-7z" />
        <circle cx="7" cy="18" r="1.5" />
        <circle cx="17" cy="18" r="1.5" />
      </svg>
    ),
  },
  {
    title: "Multi-Store",
    subtitle: "Shop from curated local stores.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M4 10h16" />
        <path d="M6 10V7l2-2h8l2 2v3" />
        <path d="M6 10v8h12v-8" />
      </svg>
    ),
  },
  {
    title: "Easy Order",
    subtitle: "Simple checkout, every time.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M5 12l4 4L19 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function FeatureCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {FEATURES.map((feature) => (
        <Card
          key={feature.title}
          className="rounded-2xl p-5 shadow-[0_8px_20px_rgba(17,24,39,0.06)]"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f4c44f]/20 text-[#c58a12]">
            {feature.icon}
          </div>
          <h3 className="mt-4 text-base font-semibold text-[#0f1b2d]">
            {feature.title}
          </h3>
          <p className="mt-1 text-sm text-[#556070]">{feature.subtitle}</p>
        </Card>
      ))}
    </div>
  );
}
