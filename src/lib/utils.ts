import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 画像URLを正規化・最適化するユーティリティ。
 * Google Drive リンクの変換や Cloudinary PDF サムネイルの生成を行う。
 */
export function getDisplayImageUrl(url: string | undefined | null): string {
  if (!url || typeof url !== 'string') return "";
  
  let processedUrl = url;

  // 1. Google Drive リンクの変換
  if (url.includes('drive.google.com')) {
    const match = url.match(/\/d\/(.+?)\//) || url.match(/id=(.+?)(&|$)/);
    if (match && match[1]) {
      const fileId = match[1];
      processedUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
    }
  }

  // 2. Cloudinary PDF サムネイル変換
  if (url.toLowerCase().endsWith('.pdf') && url.includes('res.cloudinary.com')) {
    processedUrl = url.replace(/\.pdf$/i, '.jpg');
  }

  return processedUrl;
}
