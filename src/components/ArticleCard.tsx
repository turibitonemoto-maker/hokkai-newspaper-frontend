'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, ExternalLink } from 'lucide-react';

interface ArticleCardProps {
  article: {
    id: string;
    title: string;
    htmlContent?: string;
    categoryId: string;
    publishDate: string;
    mainImageUrl?: string;
    source?: string;
    noteUrl?: string;
  };
}

/**
 * スマートフォンでもはっきりと「分かれて」見えるよう調整された記事カード。
 */
export function ArticleCard({ article }: ArticleCardProps) {
  const displayImage = article.mainImageUrl || `https://picsum.photos/seed/${article.id}/600/400`;
  const isExternal = article.source === 'note';
  
  const plainText = article.htmlContent?.replace(/<[^>]*>?/gm, '') || "";
  const excerpt = plainText.substring(0, 80) + (plainText.length > 80 ? "..." : "");

  return (
    <Link href={`/articles/${article.id}`} className="group block h-full">
      <Card className="h-full overflow-hidden flex flex-col border-none shadow-sm bg-white hover:shadow-lg transition-all duration-500 rounded-[20px] md:rounded-[24px] ring-1 ring-slate-100 group-hover:ring-primary/20">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={displayImage}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            data-ai-hint="news photo"
          />
          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
            <Badge className="bg-primary text-white border-none font-black text-[7px] md:text-[8px] tracking-[0.1em] uppercase py-0.5 px-1.5 md:px-2 shadow-lg">
              {article.categoryId}
            </Badge>
            {isExternal && (
              <Badge className="bg-green-600 text-white border-none font-black text-[7px] md:text-[8px] tracking-[0.1em] uppercase py-0.5 px-1.5 md:px-2 shadow-lg flex gap-1 items-center">
                <ExternalLink className="size-[7px] md:size-2" /> NOTE
              </Badge>
            )}
          </div>
        </div>
        
        <CardHeader className="p-4 md:p-5 pb-2">
          <div className="flex items-center gap-2 text-[7px] md:text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
            <div className="flex items-center gap-1">
              <Calendar className="text-primary/60 size-[9px] md:size-[10px]" />
              <span>{article.publishDate?.split('T')[0]}</span>
            </div>
          </div>
          <h3 className="text-sm md:text-base font-black leading-tight text-slate-900 group-hover:text-primary transition-colors line-clamp-2 tracking-tight">
            {article.title}
          </h3>
        </CardHeader>

        <CardContent className="px-4 md:px-5 pb-4 md:pb-5 flex-grow">
          <p className="text-slate-500 text-[10px] md:text-[11px] line-clamp-2 leading-relaxed font-medium">
            {excerpt}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
