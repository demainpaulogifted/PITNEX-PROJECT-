import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const ADMIN_EMAIL = "paulotubo9@gmail.com";

export async function GET() {
  try {
    const setting = await prisma.pitnexSetting.findUnique({
      where: {
        key: "withdrawal_window_minutes",
      },
    });

    return NextResponse.json({
      success: true,
      withdrawalMinutes:
        setting?.value?.minutes ?? 60,
    });
  } catch (error) {
    console.error("Admin settings GET error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to load admin settings.",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const minutes = Number(
      body.withdrawalMinutes
    );

    if (email !== ADMIN_EMAIL) {
      return NextResponse.json(
        {
          success: false,
          error: "Administrator access required.",
        },
        { status: 403 }
      );
    }

    if (
      !Number.isInteger(minutes) ||
      minutes < 1 ||
      minutes > 43200
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Withdrawal timer must be between 1 and 43,200 minutes.",
        },
        { status: 400 }
      );
    }

    const setting =
      await prisma.pitnexSetting.upsert({
        where: {
          key: "withdrawal_window_minutes",
        },
        update: {
          value: {
            minutes,
          },
          description:
            "Global withdrawal waiting period in minutes.",
        },
        create: {
          key: "withdrawal_window_minutes",
          value: {
            minutes,
          },
          description:
            "Global withdrawal waiting period in minutes.",
        },
      });

    return NextResponse.json({
      success: true,
      withdrawalMinutes:
        setting.value.minutes,
    });
  } catch (error) {
    console.error("Admin settings PUT error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to save withdrawal settings.",
      },
      { status: 500 }
    );
  }
}