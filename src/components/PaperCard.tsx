'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FileText, Calendar } from 'lucide-react';
import { useMemo } from 'react';

/**
 * 新聞紙面サムネイル・コンポーネント (道新リスペクト・号数対応版)
 * アスペクト比 1:1.414 (新聞紙面) を維持。
 * 閲覧専用フロントエンドとしての視認性を追求。
 */
interface PaperCardProps {
  article: {
    id: string;
    title: string;
    issueNumber?: string;
    publishDate: string;
    mainImageUrl?: string;
    pdfUrl?: string;
  };
}

export function PaperCard({ article }: PaperCardProps) {
  const displayImage = article.mainImageUrl || "";
  const date = useMemo(() => article.publishDate?.split('T')[0] || "", [article.publishDate]);

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
      <div className="space-y-1">
        {article.issueNumber && (
          <div className="text-[10px] font-black text-primary uppercase tracking-widest">
            {article.issueNumber}
          </div>
        )}
        <div className="text-xs md:text-sm font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-1">
          {article.title}
        </div>
        <div className="flex items-center justify-center gap-1 text-[9px] text-slate-400 font-medium">
          <Calendar size={10} />
          <span>{date}</span>
        </div>
      </div>
    </Link>
  );
}