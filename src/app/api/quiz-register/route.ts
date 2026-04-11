import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, dob, marketingOptin, quizResult } = body;

    if (!name || !email || !phone || !dob) {
      return NextResponse.json(
        { error: "Name, email, phone, and date of birth are required" },
        { status: 400 }
      );
    }

    const supabase = getServiceClient();

    const { data, error } = await supabase
      .from("quiz_registrations")
      .insert({
        name,
        email,
        phone,
        dob,
        marketing_optin: !!marketingOptin,
        quiz_result: quizResult || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Quiz registration error:", error);
      return NextResponse.json(
        { error: "Failed to save registration" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch (err) {
    console.error("Quiz registration error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
