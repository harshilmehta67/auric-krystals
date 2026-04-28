import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/admin-auth";

interface RouteContext {
  params: Promise<{ key: string }>;
}

const VALID_KEYS = new Set(["A", "B", "C", "D"]);

export async function GET(_req: NextRequest, context: RouteContext) {
  const { key } = await context.params;
  const upper = (key || "").toUpperCase();
  if (!VALID_KEYS.has(upper)) {
    return NextResponse.json({ products: [] }, { status: 400 });
  }

  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("quiz_result_products")
    .select("sort_order, product:products(*, categories(name, slug))")
    .eq("result_key", upper)
    .order("sort_order", { ascending: true });

  if (error || !data) {
    return NextResponse.json({ products: [] });
  }

  const products = (data as Array<{ product: Record<string, unknown> | Record<string, unknown>[] | null }>)
    .map((row) => (Array.isArray(row.product) ? row.product[0] ?? null : row.product))
    .filter((p): p is Record<string, unknown> => !!p && p.is_active === true)
    .map((p) => ({
      ...p,
      category_name: (p.categories as { name: string } | null)?.name || null,
      categories: undefined,
    }));

  return NextResponse.json({ products });
}
