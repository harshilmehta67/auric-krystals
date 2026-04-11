import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { sendOrderEmail, sendTelegramNotification } from "@/lib/notifications";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const customerName = formData.get("customerName") as string;
    const customerEmail = formData.get("customerEmail") as string;
    const customerPhone = formData.get("customerPhone") as string;
    const customerAddress = formData.get("customerAddress") as string;
    const orderNotes = (formData.get("orderNotes") as string) || "";
    const items = JSON.parse(formData.get("items") as string);
    const total = parseFloat(formData.get("total") as string);
    const screenshot = formData.get("screenshot") as File | null;

    if (!customerName || !customerEmail || !customerPhone || !customerAddress || !items?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = getServiceClient();
    let screenshotUrl: string | null = null;

    if (screenshot) {
      const ext = screenshot.name.split(".").pop() || "png";
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const buffer = Buffer.from(await screenshot.arrayBuffer());

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("screenshots")
        .upload(filename, buffer, {
          contentType: screenshot.type,
          upsert: false,
        });

      if (uploadError) {
        console.error("Screenshot upload failed:", uploadError);
      } else {
        const { data: urlData } = supabase.storage
          .from("screenshots")
          .getPublicUrl(uploadData.path);
        screenshotUrl = urlData.publicUrl;
      }
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        customer_address: customerAddress,
        order_notes: orderNotes || null,
        items,
        total,
        screenshot_url: screenshotUrl,
        status: "pending",
      })
      .select()
      .single();

    if (orderError) {
      console.error("Order insert failed:", orderError);
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }

    // Fire notifications async — don't block the response
    Promise.allSettled([
      sendOrderEmail(order).catch((e) => console.error("Email notification failed:", e)),
      sendTelegramNotification(order).catch((e) => console.error("Telegram notification failed:", e)),
    ]);

    return NextResponse.json({ order }, { status: 201 });
  } catch (err) {
    console.error("Order creation error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
