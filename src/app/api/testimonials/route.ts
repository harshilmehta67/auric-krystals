import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/admin-auth";

export const revalidate = 60;

export async function GET() {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_featured", true)
    .order("sort_order", { ascending: true });

  if (error) {
    return NextResponse.json({ testimonials: [] });
  }

  return NextResponse.json({ testimonials: data || [] });
}
