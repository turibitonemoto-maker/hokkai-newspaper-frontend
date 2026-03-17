
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

/**
 * サーバーサイド中継アップロードAPI (PDF・画像統合版)
 * 秘密鍵 CLOUDINARY_API_SECRET を環境変数から読み取り、
 * ブラウザに秘密情報を一切漏らさず Cloudinary へ物理的に転送します。
 */
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dl2yqrpfj",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  // --- INFRASTRUCTURE CHECK ---
  console.log("--- CLOUDINARY PDF/IMAGE INFRASTRUCTURE CHECK ---");
  console.log("CLOUD_NAME:", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? "✅ OK" : "❌ NG");
  console.log("API_KEY:   ", process.env.CLOUDINARY_API_KEY ? "✅ OK" : "❌ NG");
  console.log("API_SECRET:", process.env.CLOUDINARY_API_SECRET ? "✅ OK (Loaded)" : "❌ NG (Missing in .env.local)");
  console.log("---------------------------------------");

  try {
    if (!process.env.CLOUDINARY_API_SECRET) {
      throw new Error("CLOUDINARY_API_SECRET is not defined in environment variables.");
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    // ファイルをバッファに変換
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Cloudinaryへサーバー側から物理的にアップロード (PDF対応のため resource_type: "auto")
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
          if (error) {
            console.error("Cloudinary upload internal error:", error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      uploadStream.end(buffer);
    });

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error("Server-side upload process failed:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
