import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: "No screenshot was provided.",
        },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        {
          success: false,
          error: "Only image screenshots are allowed.",
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: "Screenshot must be 5MB or smaller.",
        },
        { status: 400 }
      );
    }

    const extension =
      file.name.split(".").pop() || "jpg";

    const filename = `pitnex/proofs/${crypto.randomUUID()}.${extension}`;

    const blob = await put(
      filename,
      file,
      {
        access: "private",
      }
    );

    return NextResponse.json({
      success: true,
      url: blob.url,
    });
  } catch (error) {
    console.error(
      "Screenshot upload error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to upload screenshot.",
      },
      { status: 500 }
    );
  }
}