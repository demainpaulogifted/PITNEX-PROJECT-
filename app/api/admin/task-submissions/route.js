import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEVELOPMENT_USER_ID =
  process.env.DEVELOPMENT_USER_ID;

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL;

const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

const BUCKET = "pitnex-proofs";

async function getSignedProofUrl(
  proofPath
) {
  if (
    !proofPath ||
    !SUPABASE_URL ||
    !SUPABASE_SERVICE_ROLE_KEY
  ) {
    return null;
  }

  const cleanPath =
    proofPath.startsWith(
      `${BUCKET}/`
    )
      ? proofPath.slice(
          BUCKET.length + 1
        )
      : proofPath;

  const response = await fetch(
    `${SUPABASE_URL}/storage/v1/object/sign/${BUCKET}/${cleanPath}`,
    {
      method: "POST",
      headers: {
        Authorization:
          `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        apikey:
          SUPABASE_SERVICE_ROLE_KEY,
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        expiresIn: 3600,
      }),
    }
  );

  if (!response.ok) {
    console.error(
      "Unable to create proof signed URL:",
      await response.text()
    );

    return null;
  }

  const data =
    await response.json();

  if (!data.signedURL) {
    return null;
  }

  return data.signedURL.startsWith(
    "http"
  )
    ? data.signedURL
    : `${SUPABASE_URL}/storage/v1${data.signedURL}`;
}

export async function GET() {
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

    const submissions =
      await prisma.$queryRaw`
        SELECT
          ut.id,
          ut.user_id,
          ut.task_id,
          ut.status,
          ut.proof_image_url,
          ut.submitted_at,
          t.title AS task_title,
          t.reward_kobo,
          p.email AS user_email
        FROM pitnex_user_tasks ut
        INNER JOIN pitnex_tasks t
          ON t.id = ut.task_id
        LEFT JOIN pitnex_profiles p
          ON p.id = ut.user_id
        WHERE ut.status = 'PENDING'
        ORDER BY ut.submitted_at ASC
      `;

    const result = [];

    for (const submission of submissions) {
      const proofUrl =
        await getSignedProofUrl(
          submission.proof_image_url
        );

      result.push({
        id: submission.id,
        user_id:
          submission.user_id,
        task_id:
          submission.task_id,
        status:
          submission.status,
        submitted_at:
          submission.submitted_at,
        task_title:
          submission.task_title,
        reward_kobo:
          submission.reward_kobo?.toString?.() ??
          submission.reward_kobo,
        user_email:
          submission.user_email,
        proof_url:
          proofUrl,
      });
    }

    return NextResponse.json({
      success: true,
      submissions: result,
    });
  } catch (error) {
    console.error(
      "Admin submissions GET error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to load task submissions.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
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

    const body =
      await request.json();

    const submissionId =
      body.submissionId;

    const action =
      body.action;

    if (!submissionId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Submission ID is required.",
        },
        { status: 400 }
      );
    }

    if (
      action !== "APPROVE" &&
      action !== "REJECT"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid review action.",
        },
        { status: 400 }
      );
    }

    const result =
      await prisma.$transaction(
        async (tx) => {
          const rows =
            await tx.$queryRaw`
              SELECT
                ut.id,
                ut.user_id,
                ut.task_id,
                ut.status,
                t.title,
                t.reward_kobo
              FROM pitnex_user_tasks ut
              INNER JOIN pitnex_tasks t
                ON t.id = ut.task_id
              WHERE ut.id =
                ${submissionId}::uuid
              FOR UPDATE
            `;

          if (!rows.length) {
            throw new Error(
              "SUBMISSION_NOT_FOUND"
            );
          }

          const submission =
            rows[0];

          if (
            submission.status !==
            "PENDING"
          ) {
            throw new Error(
              "SUBMISSION_ALREADY_REVIEWED"
            );
          }

          if (
            action === "REJECT"
          ) {
            await tx.$executeRaw`
              UPDATE pitnex_user_tasks
              SET
                status = 'REJECTED',
                reviewed_at = NOW()
              WHERE id =
                ${submissionId}::uuid
                AND status = 'PENDING'
            `;

            return {
              action: "REJECTED",
              rewardKobo: 0,
            };
          }

          const walletRows =
            await tx.$queryRaw`
              SELECT
                id,
                balance_kobo,
                lifetime_earned_kobo
              FROM pitnex_wallets
              WHERE user_id =
                ${submission.user_id}::uuid
              FOR UPDATE
            `;

          let walletId;
          let currentBalance = 0n;
          let lifetimeEarned = 0n;

          if (walletRows.length) {
            walletId =
              walletRows[0].id;

            currentBalance =
              BigInt(
                walletRows[0]
                  .balance_kobo
              );

            lifetimeEarned =
              BigInt(
                walletRows[0]
                  .lifetime_earned_kobo
              );
          } else {
            const created =
              await tx.$queryRaw`
                INSERT INTO pitnex_wallets (
                  user_id,
                  balance_kobo,
                  lifetime_earned_kobo,
                  lifetime_withdrawn_kobo
                )
                VALUES (
                  ${submission.user_id}::uuid,
                  0,
                  0,
                  0
                )
                RETURNING id
              `;

            walletId =
              created[0].id;
          }

          const rewardKobo =
            BigInt(
              submission.reward_kobo
            );

          const newBalance =
            currentBalance +
            rewardKobo;

          const newLifetimeEarned =
            lifetimeEarned +
            rewardKobo;

          await tx.$executeRaw`
            UPDATE pitn_wallets
            SET
              balance_kobo =
                ${newBalance},
              lifetime_earned_kobo =
                ${newLifetimeEarned},
              updated_at = NOW()
            WHERE id =
              ${walletId}::uuid
          `;

          const reference =
            `TASK-${submission.id}`;

          await tx.$executeRaw`
            INSERT INTO pitnex_wallet_transactions (
              user_id,
              wallet_id,
              type,
              status,
              amount_kobo,
              reference,
              description,
              metadata
            )
            VALUES (
              ${submission.user_id}::uuid,
              ${walletId}::uuid,
              'TASK_REWARD',
              'COMPLETED',
              ${rewardKobo},
              ${reference},
              ${`Task reward: ${submission.title}`},
              ${JSON.stringify({
                taskId:
                  submission.task_id,
                submissionId:
                  submission.id,
              })}::jsonb
            )
          `;

          await tx.$executeRaw`
            UPDATE pitnex_user_tasks
            SET
              status = 'COMPLETED',
              reviewed_at = NOW(),
              completed_at = NOW()
            WHERE id =
              ${submissionId}::uuid
              AND status = 'PENDING'
          `;

          return {
            action: "APPROVED",
            rewardKobo:
              rewardKobo.toString(),
          };
        }
      );

    return NextResponse.json({
      success: true,
      message:
        result.action ===
        "APPROVED"
          ? "Submission approved and wallet credited."
          : "Submission rejected.",
      ...result,
    });
  } catch (error) {
    console.error(
      "Admin submission review error:",
      error
    );

    if (
      error.message ===
      "SUBMISSION_NOT_FOUND"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Submission not found.",
        },
        { status: 404 }
      );
    }

    if (
      error.message ===
      "SUBMISSION_ALREADY_REVIEWED"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This submission has already been reviewed.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to review submission.",
      },
      { status: 500 }
    );
  }
}