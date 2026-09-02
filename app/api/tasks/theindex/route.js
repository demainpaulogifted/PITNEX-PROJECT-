import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_REWARD_KOBO = 5000; // ₦50
const DEFAULT_MAX_COMPLETIONS = 1000;

export async function POST(request) {
  try {
    // ─────────────────────────────────────────────
    // 1. Protect the endpoint
    // ─────────────────────────────────────────────
    const secret = request.headers.get("x-pitnex-secret");

    if (!secret || secret !== process.env.PITNEX_TASK_SECRET) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // ─────────────────────────────────────────────
    // 2. Parse body
    // ─────────────────────────────────────────────
    const body = await request.json();

    const title = body?.title?.trim();
    const slug = body?.slug?.trim();
    const excerpt = body?.excerpt?.trim() || "";
    const featuredImage = body?.featured_image?.trim() || null;
    const publishedAt = body?.published_at || null;

    if (!title || !slug) {
      return NextResponse.json(
        {
          success: false,
          error: "Article title and slug are required.",
        },
        { status: 400 }
      );
    }

    const articleUrl = `https://theindex.name.ng/posts/${encodeURIComponent(
      slug
    )}`;

    // ─────────────────────────────────────────────
    // 3. Check if this article task already exists
    // ─────────────────────────────────────────────
    const existing = await prisma.$queryRaw`
      SELECT id
      FROM pitnex_tasks
      WHERE article_url = ${articleUrl}
      LIMIT 1
    `;

    if (existing.length > 0) {
      return NextResponse.json({
        success: true,
        created: false,
        taskId: existing[0].id,
        articleUrl,
        message: "This THE INDEX article task already exists.",
      });
    }

    // ─────────────────────────────────────────────
    // 4. Create the ARTICLE task
    // ─────────────────────────────────────────────
    const startsAt = publishedAt ? new Date(publishedAt) : new Date();

    const result = await prisma.$queryRaw`
      INSERT INTO pitnex_tasks (
        type,
        title,
        instructions,
        article_url,
        reward_kobo,
        max_completions,
        starts_at,
        is_active
      )
      VALUES (
        'ARTICLE',
        ${`Read: ${title}`},
        ${excerpt || `Read this article on THE INDEX: ${title}`},
        ${articleUrl},
        ${DEFAULT_REWARD_KOBO},
        ${DEFAULT_MAX_COMPLETIONS},
        ${startsAt},
        true
      )
      RETURNING id, article_url
    `;

    const task = result[0];

    return NextResponse.json({
      success: true,
      created: true,
      taskId: task.id,
      articleUrl: task.article_url,
      message: "THE INDEX article task created successfully.",
    });
  } catch (error) {
    console.error("THE INDEX task creation error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Unable to create THE INDEX task.",
      },
      { status: 500 }
    );
  }
}