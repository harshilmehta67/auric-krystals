"use client";

import { Product } from "@/types";
import { useCart } from "./CartProvider";
import { useState } from "react";

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      className="flex-1 ak-btn-primary inline-flex justify-center items-center gap-2 px-8 py-4 bg-primary text-on-primary rounded-full font-bold text-center"
    >
      <span className="material-symbols-outlined text-xl">
        {added ? "check" : "add_shopping_cart"}
      </span>
      {added ? "Added to Cart!" : "Add to Cart"}
    </button>
  );
}
