import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, getServiceClient } from "@/lib/admin-auth";

interface ItemPayload {
  id?: string;
  icon_name: string;
  title: string;
  subtitle: string;
  sort_order: number;
  is_active: boolean;
}

export async function GET(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("trust_bar_items")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) return NextResponse.json({ error: "Failed" }, { status: 500 });
  return NextResponse.json({ items: data || [] });
}

// Replace-all-style PUT: client sends the full ordered list. We delete missing
// rows, upsert the rest. Keeps the trust bar to ~3 items, no need for granular
// per-row endpoints.
export async function PUT(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json().catch(() => null)) as { items?: ItemPayload[] } | null;
  if (!body?.items || !Array.isArray(body.items)) {
    return NextResponse.json({ error: "items[] required" }, { status: 400 });
  }

  const supabase = getServiceClient();

  // Fetch current ids so we can drop the ones the client didn't send back.
  const { data: existing } = await supabase
    .from("trust_bar_items")
    .select("id");

  const sentIds = new Set(body.items.map((i) => i.id).filter(Boolean) as string[]);
  const toDelete = (existing || [])
    .map((r) => r.id as string)
    .filter((id) => !sentIds.has(id));

  if (toDelete.length > 0) {
    await supabase.from("trust_bar_items").delete().in("id", toDelete);
  }

  for (let i = 0; i < body.items.length; i++) {
    const item = body.items[i];
    const payload = {
      icon_name: (item.icon_name || "verified").trim(),
      title: (item.title || "").trim(),
      subtitle: (item.subtitle || "").trim(),
      sort_order: i,
      is_active: !!item.is_active,
    };
    if (!payload.title) continue;
    if (item.id) {
      await supabase.from("trust_bar_items").update(payload).eq("id", item.id);
    } else {
      await supabase.from("trust_bar_items").insert(payload);
    }
  }

  const { data } = await supabase
    .from("trust_bar_items")
    .select("*")
    .order("sort_order", { ascending: true });

  return NextResponse.json({ items: data || [] });
}
