import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEVELOPMENT_USER_ID =
  process.env.DEVELOPMENT_USER_ID;

export async function GET() {
  try {
    if (!DEVELOPMENT_USER_ID) {
      return NextResponse.json(
        {
          success: false,
          error: "Development user is not configured."
        },
        { status: 500 }
      );
    }

    const tasks = await prisma.$queryRaw`
      SELECT
        t.id,
        t.title,
        t.article_url,
        t.reward_kobo,
        t.is_active
      FROM pitnex_tasks t
      WHERE t.is_active = true
      ORDER BY t.created_at DESC
      LIMIT 20
    `;

    const userTasks = await prisma.$queryRaw`
      SELECT
        ut.task_id,
        ut.status
      FROM pitnex_user_tasks ut
      WHERE ut.user_id = ${DEVELOPMENT_USER_ID}::uuid
    `;

    const statusMap = new Map(
      userTasks.map((item) => [
        String(item.task_id),
        item.status
      ])
    );

    const formattedTasks = tasks.map((task) => ({
      id: String(task.id),
      title: task.title,
      articleUrl: task.article_url,
      rewardNaira:
        Number(task.reward_kobo) / 100,
      status:
        statusMap.get(String(task.id)) ||
        "AVAILABLE"
    }));

    return NextResponse.json({
      success: true,
      tasks: formattedTasks
    });
  } catch (error) {
    console.error("Tasks API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to load tasks."
      },
      { status: 500 }
    );
  }
}