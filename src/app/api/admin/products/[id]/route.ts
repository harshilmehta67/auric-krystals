import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, getServiceClient } from "@/lib/admin-auth";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  const user = await verifyAdmin(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;
  const supabase = getServiceClient();

  const { data, error } = await supabase
    .from("products")
    .select("*, categories(name)")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({
    product: {
      ...data,
      category_name: (data.categories as { name: string } | null)?.name || null,
      categories: undefined,
    },
  });
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const user = await verifyAdmin(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;
  const formData = await request.formData();
  const supabase = getServiceClient();

  const updates: Record<string, unknown> = {};

  const fields = ["title", "subtitle", "blurb", "description"] as const;
  for (const f of fields) {
    const val = formData.get(f);
    if (val !== null) updates[f] = (val as string).trim();
  }

  if (updates.title) {
    updates.slug = (updates.title as string).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  const priceStr = formData.get("price") as string | null;
  if (priceStr !== null) updates.price = parseFloat(priceStr);

  const specs = formData.get("specifications");
  if (specs !== null) updates.specifications = (specs as string).trim() || null;

  const catId = formData.get("category_id");
  if (catId !== null) updates.category_id = (catId as string) || null;

  const isActive = formData.get("is_active");
  if (isActive !== null) updates.is_active = isActive !== "false";

  const sortOrder = formData.get("sort_order");
  if (sortOrder !== null) updates.sort_order = parseInt(sortOrder as string);

  const image1 = formData.get("image") as File | null;
  if (image1 && image1.size > 0) {
    const ext = image1.name.split(".").pop() || "jpg";
    const path = `products/${Date.now()}-1.${ext}`;
    const { error: uploadErr } = await supabase.storage
      .from("product-images")
      .upload(path, image1, { contentType: image1.type, upsert: true });

    if (!uploadErr) {
      const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(path);
      updates.image_url = urlData.publicUrl;
    }
  } else {
    const urlVal = formData.get("image_url");
    if (urlVal !== null) updates.image_url = urlVal as string;
  }

  const image2 = formData.get("image2") as File | null;
  if (image2 && image2.size > 0) {
    const ext = image2.name.split(".").pop() || "jpg";
    const path = `products/${Date.now()}-2.${ext}`;
    const { error: uploadErr } = await supabase.storage
      .from("product-images")
      .upload(path, image2, { contentType: image2.type, upsert: true });

    if (!uploadErr) {
      const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(path);
      updates.image_url_2 = urlData.publicUrl;
    }
  } else {
    const urlVal = formData.get("image_url_2");
    if (urlVal !== null) updates.image_url_2 = (urlVal as string) || null;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "A product with this slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }

  return NextResponse.json({ product: data });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const user = await verifyAdmin(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;
  const supabase = getServiceClient();

  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
