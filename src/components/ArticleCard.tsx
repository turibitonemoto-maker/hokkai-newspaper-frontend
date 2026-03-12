
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, ExternalLink } from 'lucide-react';
import { useMemo } from 'react';

interface ArticleCardProps {
  article: {
    id: string;
    title: string;
    htmlContent?: string;
    content?: string;
    categoryId: string;
    publishDate: string;
    mainImageUrl?: string;
    source?: string;
    noteUrl?: string;
  };
  priority?: boolean;
}

export function ArticleCard({ article, priority = false }: ArticleCardProps) {
  const displayImage = article.mainImageUrl || `https://picsum.photos/seed/${article.id}/600/400`;
  const isExternal = article.source === 'note';
  
  const excerpt = useMemo(() => {
    const rawContent = article.htmlContent || article.content || "";
    const plainText = rawContent.replace(/<[^>]*>?/gm, "") || "";
    return plainText.substring(0, 60) + (plainText.length > 60 ? "..." : "");
  }, [article.htmlContent, article.content]);

  const date = useMemo(() => article.publishDate?.split('T')[0] || "", [article.publishDate]);

  return (
    <Link href={`/articles/${article.id}`} className="group block h-full">
      <Card className="h-full overflow-hidden flex flex-col border-none shadow-sm bg-white hover:shadow-lg transition-all duration-300 rounded-[20px] md:rounded-[24px] ring-1 ring-slate-100 group-hover:ring-primary/20">
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          <Image
            src={displayImage}
            alt={article.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority={priority}
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
              <span>{date}</span>
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
