import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Placed — Auric Krystals",
};

export default function CheckoutSuccessPage() {
  return (
    <div className="pt-32 sm:pt-36 pb-16 sm:pb-24 px-4 sm:px-8 max-w-2xl mx-auto min-h-screen text-center">
      <div className="mt-12 sm:mt-20">
        <span className="material-symbols-outlined text-7xl text-green-500 mb-6 block">check_circle</span>
        <h1 className="text-3xl sm:text-4xl font-headline font-semibold text-primary mb-4">Order Placed!</h1>
        <p className="text-on-surface-variant text-lg mb-2">Thank you for your order.</p>
        <p className="text-on-surface-variant mb-8">
          We&apos;ve received your payment screenshot and will verify it shortly.
          You&apos;ll receive a confirmation email once approved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/shop" className="inline-flex justify-center ak-btn-primary px-8 py-4 bg-primary text-on-primary rounded-full font-bold">
            Continue Shopping
          </Link>
          <Link href="/" className="inline-flex justify-center px-8 py-4 border-2 border-primary text-primary rounded-full font-bold hover:bg-primary-fixed/40 transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
