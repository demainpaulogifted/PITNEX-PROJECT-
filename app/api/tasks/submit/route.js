import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEVELOPMENT_USER_ID =
  process.env.DEVELOPMENT_USER_ID;

export async function POST(request) {
  try {
    const body = await request.json();

    const taskId = body.taskId;
    const proofImageUrl =
      body.proofImageUrl || null;

    if (!taskId) {
      return NextResponse.json(
        {
          success: false,
          error: "Task ID is required.",
        },
        { status: 400 }
      );
    }

    if (!DEVELOPMENT_USER_ID) {
      return NextResponse.json(
        {
          success: false,
          error:
            "PITNEX user authentication is not configured yet.",
        },
        { status: 503 }
      );
    }

    const tasks = await prisma.$queryRaw`
      SELECT
        id,
        title,
        reward_kobo,
        is_active
      FROM pitnex_tasks
      WHERE id = ${taskId}::uuid
      LIMIT 1
    `;

    if (!tasks.length) {
      return NextResponse.json(
        {
          success: false,
          error: "Task not found.",
        },
        { status: 404 }
      );
    }

    const task = tasks[0];

    if (!task.is_active) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This task is no longer available.",
        },
        { status: 400 }
      );
    }

    const existing = await prisma.$queryRaw`
      SELECT
        id,
        status
      FROM pitnex_user_tasks
      WHERE user_id =
        ${DEVELOPMENT_USER_ID}::uuid
        AND task_id =
        ${taskId}::uuid
      LIMIT 1
    `;

    if (existing.length) {
      const status = existing[0].status;

      if (status === "COMPLETED") {
        return NextResponse.json(
          {
            success: false,
            error:
              "You have already completed this task.",
          },
          { status: 409 }
        );
      }

      if (status === "PENDING") {
        return NextResponse.json(
          {
            success: false,
            error:
              "This task is already pending review.",
          },
          { status: 409 }
        );
      }

      await prisma.$executeRaw`
        UPDATE pitnex_user_tasks
        SET
          status = 'PENDING',
          proof_image_url = ${proofImageUrl},
          submitted_at = NOW()
        WHERE id =
          ${existing[0].id}::uuid
      `;
    } else {
      await prisma.$executeRaw`
        INSERT INTO pitnex_user_tasks (
          user_id,
          task_id,
          status,
          proof_image_url,
          submitted_at
        )
        VALUES (
          ${DEVELOPMENT_USER_ID}::uuid,
          ${taskId}::uuid,
          'PENDING',
          ${proofImageUrl},
          NOW()
        )
      `;
    }

    return NextResponse.json({
      success: true,
      message:
        "Proof submitted successfully.",
      status: "PENDING",
      rewardNaira:
        Number(task.reward_kobo) / 100,
    });
  } catch (error) {
    console.error(
      "Task submission error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to submit task proof.",
      },
      { status: 500 }
    );
  }
}