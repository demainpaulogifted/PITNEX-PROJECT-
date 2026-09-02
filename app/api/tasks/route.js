import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase-server";

const MAX_DAILY_TASKS = 6;

export async function GET() {
  try {
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
          error: "You must be logged in.",
        },
        { status: 401 }
      );
    }

    const tasks = await prisma.$queryRaw`
      SELECT
        t.id,
        t.title,
        t.type,
        t.instructions,
        t.article_url,
        t.reward_kobo,
        t.max_completions,
        t.starts_at,
        t.ends_at,
        t.is_active,
        COALESCE(ut.status, 'AVAILABLE') AS status
      FROM pitnex_tasks t
      LEFT JOIN pitnex_user_tasks ut
        ON ut.task_id = t.id
        AND ut.user_id = ${user.id}::uuid
      WHERE t.is_active = true
        AND (
          t.starts_at IS NULL
          OR t.starts_at <= NOW()
        )
        AND (
          t.ends_at IS NULL
          OR t.ends_at >= NOW()
        )
      ORDER BY t.created_at DESC
    `;

    const dailyCount = await prisma.$queryRaw`
      SELECT COUNT(*)::int AS count
      FROM pitnex_user_tasks
      WHERE user_id = ${user.id}::uuid
        AND assigned_date = CURRENT_DATE
        AND status IN (
          'PENDING',
          'COMPLETED'
        )
    `;

    const completedToday =
      Number(dailyCount[0]?.count || 0);

    const availableTasks = tasks
      .filter(
        (task) =>
          task.status === "AVAILABLE"
      )
      .slice(
        0,
        Math.max(
          0,
          MAX_DAILY_TASKS -
            completedToday
        )
      );

    return NextResponse.json({
      success: true,
      tasks: availableTasks,
      dailyLimit: MAX_DAILY_TASKS,
      completedToday,
      remainingToday: Math.max(
        0,
        MAX_DAILY_TASKS -
          completedToday
      ),
    });
  } catch (error) {
    console.error(
      "PITNEX tasks GET error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to load available tasks.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      type = "ARTICLE",
      title,
      instructions,
      articleUrl,
      rewardNaira = 180,
      maxCompletions,
      startsAt,
      endsAt,
      active = true,
    } = body;

    if (!title?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Task title is required.",
        },
        { status: 400 }
      );
    }

    if (
      type === "ARTICLE" &&
      !articleUrl?.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Article URL is required for article tasks.",
        },
        { status: 400 }
      );
    }

    const rewardKobo =
      Math.round(Number(rewardNaira) * 100);

    if (
      !Number.isFinite(rewardKobo) ||
      rewardKobo <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid task reward.",
        },
        { status: 400 }
      );
    }

    const max =
      maxCompletions === "" ||
      maxCompletions == null
        ? null
        : Number(maxCompletions);

    if (
      max !== null &&
      (!Number.isInteger(max) || max < 1)
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

    const tasks = await prisma.$queryRaw`
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
        ${title.trim()},
        ${instructions?.trim() || null},
        ${articleUrl?.trim() || null},
        ${rewardKobo},
        ${max},
        ${startsAt ? new Date(startsAt) : null},
        ${endsAt ? new Date(endsAt) : null},
        ${Boolean(active)}
      )
      RETURNING
        id,
        type,
        title,
        instructions,
        article_url,
        reward_kobo,
        max_completions,
        starts_at,
        ends_at,
        is_active,
        created_at
    `;

    return NextResponse.json(
      {
        success: true,
        message: "Task created successfully.",
        task: tasks[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "PITNEX task creation error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Unable to create task.",
      },
      { status: 500 }
    );
  }
}