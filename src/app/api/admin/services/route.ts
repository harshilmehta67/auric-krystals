import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, getServiceClient } from "@/lib/admin-auth";
import { SERVICES_DEFAULTS } from "@/lib/services-defaults";
import type { ServicesPillar, ServicesStep, ServicesTier } from "@/types";

export async function GET(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = getServiceClient();
  const { data } = await supabase
    .from("services_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  // If the row is missing (admin opens before migration is fully seeded),
  // surface the defaults so the form can pre-fill instead of crashing.
  return NextResponse.json({ services: data ?? SERVICES_DEFAULTS });
}

// PATCH accepts multipart/form-data so the hero image can be uploaded in
// the same request. All non-file fields are sent as strings (JSONB blocks
// arrive as JSON-encoded strings under their keys).
export async function PATCH(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = getServiceClient();
  const formData = await request.formData();
  const updates: Record<string, unknown> = {};

  const stringFields = [
    "hero_image_url",
    "hero_eyebrow",
    "hero_title",
    "hero_title_2",
    "hero_blurb",
    "pillars_eyebrow",
    "pillars_title",
    "sittings_eyebrow",
    "sittings_title",
    "sittings_blurb",
    "sittings_footer",
    "steps_eyebrow",
    "steps_title",
    "cta_title",
    "cta_blurb",
    "cta_label",
  ] as const;

  for (const f of stringFields) {
    const v = formData.get(f);
    if (v !== null) updates[f] = ((v as string) || "").trim();
  }

  // JSONB structured fields. We validate length/shape so admins can never
  // accidentally add or remove sections via a hand-crafted request.
  const pillarsRaw = formData.get("pillars");
  if (pillarsRaw !== null) {
    try {
      const parsed = JSON.parse(pillarsRaw as string) as ServicesPillar[];
      if (!Array.isArray(parsed) || parsed.length !== SERVICES_DEFAULTS.pillars.length) {
        return NextResponse.json(
          { error: `pillars must be exactly ${SERVICES_DEFAULTS.pillars.length} entries` },
          { status: 400 }
        );
      }
      updates.pillars = parsed.map((p, i) => ({
        key: SERVICES_DEFAULTS.pillars[i].key,
        icon: (p.icon ?? "").trim() || SERVICES_DEFAULTS.pillars[i].icon,
        title: (p.title ?? "").trim(),
        body: (p.body ?? "").trim(),
      }));
    } catch {
      return NextResponse.json({ error: "Invalid pillars payload" }, { status: 400 });
    }
  }

  const tiersRaw = formData.get("tiers");
  if (tiersRaw !== null) {
    try {
      const parsed = JSON.parse(tiersRaw as string) as ServicesTier[];
      if (!Array.isArray(parsed) || parsed.length !== SERVICES_DEFAULTS.tiers.length) {
        return NextResponse.json(
          { error: `tiers must be exactly ${SERVICES_DEFAULTS.tiers.length} entries` },
          { status: 400 }
        );
      }
      updates.tiers = parsed.map((t, i) => ({
        key: SERVICES_DEFAULTS.tiers[i].key,
        eyebrow: (t.eyebrow ?? "").trim(),
        title: (t.title ?? "").trim(),
        price_label: (t.price_label ?? "").trim(),
        price_unit: (t.price_unit ?? "").trim(),
        duration: (t.duration ?? "").trim(),
        blurb: (t.blurb ?? "").trim(),
        features: Array.isArray(t.features)
          ? t.features.map((f) => String(f).trim()).filter(Boolean)
          : [],
        badge_label: t.badge_label ? String(t.badge_label).trim() : undefined,
        cta_label: (t.cta_label ?? "").trim(),
        cta_query: (t.cta_query ?? "").trim(),
      }));
    } catch {
      return NextResponse.json({ error: "Invalid tiers payload" }, { status: 400 });
    }
  }

  const stepsRaw = formData.get("steps");
  if (stepsRaw !== null) {
    try {
      const parsed = JSON.parse(stepsRaw as string) as ServicesStep[];
      if (!Array.isArray(parsed) || parsed.length !== SERVICES_DEFAULTS.steps.length) {
        return NextResponse.json(
          { error: `steps must be exactly ${SERVICES_DEFAULTS.steps.length} entries` },
          { status: 400 }
        );
      }
      updates.steps = parsed.map((s, i) => ({
        step: (s.step ?? SERVICES_DEFAULTS.steps[i].step).trim() || SERVICES_DEFAULTS.steps[i].step,
        title: (s.title ?? "").trim(),
        body: (s.body ?? "").trim(),
      }));
    } catch {
      return NextResponse.json({ error: "Invalid steps payload" }, { status: 400 });
    }
  }

  // Optional hero image upload. If a file is present we replace
  // hero_image_url with the freshly-uploaded public URL.
  const heroImage = formData.get("hero_image") as File | null;
  if (heroImage && heroImage.size > 0) {
    const ext = heroImage.name.split(".").pop() || "jpg";
    const path = `services/hero-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("product-images")
      .upload(path, heroImage, { contentType: heroImage.type, upsert: true });
    if (upErr) {
      return NextResponse.json({ error: "Failed to upload hero image" }, { status: 500 });
    }
    const { data: pub } = supabase.storage.from("product-images").getPublicUrl(path);
    updates.hero_image_url = pub.publicUrl;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  // Upsert so that on the very first save (before the seed runs) we still
  // create the singleton instead of returning a "not found" error.
  const { data, error } = await supabase
    .from("services_settings")
    .upsert({ id: 1, ...updates })
    .eq("id", 1)
    .select()
    .single();

  if (error) {
    console.error("services_settings update failed", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }

  return NextResponse.json({ services: data });
}
