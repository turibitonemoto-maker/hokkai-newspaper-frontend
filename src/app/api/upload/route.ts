import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

/**
 * サーバーサイド中継アップロードAPI
 */
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dl2yqrpfj",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    // インフラストラクチャの整合性確認
    if (!process.env.CLOUDINARY_API_SECRET || !process.env.CLOUDINARY_API_KEY) {
      return NextResponse.json({ 
        success: false, 
        error: "Server configuration missing: Cloudinary credentials" 
      }, { status: 500 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ 
        success: false, 
        error: "No file provided in the request" 
      }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Cloudinary へのアップロード実行
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
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      uploadStream.end(buffer);
    });

    if (!result) {
      throw new Error("Cloudinary returned an empty response");
    }

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error("Upload API Critical Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Internal upload process failed" 
    }, { status: 500 });
  }
}
