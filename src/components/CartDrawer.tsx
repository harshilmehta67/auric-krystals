"use client";

import { useCart } from "./CartProvider";
import Image from "next/image";
import Link from "next/link";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCart();

  return (
    <div
      className={`fixed inset-0 z-[70] ${open ? "" : "hidden"}`}
      aria-hidden={!open}
    >
      <div
        className="absolute inset-0 bg-black/45 ak-nav-blur"
        onClick={onClose}
      />
      <div className="ak-site-header__drawer absolute right-0 top-0 h-full w-[min(100%,24rem)] shadow-2xl flex flex-col border-l border-outline-variant/25">
        <div className="flex justify-between items-center p-6 border-b border-outline-variant/20">
          <h2 className="font-headline text-primary text-lg">
            Your Cart ({totalItems})
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
            aria-label="Close cart"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <span className="material-symbols-outlined text-5xl text-outline-variant mb-4 block">
                shopping_bag
              </span>
              <p className="text-on-surface-variant">Your cart is empty</p>
              <Link
                href="/shop"
                onClick={onClose}
                className="inline-block mt-4 text-primary font-semibold hover:text-secondary transition-colors"
              >
                Browse crystals
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.slug}
                className="flex gap-4 bg-surface-container-lowest rounded-xl p-3 ring-1 ring-black/5"
              >
                <Image
                  src={item.img}
                  alt={item.title}
                  width={72}
                  height={72}
                  className="w-18 h-18 rounded-lg object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-headline text-sm text-primary truncate">
                    {item.title}
                  </h3>
                  <p className="text-secondary font-bold text-sm">{"\u20B9"}{item.price.toFixed(2)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                      className="w-7 h-7 rounded-full border border-outline-variant/40 flex items-center justify-center text-xs hover:bg-surface-container transition-colors"
                    >
                      -
                    </button>
                    <span className="text-sm font-medium w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                      className="w-7 h-7 rounded-full border border-outline-variant/40 flex items-center justify-center text-xs hover:bg-surface-container transition-colors"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeItem(item.slug)}
                      className="ml-auto text-on-surface-variant hover:text-red-500 transition-colors"
                      aria-label="Remove"
                    >
                      <span className="material-symbols-outlined text-lg">
                        delete
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-outline-variant/20 space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-headline text-primary">Total</span>
              <span className="text-xl font-bold text-primary">
                {"\u20B9"}{totalPrice.toFixed(2)}
              </span>
            </div>
            <Link
              href="/checkout"
              onClick={onClose}
              className="block w-full py-3.5 ak-btn-primary bg-primary text-on-primary rounded-xl font-bold text-center"
            >
              Proceed to Checkout
            </Link>
            <Link
              href="/cart"
              onClick={onClose}
              className="block w-full py-3 border-2 border-primary text-primary rounded-xl font-bold text-center hover:bg-primary-fixed/40 transition-colors"
            >
              View Full Cart
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
