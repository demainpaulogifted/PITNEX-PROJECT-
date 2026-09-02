import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { prisma } from "@/lib/prisma";

const WITHDRAWAL_START_HOUR = 18;
const WITHDRAWAL_END_HOUR = 19;

export async function POST(request) {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: "You must be logged in.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const amount = Number(body.amount);
    const bankName = String(body.bankName || "").trim();
    const accountNumber = String(
      body.accountNumber || ""
    ).trim();
    const accountName = String(
      body.accountName || ""
    ).trim();

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Enter a valid withdrawal amount.",
        },
        { status: 400 }
      );
    }

    if (!bankName) {
      return NextResponse.json(
        {
          success: false,
          error: "Please select your bank.",
        },
        { status: 400 }
      );
    }

    if (!/^\d{10}$/.test(accountNumber)) {
      return NextResponse.json(
        {
          success: false,
          error: "Enter a valid 10-digit account number.",
        },
        { status: 400 }
      );
    }

    /*
     * PITNEX withdrawal window:
     * Every day from 18:00 to 19:00.
     */
    const now = new Date();

    const currentHour = now.getHours();

    const withdrawalWindowOpen =
      currentHour >= WITHDRAWAL_START_HOUR &&
      currentHour < WITHDRAWAL_END_HOUR;

    if (!withdrawalWindowOpen) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Withdrawals are currently closed. Withdrawal requests are accepted from 6:00 PM to 7:00 PM daily.",
        },
        { status: 403 }
      );
    }

    /*
     * Get the PITNEX profile.
     */
    const profile = await prisma.pitnexProfile.findUnique({
      where: {
        id: user.id,
      },
      select: {
        id: true,
        upgradedAt: true,
        accountStatus: true,
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

    if (profile.accountStatus !== "ACTIVE") {
      return NextResponse.json(
        {
          success: false,
          error: "Your PITNEX account is not active.",
        },
        { status: 403 }
      );
    }

    /*
     * Withdrawal requires an upgraded account.
     */
    if (!profile.upgradedAt) {
      return NextResponse.json(
        {
          success: false,
          error:
            "You must upgrade your PITNEX account before you can withdraw.",
          code: "UPGRADE_REQUIRED",
        },
        { status: 403 }
      );
    }

    const amountKobo = BigInt(
      Math.round(amount * 100)
    );

    /*
     * Prevent zero/invalid Kobo values.
     */
    if (amountKobo <= 0n) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid withdrawal amount.",
        },
        { status: 400 }
      );
    }

    /*
     * Use a transaction so the balance check and
     * withdrawal deduction happen together.
     */
    const result = await prisma.$transaction(
      async (tx) => {
        const wallet =
          await tx.pitnexWallet.findUnique({
            where: {
              userId: user.id,
            },
            select: {
              id: true,
              balanceKobo: true,
            },
          });

        if (!wallet) {
          throw new Error("WALLET_NOT_FOUND");
        }

        if (wallet.balanceKobo < amountKobo) {
          throw new Error("INSUFFICIENT_BALANCE");
        }

        /*
         * Only one pending/processing withdrawal at a time.
         */
        const existing =
          await tx.pitnexWithdrawal.findFirst({
            where: {
              userId: user.id,
              status: {
                in: [
                  "PENDING",
                  "APPROVED",
                  "PROCESSING",
                ],
              },
            },
            select: {
              id: true,
            },
          });

        if (existing) {
          throw new Error("WITHDRAWAL_ALREADY_PENDING");
        }

        const reference =
          `PITNEX-WD-${Date.now()}-${crypto.randomUUID()}`;

        /*
         * Deduct the requested amount immediately so
         * the same money cannot be withdrawn twice.
         */
        await tx.pitnexWallet.update({
          where: {
            id: wallet.id,
          },
          data: {
            balanceKobo: {
              decrement: amountKobo,
            },
            lifetimeWithdrawnKobo: {
              increment: amountKobo,
            },
          },
        });

        const withdrawal =
          await tx.pitnexWithdrawal.create({
            data: {
              userId: user.id,
              reference,
              amountKobo,
              status: "PENDING",
              bankName,
              accountNumber,
              accountName: accountName || null,
            },
          });

        await tx.pitnexWalletTransaction.create({
          data: {
            userId: user.id,
            walletId: wallet.id,
            type: "WITHDRAWAL",
            status: "PENDING",
            amountKobo: -amountKobo,
            reference,
            description:
              "PITNEX withdrawal request",
            metadata: {
              withdrawalId: withdrawal.id,
              bankName,
              accountNumber,
            },
          },
        });

        return {
          withdrawalId: withdrawal.id,
          reference: withdrawal.reference,
          amountKobo: withdrawal.amountKobo,
          remainingBalanceKobo:
            wallet.balanceKobo - amountKobo,
        };
      }
    );

    return NextResponse.json({
      success: true,
      message:
        "Withdrawal request submitted successfully.",
      withdrawal: {
        id: result.withdrawalId,
        reference: result.reference,
        amountNaira:
          Number(result.amountKobo) / 100,
        remainingBalanceNaira:
          Number(result.remainingBalanceKobo) / 100,
        status: "PENDING",
      },
    });
  } catch (error) {
    console.error(
      "PITNEX withdrawal error:",
      error
    );

    if (error.message === "WALLET_NOT_FOUND") {
      return NextResponse.json(
        {
          success: false,
          error: "PITNEX wallet not found.",
        },
        { status: 404 }
      );
    }

    if (
      error.message === "INSUFFICIENT_BALANCE"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Insufficient wallet balance.",
        },
        { status: 400 }
      );
    }

    if (
      error.message ===
      "WITHDRAWAL_ALREADY_PENDING"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "You already have a withdrawal request being processed.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to submit withdrawal request.",
      },
      { status: 500 }
    );
  }
}