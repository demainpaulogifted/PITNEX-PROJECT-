import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const ADMIN_EMAIL = "paulotubo9@gmail.com";

export async function POST(request) {
  try {
    const body = await request.json();

    /*
     * Temporary admin identity bridge.
     *
     * The production authentication layer will replace
     * this email check with the authenticated server session.
     */
    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : ADMIN_EMAIL;

    if (email !== ADMIN_EMAIL) {
      return NextResponse.json(
        {
          success: false,
          error: "Administrator access required.",
        },
        { status: 403 }
      );
    }

    const title =
      typeof body.title === "string"
        ? body.title.trim()
        : "";

    const instructions =
      typeof body.instructions === "string"
        ? body.instructions.trim()
        : "";

    const type =
      body.type === "CUSTOM"
        ? "CUSTOM"
        : "ARTICLE";

    const articleUrl =
      typeof body.articleUrl === "string" &&
      body.articleUrl.trim()
        ? body.articleUrl.trim()
        : null;

    const rewardNaira =
      Number(body.rewardNaira);

    const active =
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
      type === "ARTICLE" &&
      !articleUrl
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Article URL is required for an article task.",
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
            "Reward must be greater than zero.",
        },
        { status: 400 }
      );
    }

    /*
     * PITNEX stores money in kobo.
     *
     * ₦180 = 18,000 kobo
     */
    const rewardKobo = BigInt(
      Math.round(rewardNaira * 100)
    );

    /*
     * Store the task instructions together with
     * the task title in the existing task structure.
     *
     * We intentionally use the existing pitnex_tasks
     * table instead of assuming a Prisma PitnexTask model.
     */
    const taskTitle = instructions
      ? `${title}\n\n${instructions}`
      : title;

    const result = await prisma.$queryRaw`
      INSERT INTO pitnex_tasks (
        title,
        article_url,
        reward_kobo,
        is_active
      )
      VALUES (
        ${taskTitle},
        ${articleUrl},
        ${rewardKobo},
        ${active}
      )
      RETURNING
        id,
        title,
        article_url,
        reward_kobo,
        is_active
    `;

    const task = result[0];

    return NextResponse.json(
      {
        success: true,
        message: "Task created successfully.",
        task: {
          id: task.id,
          title: task.title,
          type,
          articleUrl: task.article_url,
          rewardNaira:
            Number(task.reward_kobo) / 100,
          active: task.is_active,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "PITNEX admin task creation error:",
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