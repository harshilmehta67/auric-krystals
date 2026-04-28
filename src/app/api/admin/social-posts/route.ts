import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, getServiceClient } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("social_posts")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) return NextResponse.json({ error: "Failed" }, { status: 500 });
  return NextResponse.json({ posts: data || [] });
}

export async function POST(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = getServiceClient();
  const formData = await request.formData();

  const linkUrl = ((formData.get("link_url") as string) || "").trim();
  const caption = ((formData.get("caption") as string) || "").trim() || null;
  const isActive = formData.get("is_active") !== "false";
  const sortOrder = parseInt((formData.get("sort_order") as string) || "0");

  if (!linkUrl) {
    return NextResponse.json({ error: "Link URL is required" }, { status: 400 });
  }

  let imageUrl = "";
  const image = formData.get("image") as File | null;
  if (image && image.size > 0) {
    const ext = image.name.split(".").pop() || "jpg";
    const path = `social/${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("product-images")
      .upload(path, image, { contentType: image.type, upsert: true });
    if (upErr) {
      return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
    }
    const { data: url } = supabase.storage.from("product-images").getPublicUrl(path);
    imageUrl = url.publicUrl;
  } else {
    imageUrl = ((formData.get("image_url") as string) || "").trim();
  }

  if (!imageUrl) {
    return NextResponse.json({ error: "Image is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("social_posts")
    .insert({
      image_url: imageUrl,
      link_url: linkUrl,
      caption,
      sort_order: sortOrder,
      is_active: isActive,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: "Failed to create" }, { status: 500 });

  return NextResponse.json({ post: data }, { status: 201 });
}
