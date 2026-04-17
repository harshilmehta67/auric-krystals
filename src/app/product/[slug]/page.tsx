import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import ProductDetailClient from "./client";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
  if (!url || !key) return null;

  const supabase = createClient(url, key);
  const { data } = await supabase
    .from("products")
    .select("*, categories(name)")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!data) return null;

  return {
    ...data,
    category_name: (data.categories as { name: string } | null)?.name || null,
    categories: undefined,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Product — Auric Krystals" };
  return {
    title: `${product.title} — Auric Krystals`,
    description: product.description,
  };
}

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  return <ProductDetailClient product={product} />;
}
