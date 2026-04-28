import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/admin-auth";

export const revalidate = 60;

export async function GET() {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("about_settings")
    .select("*")
    .eq("id", 1)
    .single();

  if (error || !data) {
    return NextResponse.json({ about: null });
  }

  return NextResponse.json({ about: data });
}
