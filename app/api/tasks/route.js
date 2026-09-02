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

    /*
     * Count everything already assigned to this
     * user today. PENDING and COMPLETED both
     * consume today's six-task allowance.
     */
    const dailyCount = await prisma.$queryRaw`
      SELECT COUNT(*)::int AS count
      FROM pitnex_user_tasks
      WHERE user_id = ${user.id}::uuid
        AND assigned_date = CURRENT_DATE
        AND status IN ('PENDING', 'COMPLETED')
    `;

    const assignedToday =
      Number(dailyCount[0]?.count || 0);

    /*
     * If the user already has six tasks today,
     * return no additional tasks.
     */
    if (assignedToday >= MAX_DAILY_TASKS) {
      return NextResponse.json({
        success: true,
        tasks: [],
        dailyLimit: MAX_DAILY_TASKS,
        completedToday: assignedToday,
        remainingToday: 0,
      });
    }

    const remaining =
      MAX_DAILY_TASKS - assignedToday;

    /*
     * Find active tasks that:
     *
     * 1. Are currently available.
     * 2. Have not already been assigned to this user.
     * 3. Have not exceeded their global completion limit.
     *
     * THE INDEX article tasks are included automatically
     * because they are stored in pitnex_tasks as ARTICLE tasks.
     */
    const candidateTasks =
      await prisma.$queryRaw`
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
          t.created_at
        FROM pitnex_tasks t
        WHERE t.is_active = true

          AND (
            t.starts_at IS NULL
            OR t.starts_at <= NOW()
          )

          AND (
            t.ends_at IS NULL
            OR t.ends_at >= NOW()
          )

          AND NOT EXISTS (
            SELECT 1
            FROM pitnex_user_tasks previous
            WHERE previous.user_id = ${user.id}::uuid
              AND previous.task_id = t.id
          )

          AND (
            t.max_completions IS NULL

            OR (
              SELECT COUNT(*)
              FROM pitnex_user_tasks completed
              WHERE completed.task_id = t.id
                AND completed.status IN (
                  'PENDING',
                  'COMPLETED'
                )
            ) < t.max_completions
          )

        ORDER BY t.created_at DESC
        LIMIT ${remaining}
      `;

    /*
     * Assign the selected tasks to this user.
     *
     * The assignment is what makes the six-task
     * daily system persistent instead of simply
     * showing the first six active tasks.
     */
    for (const task of candidateTasks) {
      await prisma.$executeRaw`
        INSERT INTO pitnex_user_tasks (
          user_id,
          task_id,
          status,
          assigned_date
        )
        VALUES (
          ${user.id}::uuid,
          ${task.id}::uuid,
          'AVAILABLE',
          CURRENT_DATE
        )
        ON CONFLICT DO NOTHING
      `;
    }

    /*
     * Return only this user's tasks for today.
     */
    const assignedTasks =
      await prisma.$queryRaw`
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
          ut.status,
          ut.assigned_date
        FROM pitnex_user_tasks ut
        INNER JOIN pitnex_tasks t
          ON t.id = ut.task_id
        WHERE ut.user_id = ${user.id}::uuid
          AND ut.assigned_date = CURRENT_DATE
          AND t.is_active = true
          AND ut.status = 'AVAILABLE'

        ORDER BY ut.id ASC
        LIMIT ${remaining}
      `;

    return NextResponse.json({
      success: true,
      tasks: assignedTasks,
      dailyLimit: MAX_DAILY_TASKS,
      completedToday: assignedToday,
      remainingToday: Math.max(
        0,
        MAX_DAILY_TASKS -
          assignedToday
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

    const body =
      await request.json();

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
      Math.round(
        Number(rewardNaira) * 100
      );

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
      (!Number.isInteger(max) ||
        max < 1)
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
          ${title.trim()},
          ${instructions?.trim() || null},
          ${articleUrl?.trim() || null},
          ${rewardKobo},
          ${max},
          ${
            startsAt
              ? new Date(startsAt)
              : null
          },
          ${
            endsAt
              ? new Date(endsAt)
              : null
          },
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
        message:
          "Task created successfully.",
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