import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEVELOPMENT_USER_ID =
  process.env.DEVELOPMENT_USER_ID;

export async function POST(request) {
  try {
    if (!DEVELOPMENT_USER_ID) {
      return NextResponse.json(
        {
          success: false,
          error:
            "PITNEX authentication is not configured.",
        },
        { status: 503 }
      );
    }

    const body = await request.json();

    const type =
      body.type === "CUSTOM"
        ? "CUSTOM"
        : "ARTICLE";

    const title =
      String(body.title || "").trim();

    const instructions =
      String(body.instructions || "").trim();

    const articleUrl =
      String(body.articleUrl || "").trim();

    const rewardNaira =
      Number(body.rewardNaira);

    const maxCompletions =
      body.maxCompletions
        ? Number(body.maxCompletions)
        : null;

    const startsAt =
      body.startsAt
        ? new Date(body.startsAt)
        : null;

    const endsAt =
      body.endsAt
        ? new Date(body.endsAt)
        : null;

    const isActive =
      body.active !== false;

    if (!title) {
      return NextResponse.json(
        {
          success: false,
          error: "Task title is required.",
        },
        { status: 400 }
      );
    }

    if (!instructions) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Task instructions are required.",
        },
        { status: 400 }
      );
    }

    if (
      !Number.isFinite(rewardNaira) ||
      rewardNaira <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Enter a valid task reward.",
        },
        { status: 400 }
      );
    }

    if (
      maxCompletions !== null &&
      (!Number.isInteger(maxCompletions) ||
        maxCompletions < 1)
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Maximum completions must be a positive whole number.",
        },
        { status: 400 }
      );
    }

    if (type === "ARTICLE" && !articleUrl) {
      return NextResponse.json(
        {
          success: false,
          error:
            "THE INDEX article URL is required for article tasks.",
        },
        { status: 400 }
      );
    }

    if (
      startsAt &&
      Number.isNaN(startsAt.getTime())
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid start date/time.",
        },
        { status: 400 }
      );
    }

    if (
      endsAt &&
      Number.isNaN(endsAt.getTime())
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid end date/time.",
        },
        { status: 400 }
      );
    }

    if (
      startsAt &&
      endsAt &&
      endsAt <= startsAt
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "End date/time must be after the start date/time.",
        },
        { status: 400 }
      );
    }

    const rewardKobo = Math.round(
      rewardNaira * 100
    );

    const tasks =
      await prisma.$queryRaw`
        INSERT INTO pitnex_tasks (
          type,
          title,
          instructions,
          article_url,
          reward_kobo,
          max_completions,
          starts_at,
          ends_at,
          is_active
        )
        VALUES (
          ${type},
          ${title},
          ${instructions},
          ${type === "ARTICLE"
            ? articleUrl
            : null},
          ${rewardKobo},
          ${maxCompletions},
          ${startsAt},
          ${endsAt},
          ${isActive}
        )
        RETURNING
          id,
          type,
          title,
          reward_kobo,
          is_active,
          starts_at,
          ends_at
      `;

    return NextResponse.json(
      {
        success: true,
        message:
          "Task created successfully.",
        task: tasks[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Admin task creation error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to create task.",
      },
      { status: 500 }
    );
  }
}