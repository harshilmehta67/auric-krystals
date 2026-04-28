import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Placed — Auric Krystals",
};

const steps = [
  {
    icon: "fact_check",
    title: "We verify your payment",
    body:
      "Krupali manually checks every screenshot within 12 hours, usually faster. You'll get an email the moment it's approved.",
  },
  {
    icon: "auto_awesome",
    title: "Your stones are cleansed & packed",
    body:
      "Each piece is smudged with sage and rested in moonlight before being wrapped — never machine-handled.",
  },
  {
    icon: "local_shipping",
    title: "Tracking lands in your inbox",
    body:
      "Once shipped, you'll receive the courier tracking link by email and WhatsApp. Most orders arrive within 3–5 days across India.",
  },
];

export default function CheckoutSuccessPage() {
  return (
    <div className="pt-32 sm:pt-36 pb-16 sm:pb-24 px-4 sm:px-8 max-w-3xl mx-auto min-h-screen">
      <div className="text-center mt-8 sm:mt-12">
        <span className="material-symbols-outlined text-7xl text-green-500 mb-4 block">
          check_circle
        </span>
        <h1 className="text-3xl sm:text-4xl font-headline font-semibold text-primary mb-3">
          Order placed — thank you
        </h1>
        <p className="text-on-surface-variant text-base sm:text-lg max-w-xl mx-auto">
          Your payment screenshot is in. Here&apos;s exactly what happens next so
          there&apos;s no guessing.
        </p>
      </div>

      <ol
        role="list"
        className="mt-12 sm:mt-16 space-y-4 sm:space-y-5"
      >
        {steps.map((step, idx) => (
          <li
            key={step.title}
            className="relative flex gap-4 sm:gap-6 rounded-2xl bg-surface-container-lowest ring-1 ring-black/5 p-5 sm:p-6"
          >
            <div className="shrink-0">
              <div className="w-12 h-12 rounded-full bg-primary-fixed/40 text-primary flex items-center justify-center ring-1 ring-primary/15">
                <span className="material-symbols-outlined text-2xl" aria-hidden="true">
                  {step.icon}
                </span>
              </div>
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant text-center mt-1.5 font-bold">
                Step {idx + 1}
              </p>
            </div>
            <div className="min-w-0">
              <h3 className="font-headline text-lg text-primary leading-tight">
                {step.title}
              </h3>
              <p className="text-sm text-on-surface-variant mt-1.5 leading-relaxed">
                {step.body}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-10 rounded-2xl bg-primary-fixed/30 ring-1 ring-primary/10 p-5 sm:p-6 text-sm text-on-surface-variant flex items-start gap-3">
        <span className="material-symbols-outlined text-xl text-primary shrink-0">
          support_agent
        </span>
        <p>
          Anything looks off? Reply to your confirmation email or message us on
          WhatsApp — Krupali responds personally within a day.
        </p>
      </div>

      <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/shop"
          className="inline-flex justify-center ak-btn-primary px-8 py-4 bg-primary text-on-primary rounded-full font-bold"
        >
          Continue Shopping
        </Link>
        <Link
          href="/"
          className="inline-flex justify-center px-8 py-4 border-2 border-primary text-primary rounded-full font-bold hover:bg-primary-fixed/40 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
