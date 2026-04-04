'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, FileText } from 'lucide-react';
import { useMemo } from 'react';
import { getDisplayImageUrl } from '@/lib/utils';

/**
 * 記事カードコンポーネント (画像表示正常化・スマホ最適化版)
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
  const displayImage = useMemo(() => getDisplayImageUrl(article.mainImageUrl), [article.mainImageUrl]);
  const hasImage = !!displayImage;
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
    return plainText.substring(0, 80) + (plainText.length > 80 ? "..." : "");
  }, [article.content, article.htmlContent]);

  const date = useMemo(() => article.publishDate?.split('T')[0] || "", [article.publishDate]);

  return (
    <div className="h-full group relative">
      <Card className="h-full overflow-hidden flex flex-col border-none shadow-md bg-white hover:shadow-2xl transition-all duration-500 rounded-[24px] md:rounded-[32px] ring-1 ring-slate-100 group-hover:ring-primary/20">
        {/* 全域リンク */}
        <Link 
          href={`/articles/${article.id}`} 
          className="absolute inset-0 z-20" 
          aria-label={article.title}
        />
        
        <div className="relative aspect-[16/10] md:aspect-[4/3] overflow-hidden bg-slate-50">
          {hasImage ? (
            <Image
              src={displayImage}
              alt={article.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              priority={priority}
              unoptimized={displayImage.includes('drive.google.com')}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
              <span className="font-black text-[10px] uppercase tracking-[0.4em] text-slate-200">HOKKAI NEWS</span>
            </div>
          )}
          
          <div className="absolute top-3 left-3 md:top-4 md:left-4 flex flex-wrap gap-2 z-30">
            <Link href={`/category/${article.categoryId}`} className="pointer-events-auto relative z-40">
              <Badge className="bg-primary text-white border-none font-black text-[8px] md:text-[9px] tracking-widest uppercase py-1 px-3 shadow-lg rounded-full hover:scale-110 transition-transform">
                {article.categoryId}
              </Badge>
            </Link>
            {hasPdf && (
              <Badge className="bg-slate-950 text-white border-none font-black text-[8px] md:text-[9px] tracking-widest uppercase py-1 px-3 shadow-lg rounded-full flex gap-1 items-center">
                <FileText size={10} /> PAPER
              </Badge>
            )}
          </div>
        </div>
        
        <CardHeader className="p-5 md:p-6 pb-2">
          <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
            <Calendar className="text-primary/60" size={12} />
            <span>{date}</span>
          </div>
          <h3 className="text-base md:text-lg font-black leading-tight text-slate-950 group-hover:text-primary transition-colors line-clamp-2 tracking-tight">
            {article.title}
          </h3>
        </CardHeader>

        <CardContent className="px-5 md:px-6 pb-6 flex-grow">
          <p className="text-slate-500 text-[10px] md:text-[11px] line-clamp-2 leading-relaxed font-medium tracking-wide">
            {excerpt}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
