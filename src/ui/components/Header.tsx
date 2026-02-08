import Link from "next/link";
import LocationSelect from "@/src/ui/components/LocationSelect";
import CartButton from "@/src/ui/cart/CartButton";
import { Button } from "@/src/ui/primitives/Button";

type HeaderProps = {
  location: string;
};

export default function Header({ location }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-[#ece4d9] bg-[#f8f5f0]/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-[#0f1b2d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4c44f]"
        >
          Lootmart
        </Link>
        <div className="flex items-center gap-3">
          <LocationSelect value={location} />
          <CartButton />
          <Button variant="secondary" size="sm" aria-label="User menu">
            Guest
          </Button>
        </div>
      </div>
    </header>
  );
}
