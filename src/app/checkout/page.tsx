"use client";

import { useState, useEffect, FormEvent, useRef, ChangeEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import QRCode from "qrcode";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [uploadConfirm, setUploadConfirm] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const upiId = process.env.NEXT_PUBLIC_UPI_ID || "astrokrupa16@oksbi";
  const payeeName = process.env.NEXT_PUBLIC_UPI_PAYEE || "Auric Krystals";
  const upiLink = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${totalPrice.toFixed(2)}&cu=INR&tn=${encodeURIComponent(`Auric Krystals Order`)}`;

  useEffect(() => {
    if (totalPrice <= 0) return;
    QRCode.toDataURL(upiLink, {
      width: 256,
      margin: 2,
      color: { dark: "#1d1b1e", light: "#ffffff" },
    }).then(setQrDataUrl).catch(() => setQrDataUrl(null));
  }, [upiLink, totalPrice]);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshot(file);
      setPreview(URL.createObjectURL(file));
      setUploadConfirm(true);
      setTimeout(() => setUploadConfirm(false), 2200);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (items.length === 0) return;

    setLoading(true);
    setError("");

    try {
      const form = new FormData(e.currentTarget);
      const orderData = new FormData();
      orderData.append("customerName", form.get("name") as string);
      orderData.append("customerEmail", form.get("email") as string);
      orderData.append("customerPhone", form.get("phone") as string);
      orderData.append("customerAddress", form.get("address") as string);
      orderData.append("orderNotes", form.get("notes") as string || "");
      orderData.append("items", JSON.stringify(items));
      orderData.append("total", totalPrice.toFixed(2));
      if (screenshot) {
        orderData.append("screenshot", screenshot);
      }

      const res = await fetch("/api/orders", {
        method: "POST",
        body: orderData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to place order");
      }

      clearCart();
      router.push("/checkout/success");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="pt-32 sm:pt-36 pb-16 sm:pb-24 px-4 sm:px-8 max-w-4xl mx-auto min-h-screen text-center">
        <span className="material-symbols-outlined text-6xl text-outline-variant mb-6 block mt-20">shopping_bag</span>
        <h1 className="text-2xl font-headline text-primary mb-4">Your cart is empty</h1>
        <Link href="/shop" className="inline-flex ak-btn-primary px-8 py-4 bg-primary text-on-primary rounded-full font-bold">
          Browse Crystals
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 sm:pt-36 pb-16 sm:pb-24 px-4 sm:px-8 max-w-6xl mx-auto min-h-screen">
      <h1 className="text-3xl sm:text-4xl font-headline font-semibold text-primary mb-8">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left: Form */}
        <div className="space-y-6">
          <div className="bg-surface-container-lowest rounded-2xl p-6 ring-1 ring-black/5 space-y-5">
            <h2 className="font-headline text-xl text-primary">Your Details</h2>
            <div>
              <label className="block text-xs font-label uppercase tracking-widest text-primary mb-2" htmlFor="name">Full Name</label>
              <input id="name" name="name" type="text" required autoComplete="name" placeholder="Your full name"
                className="w-full px-5 py-3.5 bg-surface-container-low rounded-xl border border-outline-variant/25 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all text-on-surface placeholder:text-on-surface-variant/50" />
            </div>
            <div>
              <label className="block text-xs font-label uppercase tracking-widest text-primary mb-2" htmlFor="email">Email</label>
              <input id="email" name="email" type="email" required autoComplete="email" placeholder="you@email.com"
                className="w-full px-5 py-3.5 bg-surface-container-low rounded-xl border border-outline-variant/25 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all text-on-surface placeholder:text-on-surface-variant/50" />
            </div>
            <div>
              <label className="block text-xs font-label uppercase tracking-widest text-primary mb-2" htmlFor="phone">Phone</label>
              <input id="phone" name="phone" type="tel" required autoComplete="tel" placeholder="+91 XXXXX XXXXX"
                className="w-full px-5 py-3.5 bg-surface-container-low rounded-xl border border-outline-variant/25 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all text-on-surface placeholder:text-on-surface-variant/50" />
            </div>
            <div>
              <label className="block text-xs font-label uppercase tracking-widest text-primary mb-2" htmlFor="address">Delivery Address</label>
              <textarea id="address" name="address" required rows={3} placeholder="Full delivery address"
                className="w-full px-5 py-3.5 bg-surface-container-low rounded-xl border border-outline-variant/25 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all resize-y text-on-surface placeholder:text-on-surface-variant/50" />
            </div>
            <div>
              <label className="block text-xs font-label uppercase tracking-widest text-primary mb-2" htmlFor="notes">Order Notes (optional)</label>
              <textarea id="notes" name="notes" rows={2} placeholder="Any special instructions..."
                className="w-full px-5 py-3.5 bg-surface-container-low rounded-xl border border-outline-variant/25 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all resize-y text-on-surface placeholder:text-on-surface-variant/50" />
            </div>
          </div>

          {/* Payment Section */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 ring-1 ring-black/5 space-y-5">
            <h2 className="font-headline text-xl text-primary">Payment via UPI</h2>
            <p className="text-sm text-on-surface-variant">
              Scan the QR code or tap the button below to pay{" "}
              <strong className="text-primary">{"\u20B9"}{totalPrice.toFixed(2)}</strong> via UPI.
              After payment, upload a screenshot as proof.
            </p>
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="bg-white p-4 rounded-xl shadow-sm ring-1 ring-black/5">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt={`UPI QR code for \u20B9${totalPrice.toFixed(2)}`}
                    width={192}
                    height={192}
                    className="w-48 h-48 rounded-lg"
                  />
                ) : (
                  <div className="w-48 h-48 bg-surface-container flex items-center justify-center rounded-lg text-on-surface-variant text-sm text-center p-4">
                    Generating QR...
                  </div>
                )}
              </div>
              <p className="text-xs text-on-surface-variant">
                UPI ID: <span className="font-mono font-medium text-on-surface">{upiId}</span>
              </p>
              <a
                href={upiLink}
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-full font-bold text-sm hover:bg-green-700 transition-colors"
              >
                <span className="material-symbols-outlined text-lg" aria-hidden="true">payments</span>
                Pay {"\u20B9"}{totalPrice.toFixed(2)} via UPI
              </a>
            </div>

            <div>
              <label className="block text-xs font-label uppercase tracking-widest text-primary mb-2">
                Upload Payment Screenshot
              </label>
              <div
                onClick={() => fileRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                  uploadConfirm
                    ? "border-green-500 bg-green-50"
                    : "border-outline-variant/40 hover:border-primary/40 hover:bg-primary-fixed/10"
                }`}
              >
                {preview ? (
                  <div className="space-y-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={preview} alt="Payment screenshot" className="max-h-48 mx-auto rounded-lg" />
                    <p className="text-sm text-primary font-medium">Click to change</p>
                  </div>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-3xl text-outline-variant mb-2 block">cloud_upload</span>
                    <p className="text-sm text-on-surface-variant">Click to upload screenshot</p>
                    <p className="text-xs text-on-surface-variant/60 mt-1">PNG, JPG up to 5MB</p>
                  </>
                )}
                {uploadConfirm && (
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white/80 rounded-xl ak-animate-in">
                    <div className="flex flex-col items-center gap-1">
                      <span className="material-symbols-outlined text-5xl text-green-500">check_circle</span>
                      <p className="text-sm font-bold text-green-700">Screenshot received</p>
                    </div>
                  </div>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </div>

            {/* Transparency strip — what happens next */}
            <ul
              role="list"
              className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 pt-2 text-xs text-on-surface-variant"
            >
              {[
                { icon: "fact_check", text: "Verified within 12 hours" },
                { icon: "auto_awesome", text: "Cleansed before shipping" },
                { icon: "local_shipping", text: "Tracking sent by email" },
              ].map((s) => (
                <li
                  key={s.text}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-container-low/60 ring-1 ring-black/5"
                >
                  <span className="material-symbols-outlined text-lg text-primary">{s.icon}</span>
                  {s.text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div>
          <div className="bg-surface-container-lowest rounded-2xl p-6 ring-1 ring-black/5 space-y-4 lg:sticky lg:top-40 lg:max-h-[calc(100vh-12rem)] lg:overflow-y-auto">
            <h2 className="font-headline text-xl text-primary">Order Summary</h2>
            <div className="space-y-3 divide-y divide-outline-variant/20">
              {items.map((item) => (
                <div key={item.slug} className="flex gap-3 pt-3 first:pt-0">
                  <Image src={item.img} alt={item.title} width={56} height={56} className="w-14 h-14 rounded-lg object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-on-surface truncate">{item.title}</p>
                    <p className="text-xs text-on-surface-variant">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold text-secondary shrink-0">{"\u20B9"}{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-outline-variant/20">
              <div className="flex justify-between items-center text-lg">
                <span className="font-headline text-primary">Total</span>
                <span className="font-bold text-primary">{"\u20B9"}{totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading || !screenshot}
              className="w-full py-4 ak-btn-primary bg-primary text-on-primary rounded-xl font-bold text-center text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>
            {!screenshot && (
              <p className="text-xs text-center text-on-surface-variant">Please upload payment screenshot to place order</p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
