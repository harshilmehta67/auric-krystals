import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/admin-auth";

export const revalidate = 60;

export async function GET() {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("trust_bar_items")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    return NextResponse.json({ items: [] });
  }

  return NextResponse.json({ items: data || [] });
}
