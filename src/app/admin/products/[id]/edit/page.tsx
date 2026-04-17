"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAdmin } from "../../../layout";
import ProductForm from "../../form";
import { Product } from "@/types";

export default function EditProductPage() {
  const { token } = useAdmin();
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/admin/products/${params.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data.product);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.id, token]);

  if (loading) {
    return <div className="text-center py-12 text-on-surface-variant">Loading product...</div>;
  }

  if (error || !product) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error || "Product not found"}</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-headline text-primary mb-6">Edit: {product.title}</h1>
      <ProductForm product={product} />
    </div>
  );
}
