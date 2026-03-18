import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

/**
 * サーバーサイド中継アップロードAPI
 * セキュリティのため、デバッグ用の環境変数チェックログをパージ。
 */
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dl2yqrpfj",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    if (!process.env.CLOUDINARY_API_SECRET) {
      throw new Error("Infrastructure missing: SECRET");
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "newspaper_archive",
          upload_preset: "hokkai gakuen news cloud",
          resource_type: "auto",
          pages: true,
          use_filename: true,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Upload process failed" }, { status: 500 });
  }
}
