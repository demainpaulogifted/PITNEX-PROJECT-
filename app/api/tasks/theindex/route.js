import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_REWARD_KOBO = 5000;
const DEFAULT_MAX_COMPLETIONS = 1000;

export async function POST(request) {
  try {
    const body = await request.json();

    const title = body?.title?.trim();
    const slug = body?.slug?.trim();
    const excerpt = body?.excerpt?.trim() || "";
    const featuredImage =
      body?.featured_image?.trim() || "";
    const publishedAt =
      body?.published_at || null;

    if (!title || !slug) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Article title and slug are required.",
        },
        { status: 400 }
      );
    }

    const articleUrl =
      `https://theindex.name.ng/posts/${encodeURIComponent(
        slug
      )}`;

    /*
     * One PITNEX ARTICLE task per THE INDEX article.
     */
    const existing =
      await prisma.pitnexTask.findFirst({
        where: {
          articleUrl,
        },
      });

    if (existing) {
      return NextResponse.json({
        success: true,
        created: false,
        taskId: existing.id,
        articleUrl,
        message:
          "This THE INDEX article task already exists.",
      });
    }

    /*
     * Create the article inside the existing
     * PITNEX task system.
     *
     * IMPORTANT:
     * Keep using Prisma here because pitnexTask
     * is already defined in your Prisma client.
     * We are NOT changing Prisma schema.
     */
    const task =
      await prisma.pitnexTask.create({
        data: {
          title: `Read: ${title}`,

          description:
            excerpt ||
            `Read this article on THE INDEX: ${title}`,

          type: "ARTICLE",

          rewardKobo:
            DEFAULT_REWARD_KOBO,

          articleUrl,

          articleTitle: title,

          articleImage:
            featuredImage || null,

          maxCompletions:
            DEFAULT_MAX_COMPLETIONS,

          startsAt:
            publishedAt
              ? new Date(publishedAt)
              : new Date(),

          active: true,
        },
      });

    return NextResponse.json({
      success: true,
      created: true,
      taskId: task.id,
      articleUrl,
      message:
        "THE INDEX article task created successfully.",
    });
  } catch (error) {
    console.error(
      "THE INDEX task creation error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error?.message ||
          "Unable to create THE INDEX task.",
      },
      { status: 500 }
    );
  }
}