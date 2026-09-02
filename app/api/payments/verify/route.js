import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { prisma } from "@/lib/prisma";

const PAYSTACK_SECRET_KEY =
  process.env.PAYSTACK_SECRET_KEY;

const UPGRADE_AMOUNT_KOBO = 170000;

export async function POST(request) {
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
            "You must be logged in to verify this payment.",
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

    const body = await request.json();

    const reference =
      body.reference?.trim();

    if (!reference) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Payment reference is required.",
        },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(
        reference
      )}`,
      {
        method: "GET",
        headers: {
          Authorization:
            `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type":
            "application/json",
        },
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (
      !response.ok ||
      !data.status ||
      !data.data
    ) {
      console.error(
        "Paystack verification error:",
        data
      );

      return NextResponse.json(
        {
          success: false,
          error:
            data.message ||
            "Unable to verify Paystack payment.",
        },
        { status: 400 }
      );
    }

    const payment = data.data;

    if (payment.status !== "success") {
      return NextResponse.json(
        {
          success: false,
          error:
            `Payment has not completed. Current status: ${
              payment.status || "unknown"
            }.`,
        },
        { status: 400 }
      );
    }

    if (
      Number(payment.amount) !==
      UPGRADE_AMOUNT_KOBO
    ) {
      console.error(
        "Invalid PITNEX upgrade amount:",
        {
          reference,
          amount: payment.amount,
        }
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid upgrade payment amount.",
        },
        { status: 400 }
      );
    }

    const metadata =
      payment.metadata || {};

    if (
      metadata.purpose !==
      "PITNEX_ACCOUNT_UPGRADE"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This payment is not a valid PITNEX upgrade transaction.",
        },
        { status: 400 }
      );
    }

    if (
      metadata.pitnexUserId !==
      user.id
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Payment user verification failed.",
        },
        { status: 403 }
      );
    }

    if (
      payment.customer?.email &&
      payment.customer.email.toLowerCase() !==
        user.email.toLowerCase()
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Payment email verification failed.",
        },
        { status: 403 }
      );
    }

    const profile =
      await prisma.pitnexProfile.findUnique({
        where: {
          id: user.id,
        },
        include: {
          wallet: true,
        },
      });

    if (!profile) {
      return NextResponse.json(
        {
          success: false,
          error:
            "PITNEX account not found.",
        },
        { status: 404 }
      );
    }

    if (!profile.wallet) {
      return NextResponse.json(
        {
          success: false,
          error:
            "PITNEX wallet not found.",
        },
        { status: 500 }
      );
    }

    const existingTransaction =
      await prisma.pitnexWalletTransaction.findUnique(
        {
          where: {
            reference,
          },
        }
      );

    if (existingTransaction) {
      if (
        existingTransaction.type ===
        "ACCOUNT_UPGRADE"
      ) {
        return NextResponse.json({
          success: true,
          alreadyProcessed: true,
          upgraded: true,
          message:
            "PITNEX account upgrade has already been processed.",
        });
      }

      return NextResponse.json(
        {
          success: false,
          error:
            "This payment reference has already been used.",
        },
        { status: 409 }
      );
    }

    await prisma.$transaction(
      async (tx) => {
        await tx.pitnexWalletTransaction.create(
          {
            data: {
              userId: profile.id,
              walletId: profile.wallet.id,
              type: "ACCOUNT_UPGRADE",
              status: "COMPLETED",
              amountKobo:
                BigInt(
                  UPGRADE_AMOUNT_KOBO
                ),
              reference,
              description:
                "PITNEX account upgrade payment",
              metadata: {
                provider: "paystack",
                paystackReference:
                  reference,
                paystackTransactionId:
                  payment.id ?? null,
                channel:
                  payment.channel ?? null,
                paidAt:
                  payment.paid_at ?? null,
                currency:
                  payment.currency ?? null,
              },
            },
          }
        );

        await tx.pitnexProfile.update({
          where: {
            id: profile.id,
          },
          data: {
            upgradedAt: new Date(),
          },
        });
      }
    );

    return NextResponse.json({
      success: true,
      upgraded: true,
      message:
        "Payment verified. Your PITNEX account is now upgraded.",
    });
  } catch (error) {
    console.error(
      "PITNEX Paystack verification error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to verify and process payment.",
      },
      { status: 500 }
    );
  }
}