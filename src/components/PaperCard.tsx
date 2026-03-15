
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FileImage, Calendar, Layers } from 'lucide-react';
import { useMemo } from 'react';

/**
 * 紙面物理サムネイル・コンポーネント
 * 最初の1枚を確実に表示し、複数枚の存在を可視化する。
 */
interface PaperCardProps {
  article: {
    id: string;
    title: string;
    issueNumber?: string;
    publishDate: string;
    mainImageUrl?: string;
    paperImages?: string[];
  };
}

export function PaperCard({ article }: PaperCardProps) {
  // 複数枚ある場合は最初の1枚を、なければメイン画像を使用
  const displayImage = useMemo(() => {
    if (article.paperImages && article.paperImages.length > 0) {
      return article.paperImages[0];
    }
    return article.mainImageUrl || "";
  }, [article.paperImages, article.mainImageUrl]);

  const date = useMemo(() => article.publishDate?.split('T')[0] || "", [article.publishDate]);
  const pageCount = article.paperImages?.length || 0;

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
            <FileImage size={32} strokeWidth={1} />
            <span className="text-[10px] font-black uppercase tracking-widest">No Image</span>
          </div>
        )}
        
        {pageCount > 0 && (
          <div className="absolute bottom-2 right-2 bg-slate-900/80 text-white text-[9px] font-black px-2 py-1 rounded-sm backdrop-blur-sm flex items-center gap-1">
            <Layers size={10} /> {pageCount} PAGES
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
        <div className="flex items-center justify-center gap-1 text-[9px] text-slate-400 font-medium uppercase tracking-widest">
          <Calendar size={10} />
          <span>{date.replace(/-/g, '.')}</span>
        </div>
      </div>
    </Link>
  );
}
