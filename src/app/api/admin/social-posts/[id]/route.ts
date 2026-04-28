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

  const linkUrl = formData.get("link_url");
  if (linkUrl !== null) updates.link_url = ((linkUrl as string) || "").trim();

  const caption = formData.get("caption");
  if (caption !== null) updates.caption = ((caption as string) || "").trim() || null;

  const isActive = formData.get("is_active");
  if (isActive !== null) updates.is_active = isActive !== "false";

  const sortOrder = formData.get("sort_order");
  if (sortOrder !== null) updates.sort_order = parseInt(sortOrder as string);

  const image = formData.get("image") as File | null;
  if (image && image.size > 0) {
    const ext = image.name.split(".").pop() || "jpg";
    const path = `social/${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("product-images")
      .upload(path, image, { contentType: image.type, upsert: true });
    if (!upErr) {
      const { data: url } = supabase.storage.from("product-images").getPublicUrl(path);
      updates.image_url = url.publicUrl;
    }
  } else {
    const u = formData.get("image_url");
    if (u !== null) updates.image_url = (u as string).trim();
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("social_posts")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: "Failed to update" }, { status: 500 });

  return NextResponse.json({ post: data });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const user = await verifyAdmin(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;
  const supabase = getServiceClient();

  const { error } = await supabase.from("social_posts").delete().eq("id", id);

  if (error) return NextResponse.json({ error: "Failed to delete" }, { status: 500 });

  return NextResponse.json({ success: true });
}
