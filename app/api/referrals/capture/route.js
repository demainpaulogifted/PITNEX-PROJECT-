import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "You must be logged in." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const referrerId = String(body.referrerId || "").trim();

    if (!referrerId) {
      return NextResponse.json(
        { success: false, error: "Referral information is missing." },
        { status: 400 }
      );
    }

    if (referrerId === user.id) {
      return NextResponse.json(
        { success: false, error: "You cannot refer yourself." },
        { status: 400 }
      );
    }

    const referrer = await prisma.pitnexProfile.findUnique({
      where: { id: referrerId },
      select: { id: true },
    });

    if (!referrer) {
      return NextResponse.json(
        { success: false, error: "Invalid referral." },
        { status: 404 }
      );
    }

    const existing = await prisma.$queryRaw`
      SELECT id
      FROM public.pitnex_referrals
      WHERE referred_user_id = ${user.id}::uuid
      LIMIT 1
    `;

    if (existing.length > 0) {
      return NextResponse.json({
        success: true,
        alreadyCaptured: true,
      });
    }

    await prisma.$executeRaw`
      INSERT INTO public.pitnex_referrals (
        id,
        referrer_id,
        referred_user_id,
        reward_kobo,
        rewarded,
        created_at
      )
      VALUES (
        gen_random_uuid(),
        ${referrerId}::uuid,
        ${user.id}::uuid,
        50000,
        false,
        NOW()
      )
    `;

    return NextResponse.json({
      success: true,
      alreadyCaptured: false,
      message: "Referral captured successfully.",
    });
  } catch (error) {
    console.error("Referral capture error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to capture referral.",
      },
      { status: 500 }
    );
  }
}