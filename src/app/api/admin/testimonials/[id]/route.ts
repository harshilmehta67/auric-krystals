import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, getServiceClient } from "@/lib/admin-auth";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const user = await verifyAdmin(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;
  const supabase = getServiceClient();
  const formData = await request.formData();
  const updates: Record<string, unknown> = {};

  const fields = ["name", "city", "quote"] as const;
  for (const f of fields) {
    const v = formData.get(f);
    if (v !== null) updates[f] = ((v as string) || "").trim() || (f === "city" ? null : "");
  }

  const ratingStr = formData.get("rating");
  if (ratingStr !== null) {
    const r = ratingStr === "" ? null : Number(ratingStr);
    updates.rating = r;
  }

  const isFeatured = formData.get("is_featured");
  if (isFeatured !== null) updates.is_featured = isFeatured !== "false";

  const sortOrder = formData.get("sort_order");
  if (sortOrder !== null) updates.sort_order = parseInt(sortOrder as string);

  const avatar = formData.get("avatar") as File | null;
  if (avatar && avatar.size > 0) {
    const ext = avatar.name.split(".").pop() || "jpg";
    const path = `testimonials/${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("product-images")
      .upload(path, avatar, { contentType: avatar.type, upsert: true });
    if (!upErr) {
      const { data: url } = supabase.storage.from("product-images").getPublicUrl(path);
      updates.avatar_url = url.publicUrl;
    }
  } else {
    const url = formData.get("avatar_url");
    if (url !== null) updates.avatar_url = (url as string) || null;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("testimonials")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }

  return NextResponse.json({ testimonial: data });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const user = await verifyAdmin(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;
  const supabase = getServiceClient();

  const { error } = await supabase.from("testimonials").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
