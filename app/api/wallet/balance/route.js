import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { getWalletBalance } from "@/lib/wallet";

export async function GET(request) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "You must be logged in.",
        },
        { status: 401 }
      );
    }

    const wallet = await getWalletBalance(user.id);

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
      { status: 500 }
    );
  }
}