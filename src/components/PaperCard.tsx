'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FileImage, FileText, Layers } from 'lucide-react';
import { useMemo } from 'react';
import { getDisplayImageUrl } from '@/lib/utils';

/**
 * 紙面物理サムネイル・コンポーネント (画像表示正常化版)
 */
interface PaperCardProps {
  article: {
    id: string;
    title: string;
    issueNumber?: string;
    publishDate: string;
    mainImageUrl?: string;
    pdfUrl?: string;
    paperImages?: string[];
  };
}

export function PaperCard({ article }: PaperCardProps) {
  // 画像URLの正規化を適用
  const displayImage = useMemo(() => {
    if (article.pdfUrl) {
      return getDisplayImageUrl(article.pdfUrl);
    }
    if (article.paperImages && article.paperImages.length > 0) {
      return getDisplayImageUrl(article.paperImages[0]);
    }
    return getDisplayImageUrl(article.mainImageUrl);
  }, [article.pdfUrl, article.paperImages, article.mainImageUrl]);

  const pageCount = article.paperImages?.length || 0;
  const isPdf = !!article.pdfUrl;

  return (
    <Link href={`/articles/${article.id}`} className="group block text-center">
      <div className="relative aspect-[1/1.414] w-full rounded-sm overflow-hidden border border-slate-200 bg-white shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:ring-2 group-hover:ring-primary/20">
        {displayImage ? (
          <Image
            src={displayImage}
            alt={article.title}
            fill
            sizes="(max-width: 640px) 50vw, 250px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized={displayImage.includes('drive.google.com')}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-slate-50 text-slate-300 gap-2">
            <FileImage size={32} strokeWidth={1} />
            <span className="text-[10px] font-black uppercase tracking-widest">No Image</span>
          </div>
        )}
        
        {isPdf ? (
          <div className="absolute bottom-2 right-2 bg-slate-900/80 text-white text-[9px] font-black px-2 py-1 rounded-sm backdrop-blur-sm flex items-center gap-1">
            <FileText size={10} /> PDF ARCHIVE
          </div>
        ) : pageCount > 0 ? (
          <div className="absolute bottom-2 right-2 bg-slate-900/80 text-white text-[9px] font-black px-2 py-1 rounded-sm backdrop-blur-sm flex items-center gap-1">
            <Layers size={10} /> {pageCount} PAGES
          </div>
        ) : null}
      </div>
    </Link>
  );
}
