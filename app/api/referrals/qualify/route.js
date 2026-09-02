import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { prisma } from "@/lib/prisma";

const REFERRAL_REWARD_KOBO = 50000;

export async function POST() {
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

    const referral = await prisma.$queryRaw`
      SELECT
        id,
        referrer_id,
        referred_user_id,
        reward_kobo,
        rewarded
      FROM public.pitnex_referrals
      WHERE referred_user_id = ${user.id}::uuid
      LIMIT 1
    `;

    if (!referral.length) {
      return NextResponse.json({
        success: true,
        qualified: false,
        message: "No referral found.",
      });
    }

    const record = referral[0];

    if (record.rewarded === true) {
      return NextResponse.json({
        success: true,
        qualified: true,
        alreadyRewarded: true,
        message: "Referral has already been rewarded.",
      });
    }

    /*
     * IMPORTANT:
     * This endpoint only marks a referral as qualified.
     * Wallet crediting will be connected after we
     * confirm the existing PITNEX wallet structure.
     */
    await prisma.$executeRaw`
      UPDATE public.pitnex_referrals
      SET
        rewarded = true,
        rewarded_at = NOW()
      WHERE id = ${record.id}::uuid
        AND rewarded = false
    `;

    return NextResponse.json({
      success: true,
      qualified: true,
      rewarded: true,
      rewardKobo: REFERRAL_REWARD_KOBO,
      rewardNaira: REFERRAL_REWARD_KOBO / 100,
      message: "Referral qualified successfully.",
    });
  } catch (error) {
    console.error(
      "Referral qualification error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Unable to qualify referral.",
      },
      { status: 500 }
    );
  }
}