'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FileText } from 'lucide-react';
import { useMemo } from 'react';

/**
 * 新聞紙面サムネイル・コンポーネント (道新リスペクト版)
 * 縦長の紙面比率を維持し、下にタイトルのみを表示するストイックなデザイン。
 */
interface PaperCardProps {
  article: {
    id: string;
    title: string;
    mainImageUrl?: string;
    pdfUrl?: string;
  };
}

export function PaperCard({ article }: PaperCardProps) {
  const displayImage = article.mainImageUrl || "";

  return (
    <Link href={`/articles/${article.id}`} className="group block text-center space-y-3">
      <div className="relative aspect-[1/1.414] w-full rounded-sm overflow-hidden border border-slate-200 bg-white shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:ring-2 group-hover:ring-primary/20">
        {displayImage ? (
          <Image
            src={displayImage}
            alt={article.title}
            fill
            sizes="(max-width: 640px) 50vw, 250px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-slate-50 text-slate-300 gap-2">
            <FileText size={32} strokeWidth={1} />
            <span className="text-[10px] font-black uppercase tracking-widest">Digital Archive</span>
          </div>
        )}
      </div>
      <div className="text-xs md:text-sm font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-1">
        {article.title}
      </div>
    </Link>
  );
}
