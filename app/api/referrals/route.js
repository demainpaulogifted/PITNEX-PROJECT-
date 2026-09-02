import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { prisma } from "@/lib/prisma";

const REFERRAL_REWARD_KOBO = 50000;

function makeReferralCode(userId) {
  return userId.replace(/-/g, "").slice(0, 10).toUpperCase();
}

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json(
        {
          success: false,
          error: "You must be logged in.",
        },
        { status: 401 }
      );
    }

    const profile = await prisma.pitnexProfile.findUnique({
      where: {
        id: user.id,
      },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    if (!profile) {
      return NextResponse.json(
        {
          success: false,
          error: "PITNEX profile not found.",
        },
        { status: 404 }
      );
    }

    const referrals = await prisma.$queryRaw`
      SELECT
        id,
        referred_user_id,
        reward_kobo,
        rewarded,
        rewarded_at,
        created_at
      FROM public.pitnex_referrals
      WHERE referrer_id = ${user.id}::uuid
      ORDER BY created_at DESC
    `;

    const rewardedCount = referrals.filter(
      (item) => item.rewarded === true
    ).length;

    const referralCode = makeReferralCode(user.id);

    return NextResponse.json({
      success: true,
      referralCode,
      referralCount: referrals.length,
      rewardedCount,
      totalEarnedNaira:
        rewardedCount * (REFERRAL_REWARD_KOBO / 100),
      referrals,
    });
  } catch (error) {
    console.error("Referral GET error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to load referrals.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json(
        {
          success: false,
          error: "You must be logged in.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const referredUserId = String(
      body.referredUserId || ""
    ).trim();

    if (!referredUserId) {
      return NextResponse.json(
        {
          success: false,
          error: "Referred user ID is required.",
        },
        { status: 400 }
      );
    }

    if (referredUserId === user.id) {
      return NextResponse.json(
        {
          success: false,
          error: "You cannot refer yourself.",
        },
        { status: 400 }
      );
    }

    const referredUser =
      await prisma.pitnexProfile.findUnique({
        where: {
          id: referredUserId,
        },
        select: {
          id: true,
        },
      });

    if (!referredUser) {
      return NextResponse.json(
        {
          success: false,
          error: "Referred user not found.",
        },
        { status: 404 }
      );
    }

    const existing = await prisma.$queryRaw`
      SELECT id
      FROM public.pitnex_referrals
      WHERE referred_user_id = ${referredUserId}::uuid
      LIMIT 1
    `;

    if (existing.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "This user has already been referred.",
        },
        { status: 409 }
      );
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
        ${user.id}::uuid,
        ${referredUserId}::uuid,
        ${REFERRAL_REWARD_KOBO},
        false,
        NOW()
      )
    `;

    return NextResponse.json({
      success: true,
      message: "Referral recorded successfully.",
      rewardNaira: REFERRAL_REWARD_KOBO / 100,
      status: "PENDING",
    });
  } catch (error) {
    console.error("Referral POST error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to record referral.",
      },
      { status: 500 }
    );
  }
}