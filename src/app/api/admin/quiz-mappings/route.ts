import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, getServiceClient } from "@/lib/admin-auth";

const VALID_KEYS = ["A", "B", "C", "D"] as const;

interface PutPayload {
  result_key: string;
  product_ids: string[];
}

export async function GET(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("quiz_result_products")
    .select("result_key, product_id, sort_order")
    .order("sort_order", { ascending: true });

  if (error) return NextResponse.json({ error: "Failed" }, { status: 500 });

  // Group by key for the admin UI's convenience.
  const grouped: Record<string, string[]> = { A: [], B: [], C: [], D: [] };
  for (const row of data || []) {
    if (grouped[row.result_key as string]) {
      grouped[row.result_key as string].push(row.product_id as string);
    }
  }

  return NextResponse.json({ mappings: grouped });
}

// PUT replaces ALL mappings for a single result key. Body:
//   { result_key: "A", product_ids: ["uuid1", "uuid2", ...] }
export async function PUT(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json().catch(() => null)) as PutPayload | null;
  if (!body?.result_key || !Array.isArray(body.product_ids)) {
    return NextResponse.json({ error: "result_key + product_ids[] required" }, { status: 400 });
  }

  const key = body.result_key.toUpperCase();
  if (!VALID_KEYS.includes(key as (typeof VALID_KEYS)[number])) {
    return NextResponse.json({ error: "Invalid result_key" }, { status: 400 });
  }

  const supabase = getServiceClient();

  // Wipe + rebuild for this key only. Other keys untouched.
  await supabase.from("quiz_result_products").delete().eq("result_key", key);

  if (body.product_ids.length > 0) {
    const rows = body.product_ids.map((product_id, idx) => ({
      result_key: key,
      product_id,
      sort_order: idx,
    }));
    const { error } = await supabase.from("quiz_result_products").insert(rows);
    if (error) {
      return NextResponse.json({ error: "Failed to save mapping" }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}
