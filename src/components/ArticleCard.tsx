'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, ExternalLink } from 'lucide-react';
import { useMemo } from 'react';

/**
 * 記事カードコンポーネント (ビルド・同期最適化版)
 * 指令に基づき、抜粋からHTMLタグを剥がしてテキストのみを表示。
 * next/image に適切な sizes を設定し、読み込み警告を完全に解消します。
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
  };
  priority?: boolean;
}

export function ArticleCard({ article, priority = false }: ArticleCardProps) {
  const hasImage = !!article.mainImageUrl;
  const displayImage = article.mainImageUrl || "";
  const isExternal = article.source === 'note';
  
  // HTMLタグを浄化してテキストのみを抽出
  const excerpt = useMemo(() => {
    const rawContent = article.content || article.htmlContent || "";
    const plainText = rawContent.replace(/<[^>]*>?/gm, "").trim();
    return plainText.substring(0, 60) + (plainText.length > 60 ? "..." : "");
  }, [article.content, article.htmlContent]);

  const date = useMemo(() => article.publishDate?.split('T')[0] || "", [article.publishDate]);

  return (
    <Link href={`/articles/${article.id}`} className="group block h-full">
      <Card className="h-full overflow-hidden flex flex-col border-none shadow-sm bg-white hover:shadow-lg transition-all duration-300 rounded-[24px] ring-1 ring-slate-100 group-hover:ring-primary/20">
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-50">
          {hasImage ? (
            <Image
              src={displayImage}
              alt={article.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority={priority}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
              <span className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-200">No Image</span>
            </div>
          )}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <Badge className="bg-primary text-white border-none font-black text-[9px] tracking-[0.1em] uppercase py-1 px-2.5 shadow-lg">
              {article.categoryId}
            </Badge>
            {isExternal && (
              <Badge className="bg-green-600 text-white border-none font-black text-[9px] tracking-[0.1em] uppercase py-1 px-2.5 shadow-lg flex gap-1 items-center">
                <ExternalLink size={10} /> NOTE
              </Badge>
            )}
          </div>
        </div>
        
        <CardHeader className="p-5 pb-2">
          <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">
            <Calendar className="text-primary/60" size={12} />
            <span>{date}</span>
          </div>
          <h3 className="text-base font-black leading-tight text-slate-950 group-hover:text-primary transition-colors line-clamp-2 tracking-tight">
            {article.title}
          </h3>
        </CardHeader>

        <CardContent className="px-5 pb-5 flex-grow">
          <p className="text-slate-500 text-[11px] line-clamp-2 leading-relaxed font-medium">
            {excerpt}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
