'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, FileText } from 'lucide-react';
import { useMemo } from 'react';

/**
 * 記事カードコンポーネント (正常化版)
 * カテゴリバッジをリンク化し、導線を物理的に結合しました。
 */
interface ArticleCardProps {
  article: {
    id: string;
    title: string;
    content?: string;
    htmlContent?: string;
    categoryId: string;
    publishDate: string;
    mainImageUrl?: string;
    pdfUrl?: string;
  };
  priority?: boolean;
}

export function ArticleCard({ article, priority = false }: ArticleCardProps) {
  const hasImage = !!article.mainImageUrl;
  const displayImage = article.mainImageUrl || "";
  const hasPdf = !!article.pdfUrl;
  
  const excerpt = useMemo(() => {
    const rawContent = article.content || article.htmlContent || "";
    const plainText = rawContent
      .replace(/<[^>]*>?/gm, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/\s+/g, " ")
      .trim();
    return plainText.substring(0, 100) + (plainText.length > 100 ? "..." : "");
  }, [article.content, article.htmlContent]);

  const date = useMemo(() => article.publishDate?.split('T')[0] || "", [article.publishDate]);

  return (
    <div className="h-full group">
      <Card className="h-full overflow-hidden flex flex-col border-none shadow-sm bg-white hover:shadow-2xl transition-all duration-500 rounded-[32px] ring-1 ring-slate-100 group-hover:ring-primary/20 relative">
        <Link href={`/articles/${article.id}`} className="absolute inset-0 z-0" />
        
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-50 z-10">
          {hasImage ? (
            <Image
              src={displayImage}
              alt={article.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              priority={priority}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
              <span className="font-black text-[10px] uppercase tracking-[0.4em] text-slate-200">HOKKAI NEWS</span>
            </div>
          )}
          
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <Link href={`/category/${article.categoryId}`} className="relative z-20">
              <Badge className="bg-primary text-white border-none font-black text-[9px] tracking-widest uppercase py-1 px-3 shadow-lg rounded-full hover:scale-110 transition-transform">
                {article.categoryId}
              </Badge>
            </Link>
            {hasPdf && (
              <Badge className="bg-slate-950 text-white border-none font-black text-[9px] tracking-widest uppercase py-1 px-3 shadow-lg rounded-full flex gap-1.5 items-center">
                <FileText size={10} /> PAPER
              </Badge>
            )}
          </div>
        </div>
        
        <CardHeader className="p-6 pb-2 z-10">
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
            <Calendar className="text-primary/60" size={12} />
            <span>{date}</span>
          </div>
          <h3 className="text-lg font-black leading-tight text-slate-950 group-hover:text-primary transition-colors line-clamp-2 tracking-tight">
            {article.title}
          </h3>
        </CardHeader>

        <CardContent className="px-6 pb-6 flex-grow z-10">
          <p className="text-slate-500 text-[11px] line-clamp-3 leading-relaxed font-medium tracking-wide">
            {excerpt}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
