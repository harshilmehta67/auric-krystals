import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, getServiceClient } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(name)")
    .order("sort_order", { ascending: true });

  if (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }

  const products = (data || []).map((p: Record<string, unknown>) => ({
    ...p,
    category_name: (p.categories as { name: string } | null)?.name || null,
    categories: undefined,
  }));

  return NextResponse.json({ products });
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function POST(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const title = formData.get("title") as string;
  const subtitle = formData.get("subtitle") as string || "";
  const price = parseFloat(formData.get("price") as string || "0");
  const blurb = formData.get("blurb") as string || "";
  const description = formData.get("description") as string || "";
  const categoryId = formData.get("category_id") as string || null;
  const isActive = formData.get("is_active") !== "false";
  const sortOrder = parseInt(formData.get("sort_order") as string || "0");
  const image1 = formData.get("image") as File | null;
  const image2 = formData.get("image2") as File | null;

  if (!title?.trim()) {
    return NextResponse.json({ error: "Product title is required" }, { status: 400 });
  }

  const supabase = getServiceClient();
  let imageUrl = "";
  let imageUrl2: string | null = null;

  if (image1 && image1.size > 0) {
    const ext = image1.name.split(".").pop() || "jpg";
    const path = `products/${Date.now()}-1.${ext}`;
    const { error: uploadErr } = await supabase.storage
      .from("product-images")
      .upload(path, image1, { contentType: image1.type, upsert: true });

    if (uploadErr) {
      return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
    }

    const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(path);
    imageUrl = urlData.publicUrl;
  } else {
    imageUrl = formData.get("image_url") as string || "";
  }

  if (image2 && image2.size > 0) {
    const ext = image2.name.split(".").pop() || "jpg";
    const path = `products/${Date.now()}-2.${ext}`;
    const { error: uploadErr } = await supabase.storage
      .from("product-images")
      .upload(path, image2, { contentType: image2.type, upsert: true });

    if (!uploadErr) {
      const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(path);
      imageUrl2 = urlData.publicUrl;
    }
  } else {
    imageUrl2 = (formData.get("image_url_2") as string) || null;
  }

  const slug = slugify(title.trim());

  const { data, error } = await supabase
    .from("products")
    .insert({
      slug,
      title: title.trim(),
      subtitle: subtitle.trim(),
      price,
      blurb: blurb.trim(),
      description: description.trim(),
      image_url: imageUrl,
      image_url_2: imageUrl2,
      category_id: categoryId || null,
      is_active: isActive,
      sort_order: sortOrder,
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "A product with this slug already exists" }, { status: 409 });
    }
    console.error("Product create error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }

  return NextResponse.json({ product: data }, { status: 201 });
}
