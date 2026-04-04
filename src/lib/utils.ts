import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 画像URLを正規化・最適化するユーティリティ。
 * Google Drive リンクの変換や Cloudinary PDF サムネイルの生成を行う。
 */
export function getDisplayImageUrl(url: string | undefined): string {
  if (!url) return "";
  
  let processedUrl = url;

  // 1. Google Drive リンクの変換
  // 直接画像として埋め込み可能な形式 (uc?export=view&id=...) に変換
  if (url.includes('drive.google.com')) {
    const match = url.match(/\/d\/(.+?)\//) || url.match(/id=(.+?)(&|$)/);
    if (match && match[1]) {
      const fileId = match[1];
      // プレビューではなく、生の画像データを取得するエンドポイントへ換装
      processedUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
    }
  }

  // 2. Cloudinary PDF サムネイル変換
  // PDF URL の末尾を .jpg に変えることで、Cloudinary が 1 ページ目のサムネイルを返す
  if (url.toLowerCase().endsWith('.pdf') && url.includes('res.cloudinary.com')) {
    processedUrl = url.replace(/\.pdf$/i, '.jpg');
  }

  return processedUrl;
}
