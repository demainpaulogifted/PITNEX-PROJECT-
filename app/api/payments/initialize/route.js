import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

const PAYSTACK_SECRET_KEY =
  process.env.PAYSTACK_SECRET_KEY;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL;

const UPGRADE_AMOUNT_KOBO = 170000;

export async function POST() {
  try {
    if (!PAYSTACK_SECRET_KEY) {
      return NextResponse.json(
        {
          success: false,
          error:
            "PAYSTACK_SECRET_KEY is not configured.",
        },
        { status: 500 }
      );
    }

    if (!SITE_URL) {
      return NextResponse.json(
        {
          success: false,
          error:
            "NEXT_PUBLIC_SITE_URL is not configured.",
        },
        { status: 500 }
      );
    }

    const supabase =
      await createSupabaseServerClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          error:
            "You must be logged in to upgrade your account.",
        },
        { status: 401 }
      );
    }

    if (!user.email) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Your account does not have a valid email address.",
        },
        { status: 400 }
      );
    }

    const callbackUrl =
      `${SITE_URL.replace(/\/$/, "")}` +
      "/payment/upgrade/callback";

    const response = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization:
            `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          amount: UPGRADE_AMOUNT_KOBO,
          currency: "NGN",
          callback_url: callbackUrl,
          metadata: {
            pitnexUserId: user.id,
            purpose:
              "PITNEX_ACCOUNT_UPGRADE",
          },
        }),
        cache: "no-store",
      }
    );

    const data =
      await response.json();

    if (
      !response.ok ||
      !data.status ||
      !data.data
    ) {
      console.error(
        "Paystack initialization error:",
        data
      );

      return NextResponse.json(
        {
          success: false,
          error:
            data.message ||
            "Unable to initialize Paystack payment.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      authorizationUrl:
        data.data.authorization_url,
      reference:
        data.data.reference,
      accessCode:
        data.data.access_code,
      amount:
        UPGRADE_AMOUNT_KOBO,
      callbackUrl,
    });
  } catch (error) {
    console.error(
      "Paystack initialization error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to initialize payment.",
      },
      { status: 500 }
    );
  }
}