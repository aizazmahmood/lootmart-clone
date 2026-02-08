"use client";

import { Button } from "@/src/ui/primitives/Button";
import { Card } from "@/src/ui/primitives/Card";
import { Input } from "@/src/ui/primitives/Input";

type CheckoutFormProps = {
  phone: string;
  name: string;
  paymentMethod: "cod" | "card";
  onPhoneChange: (value: string) => void;
  onNameChange: (value: string) => void;
  onPaymentMethodChange: (value: "cod" | "card") => void;
};

export default function CheckoutForm({
  phone,
  name,
  paymentMethod,
  onPhoneChange,
  onNameChange,
  onPaymentMethodChange,
}: CheckoutFormProps) {
  return (
    <Card className="flex flex-col gap-6 p-6">
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-[#0f1b2d]">
          Personal Information
        </h2>
        <label className="flex flex-col gap-2 text-sm font-medium text-[#4b5563]">
          Phone <span className="text-[#b42318]">*</span>
          <Input
            type="tel"
            value={phone}
            onChange={(event) => onPhoneChange(event.target.value)}
            placeholder="03XX XXX XXXX"
            required
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-[#4b5563]">
          Name (optional)
          <Input
            type="text"
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
            placeholder="Your name"
          />
        </label>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-[#0f1b2d]">
          Delivery Address
        </h2>
        <Button
          type="button"
          variant="secondary"
          size="md"
          className="h-28 w-full flex-col gap-2 rounded-2xl border-2 border-dashed border-[#e6dccf] bg-[#fbf8f3] text-[#7b8794] hover:border-[#f4c44f] hover:text-[#1b2a3b]"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#efe6da] bg-white text-xl text-[#a2771d]">
            +
          </span>
          Add Address
        </Button>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-[#0f1b2d]">
          Payment Method
        </h2>
        <label className="flex items-center gap-3 rounded-2xl border border-[#efe6da] bg-[#fbf8f3] p-4 text-sm font-medium text-[#1f2a44]">
          <input
            type="radio"
            name="payment"
            value="cod"
            checked={paymentMethod === "cod"}
            onChange={() => onPaymentMethodChange("cod")}
            className="h-4 w-4 text-[#f4c44f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4c44f]"
          />
          Cash on Delivery
        </label>
        <label className="flex items-center gap-3 rounded-2xl border border-[#efe6da] bg-[#f5f1eb] p-4 text-sm font-medium text-[#9aa3b2]">
          <input
            type="radio"
            name="payment"
            value="card"
            disabled
            className="h-4 w-4 text-[#f4c44f]"
          />
          Card (coming soon)
        </label>
      </section>
    </Card>
  );
}
