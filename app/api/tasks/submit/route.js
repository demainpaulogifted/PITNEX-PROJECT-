import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEVELOPMENT_USER_ID =
  process.env.DEVELOPMENT_USER_ID;

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL;

const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

const BUCKET = "pitnex-proofs";

export async function POST(request) {
  try {
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

    if (
      !SUPABASE_URL ||
      !SUPABASE_SERVICE_ROLE_KEY
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Supabase Storage is not configured.",
        },
        { status: 503 }
      );
    }

    const formData =
      await request.formData();

    const taskId =
      formData.get("taskId");

    const proofFile =
      formData.get("proof");

    if (!taskId) {
      return NextResponse.json(
        {
          success: false,
          error: "Task ID is required.",
        },
        { status: 400 }
      );
    }

    if (
      !proofFile ||
      typeof proofFile === "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Screenshot proof is required.",
        },
        { status: 400 }
      );
    }

    if (
      !proofFile.type ||
      !proofFile.type.startsWith("image/")
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Proof must be an image.",
        },
        { status: 400 }
      );
    }

    if (proofFile.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Screenshot must be 10MB or smaller.",
        },
        { status: 400 }
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
        status,
        proof_image_url
      FROM pitnex_user_tasks
      WHERE user_id =
        ${DEVELOPMENT_USER_ID}::uuid
        AND task_id =
        ${taskId}::uuid
      LIMIT 1
    `;

    if (existing.length) {
      const status =
        existing[0].status;

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
    }

    const extension =
      proofFile.name
        ?.split(".")
        .pop()
        ?.toLowerCase()
        .replace(/[^a-z0-9]/g, "") ||
      "jpg";

    const filePath =
      `${DEVELOPMENT_USER_ID}/${taskId}-${Date.now()}.${extension}`;

    const fileBuffer =
      Buffer.from(
        await proofFile.arrayBuffer()
      );

    const uploadResponse =
      await fetch(
        `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${filePath}`,
        {
          method: "POST",
          headers: {
            Authorization:
              `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            apikey:
              SUPABASE_SERVICE_ROLE_KEY,
            "Content-Type":
              proofFile.type,
            "x-upsert": "false",
          },
          body: fileBuffer,
        }
      );

    if (!uploadResponse.ok) {
      const uploadError =
        await uploadResponse.text();

      console.error(
        "Supabase proof upload failed:",
        uploadError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to upload screenshot proof.",
        },
        { status: 500 }
      );
    }

    /*
     * Keep the storage path rather than making
     * the proof publicly accessible.
     *
     * Admin review can generate a signed URL later.
     */
    const proofImageUrl =
      `${BUCKET}/${filePath}`;

    if (existing.length) {
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