"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export interface CartToastData {
  title: string;
  img: string;
  quantity: number;
}

interface CartToastProps {
  data: CartToastData | null;
  onClose: () => void;
  onCartOpen: () => void;
}

export default function CartToast({ data, onClose, onCartOpen }: CartToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!data) {
      setVisible(false);
      return;
    }
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, 3000);
    return () => clearTimeout(timer);
  }, [data, onClose]);

  if (!data) return null;

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] transition-all duration-300 ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-xl ring-1 ring-black/10 min-w-[280px] max-w-[360px]">
        <Image
          src={data.img}
          alt=""
          width={44}
          height={44}
          className="w-11 h-11 rounded-lg object-cover shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-on-surface truncate">
            {data.title}
          </p>
          <p className="text-xs text-green-600 font-medium" aria-live="polite">
            <span
              className="material-symbols-outlined text-xs align-middle mr-0.5"
              aria-hidden="true"
            >
              check_circle
            </span>
            Added to cart
            {data.quantity > 1 && ` (${data.quantity})`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setVisible(false);
            setTimeout(() => {
              onClose();
              onCartOpen();
            }, 150);
          }}
          className="shrink-0 px-3 py-1.5 bg-primary text-on-primary text-xs font-bold rounded-full hover:opacity-90 transition-opacity"
        >
          View
        </button>
      </div>
    </div>
  );
}
