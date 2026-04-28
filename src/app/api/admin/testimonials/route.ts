import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, getServiceClient } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 });
  }

  return NextResponse.json({ testimonials: data || [] });
}

export async function POST(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = getServiceClient();
  const formData = await request.formData();

  const name = (formData.get("name") as string)?.trim();
  const city = ((formData.get("city") as string) || "").trim() || null;
  const quote = (formData.get("quote") as string)?.trim();
  const ratingStr = formData.get("rating") as string | null;
  const rating = ratingStr ? Number(ratingStr) : null;
  const isFeatured = formData.get("is_featured") !== "false";
  const sortOrder = parseInt((formData.get("sort_order") as string) || "0");

  if (!name || !quote) {
    return NextResponse.json({ error: "Name and quote are required" }, { status: 400 });
  }

  let avatarUrl: string | null = null;
  const avatar = formData.get("avatar") as File | null;
  if (avatar && avatar.size > 0) {
    const ext = avatar.name.split(".").pop() || "jpg";
    const path = `testimonials/${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("product-images")
      .upload(path, avatar, { contentType: avatar.type, upsert: true });
    if (!upErr) {
      const { data } = supabase.storage.from("product-images").getPublicUrl(path);
      avatarUrl = data.publicUrl;
    }
  } else {
    const passed = formData.get("avatar_url");
    if (passed) avatarUrl = passed as string;
  }

  const { data, error } = await supabase
    .from("testimonials")
    .insert({
      name,
      city,
      quote,
      rating,
      avatar_url: avatarUrl,
      is_featured: isFeatured,
      sort_order: sortOrder,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to create testimonial" }, { status: 500 });
  }

  return NextResponse.json({ testimonial: data }, { status: 201 });
}
