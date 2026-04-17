"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCart();

  return (
    <div className="pt-28 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-8 max-w-4xl mx-auto min-h-screen">
      <header className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-headline font-semibold text-primary mb-2">Your Cart</h1>
        <p className="text-on-surface-variant">
          {totalItems === 0 ? "Your cart is empty" : `${totalItems} item${totalItems > 1 ? "s" : ""} in your cart`}
        </p>
      </header>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <span className="material-symbols-outlined text-6xl text-outline-variant mb-6 block">shopping_bag</span>
          <p className="text-on-surface-variant text-lg mb-6">Nothing here yet</p>
          <Link href="/shop" className="inline-flex ak-btn-primary px-8 py-4 bg-primary text-on-primary rounded-full font-bold">
            Browse Crystals
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-8">
            {items.map((item) => (
              <div key={item.slug} className="flex gap-4 sm:gap-6 bg-surface-container-lowest rounded-2xl p-4 sm:p-6 ring-1 ring-black/5 ak-card">
                <Image src={item.img} alt={item.title} width={120} height={120} className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <Link href={`/product/${item.slug}`} className="font-headline text-lg text-primary hover:text-secondary transition-colors">{item.title}</Link>
                  <p className="text-secondary font-bold text-lg mt-1">{"\u20B9"}{item.price.toFixed(2)}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <button onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                      className="w-8 h-8 rounded-full border border-outline-variant/40 flex items-center justify-center hover:bg-surface-container transition-colors font-bold">−</button>
                    <span className="font-medium w-8 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                      className="w-8 h-8 rounded-full border border-outline-variant/40 flex items-center justify-center hover:bg-surface-container transition-colors font-bold">+</button>
                    <span className="text-sm text-on-surface-variant ml-2">= {"\u20B9"}{(item.price * item.quantity).toFixed(2)}</span>
                    <button onClick={() => removeItem(item.slug)} className="ml-auto text-on-surface-variant hover:text-red-500 transition-colors" aria-label="Remove item">
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-surface-container-lowest rounded-2xl p-6 sm:p-8 ring-1 ring-black/5 space-y-4">
            <div className="flex justify-between items-center text-lg">
              <span className="font-headline text-primary">Subtotal</span>
              <span className="font-bold text-primary">{"\u20B9"}{totalPrice.toFixed(2)}</span>
            </div>
            <p className="text-sm text-on-surface-variant">Shipping calculated at checkout</p>
            <Link href="/checkout" className="block w-full py-4 ak-btn-primary bg-primary text-on-primary rounded-xl font-bold text-center text-lg">
              Proceed to Checkout
            </Link>
            <Link href="/shop" className="block w-full py-3 border-2 border-primary text-primary rounded-xl font-bold text-center hover:bg-primary-fixed/40 transition-colors">
              Continue Shopping
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
