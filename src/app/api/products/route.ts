import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  try {
    const supabase = getServiceClient();
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get("category");
    const slug = searchParams.get("slug");

    let query = supabase
      .from("products")
      .select("*, categories(name, slug)")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (slug) {
      query = query.eq("slug", slug).limit(1);
      const { data, error } = await query;

      if (error || !data?.length) {
        return NextResponse.json({ product: null });
      }

      const p = data[0] as Record<string, unknown>;
      return NextResponse.json({
        product: {
          ...p,
          category_name: (p.categories as { name: string } | null)?.name || null,
          categories: undefined,
        },
      });
    }

    if (categorySlug) {
      const { data: cat } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", categorySlug)
        .single();

      if (cat) {
        query = query.eq("category_id", cat.id);
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error("Products fetch error:", error);
      return NextResponse.json({ products: [], categories: [] });
    }

    const products = (data || []).map((p: Record<string, unknown>) => ({
      ...p,
      category_name: (p.categories as { name: string } | null)?.name || null,
      categories: undefined,
    }));

    const { data: cats } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });

    return NextResponse.json({
      products,
      categories: cats || [],
    });
  } catch {
    return NextResponse.json({ products: [], categories: [] });
  }
}
