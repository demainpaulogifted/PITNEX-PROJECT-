import { NextResponse } from "next/server";

import { getWalletBalance } from "@/lib/wallet";

/*
  TEMPORARY DEVELOPMENT USER

  We will replace this with the authenticated
  Supabase user in the authentication phase.

  DO NOT use this approach for production.
*/
const DEVELOPMENT_USER_ID =
  process.env.DEVELOPMENT_USER_ID;

export async function GET() {
  try {
    if (!DEVELOPMENT_USER_ID) {
      return NextResponse.json(
        {
          error:
            "DEVELOPMENT_USER_ID is not configured.",
        },
        {
          status: 500,
        }
      );
    }

    const wallet = await getWalletBalance(
      DEVELOPMENT_USER_ID
    );

    return NextResponse.json({
      success: true,
      wallet,
    });
  } catch (error) {
    console.error("Wallet balance error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to load wallet balance.",
      },
      {
        status: 500,
      }
    );
  }
}