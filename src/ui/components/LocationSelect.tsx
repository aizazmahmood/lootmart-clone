"use client";

import { useEffect, useId, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LOCATIONS } from "@/src/config/delivery";

type LocationSelectProps = {
  value: string;
};

export default function LocationSelect({ value }: LocationSelectProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const listboxId = useId();
  const labelId = useId();

  const handleChange = (nextValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (nextValue) params.set("loc", nextValue);
    else params.delete("loc");

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  useEffect(() => {
    if (!open) return;

    const handleOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (buttonRef.current?.contains(target)) return;
      if (panelRef.current?.contains(target)) return;
      setOpen(false);
    };

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);
    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <div className="relative">
      <span id={labelId} className="sr-only">
        Delivery location
      </span>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-labelledby={labelId}
        className="inline-flex items-center gap-2 rounded-full border border-[#e6dccf] bg-white px-3 py-2 text-sm font-medium text-[#1f2a44] shadow-[0_6px_16px_rgba(17,24,39,0.08)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4c44f]"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f4c44f]/20 text-[#b57512]">
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          >
            <path d="M12 3a6 6 0 0 0-6 6c0 4.5 6 12 6 12s6-7.5 6-12a6 6 0 0 0-6-6z" />
            <circle cx="12" cy="9" r="2.2" />
          </svg>
        </span>
        <span className="whitespace-nowrap">{value}</span>
        <span className="flex h-4 w-4 items-center justify-center text-[#7b8794]">
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
            <path d="M5.3 7.5a1 1 0 0 1 1.4 0L10 10.8l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4z" />
          </svg>
        </span>
      </button>

      {open ? (
        <div
          ref={panelRef}
          className="absolute left-0 top-full z-20 mt-2 min-w-[220px] rounded-2xl border border-[#efe6da] bg-white p-2 shadow-[0_18px_30px_rgba(17,24,39,0.12)]"
        >
          <div id={listboxId} role="listbox" aria-label="Select delivery location">
            {LOCATIONS.map((location) => {
              const isActive = location === value;
              return (
                <button
                  key={location}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onClick={() => {
                    handleChange(location);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4c44f] ${
                    isActive
                      ? "bg-[#fef3d2] text-[#1b2a3b]"
                      : "text-[#4b5563] hover:bg-[#f7f1e7]"
                  }`}
                >
                  <span>{location}</span>
                  {isActive ? (
                    <span className="text-[#a2771d]">●</span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
