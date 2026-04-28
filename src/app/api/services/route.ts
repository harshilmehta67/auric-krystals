import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/admin-auth";
import { SERVICES_DEFAULTS } from "@/lib/services-defaults";

export const revalidate = 60;

export async function GET() {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("services_settings")
    .select("*")
    .eq("id", 1)
    .single();

  if (error || !data) {
    return NextResponse.json({ services: SERVICES_DEFAULTS });
  }

  return NextResponse.json({ services: data });
}
