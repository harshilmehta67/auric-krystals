import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, getServiceClient } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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

export async function PATCH(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = getServiceClient();
  const formData = await request.formData();
  const updates: Record<string, unknown> = {};

  const stringFields = [
    "bio_short",
    "bio_long",
    "instagram_url",
    "whatsapp_link",
    "whatsapp_number",
  ] as const;

  for (const f of stringFields) {
    const v = formData.get(f);
    if (v !== null) {
      const str = ((v as string) || "").trim();
      if (f === "bio_short" || f === "bio_long") {
        updates[f] = str;
      } else {
        updates[f] = str || null;
      }
    }
  }

  const photo = formData.get("photo") as File | null;
  if (photo && photo.size > 0) {
    const ext = photo.name.split(".").pop() || "jpg";
    const path = `about/${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("product-images")
      .upload(path, photo, { contentType: photo.type, upsert: true });
    if (!upErr) {
      const { data: url } = supabase.storage.from("product-images").getPublicUrl(path);
      updates.photo_url = url.publicUrl;
    }
  } else {
    const url = formData.get("photo_url");
    if (url !== null) updates.photo_url = (url as string) || null;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("about_settings")
    .update(updates)
    .eq("id", 1)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }

  return NextResponse.json({ about: data });
}
