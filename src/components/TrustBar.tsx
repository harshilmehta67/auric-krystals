"use client";

import { useEffect, useState } from "react";
import { TrustBarItem } from "@/types";

const FALLBACK: TrustBarItem[] = [
  {
    id: "f1",
    icon_name: "diamond",
    title: "Hand-selected pieces",
    subtitle: "Every stone personally chosen by Krupali",
    sort_order: 0,
    is_active: true,
    updated_at: "",
  },
  {
    id: "f2",
    icon_name: "water_drop",
    title: "Energy-cleansed before shipping",
    subtitle: "Smudged & moonlight-rested before they leave",
    sort_order: 1,
    is_active: true,
    updated_at: "",
  },
  {
    id: "f3",
    icon_name: "verified",
    title: "Manual order verification",
    subtitle: "Each order reviewed within 12 hours",
    sort_order: 2,
    is_active: true,
    updated_at: "",
  },
];

export default function TrustBar() {
  const [items, setItems] = useState<TrustBarItem[]>(FALLBACK);

  useEffect(() => {
    fetch("/api/trust-bar")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.items?.length) setItems(d.items);
      })
      .catch(() => {});
  }, []);

  return (
    <ul
      role="list"
      className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-3xl"
      aria-label="Why shop with us"
    >
      {items.map((it) => (
        <li
          key={it.id}
          className="flex items-start gap-3 px-4 py-3 rounded-2xl bg-surface-container-lowest/70 ring-1 ring-black/5 backdrop-blur-sm"
        >
          <span
            aria-hidden="true"
            className="material-symbols-outlined text-2xl text-primary shrink-0"
          >
            {it.icon_name}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-on-surface leading-tight">
              {it.title}
            </p>
            {it.subtitle && (
              <p className="text-xs text-on-surface-variant mt-0.5 leading-snug">
                {it.subtitle}
              </p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
