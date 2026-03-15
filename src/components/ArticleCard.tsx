'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, ExternalLink, FileText } from 'lucide-react';
import { useMemo } from 'react';

/**
 * 記事カードコンポーネント (浄化・最適化版)
 * HTMLタグを剥離し、純粋なテキストのみを抽出。
 * Image sizes を最適化。
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
    source?: string;
    noteUrl?: string;
    pdfUrl?: string;
  };
  priority?: boolean;
}

export function ArticleCard({ article, priority = false }: ArticleCardProps) {
  const hasImage = !!article.mainImageUrl;
  const displayImage = article.mainImageUrl || "";
  const isExternal = article.source === 'note';
  const hasPdf = !!article.pdfUrl;
  
  const excerpt = useMemo(() => {
    const rawContent = article.content || article.htmlContent || "";
    // HTMLタグを剥離し、空白と特殊文字を整理
    const plainText = rawContent
      .replace(/<[^>]*>?/gm, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .trim();
    return plainText.substring(0, 60) + (plainText.length > 60 ? "..." : "");
  }, [article.content, article.htmlContent]);

  const date = useMemo(() => article.publishDate?.split('T')[0] || "", [article.publishDate]);

  return (
    <Link href={`/articles/${article.id}`} className="group block h-full">
      <Card className="h-full overflow-hidden flex flex-col border-none shadow-sm bg-white hover:shadow-2xl transition-all duration-500 rounded-[32px] ring-1 ring-slate-100 group-hover:ring-primary/20">
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-50">
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
            <Badge className="bg-primary text-white border-none font-black text-[9px] tracking-widest uppercase py-1 px-3 shadow-lg rounded-full">
              {article.categoryId}
            </Badge>
            {hasPdf && (
              <Badge className="bg-slate-950 text-white border-none font-black text-[9px] tracking-widest uppercase py-1 px-3 shadow-lg rounded-full flex gap-1.5 items-center">
                <FileText size={10} /> PAPER
              </Badge>
            )}
            {isExternal && (
              <Badge className="bg-emerald-600 text-white border-none font-black text-[9px] tracking-widest uppercase py-1 px-3 shadow-lg rounded-full flex gap-1.5 items-center">
                <ExternalLink size={10} /> NOTE
              </Badge>
            )}
          </div>
        </div>
        
        <CardHeader className="p-6 pb-2">
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
            <Calendar className="text-primary/60" size={12} />
            <span>{date}</span>
          </div>
          <h3 className="text-lg font-black leading-tight text-slate-950 group-hover:text-primary transition-colors line-clamp-2 tracking-tight">
            {article.title}
          </h3>
        </CardHeader>

        <CardContent className="px-6 pb-6 flex-grow">
          <p className="text-slate-500 text-[11px] line-clamp-3 leading-6 font-medium">
            {excerpt}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
