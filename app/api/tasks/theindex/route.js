import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      title,
      slug,
      excerpt = "",
      featured_image = "",
      published_at,
    } = body;

    if (!title || !slug) {
      return NextResponse.json(
        {
          success: false,
          error: "Article title and slug are required.",
        },
        { status: 400 }
      );
    }

    const articleUrl = `https://theindex.name.ng/posts/${slug}`;

    // Prevent duplicate ARTICLE tasks for the same article.
    const existing = await prisma.pitnexTask.findFirst({
      where: {
        articleUrl,
      },
    });

    if (existing) {
      return NextResponse.json({
        success: true,
        created: false,
        taskId: existing.id,
        message: "This THE INDEX article task already exists.",
      });
    }

    const task = await prisma.pitnexTask.create({
      data: {
        title: `Read: ${title}`,
        description:
          excerpt ||
          `Read this article on THE INDEX: ${title}`,
        type: "ARTICLE",
        rewardKobo: 5000,
        articleUrl,
        articleTitle: title,
        articleImage: featured_image || null,
        maxCompletions: 1000,
        startsAt: published_at
          ? new Date(published_at)
          : new Date(),
        active: true,
      },
    });

    return NextResponse.json({
      success: true,
      created: true,
      taskId: task.id,
      articleUrl,
      message: "THE INDEX article task created successfully.",
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