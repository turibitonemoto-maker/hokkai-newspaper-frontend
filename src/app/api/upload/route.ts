import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

/**
 * サーバーサイド中継アップロードAPI
 * 最新のAPI Key "217388631115892" を環境変数から読み取り、
 * ブラウザから画像を受け取り、秘密鍵を使用してCloudinaryへ物理的に転送します。
 */
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dl2yqrpfj",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // ファイルをバッファに変換
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Cloudinaryへサーバー側から物理的にアップロード
    const result: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "newspaper_archive",
          upload_preset: "hokkai gakuen news cloud", // Unsignedプリセット名
          use_filename: true,
          transformation: [{ quality: "auto", fetch_format: "auto" }],
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
