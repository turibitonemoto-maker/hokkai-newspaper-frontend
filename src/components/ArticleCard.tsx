'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, ExternalLink } from 'lucide-react';

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

export function ArticleCard({ article }: ArticleCardProps) {
  const displayImage = article.mainImageUrl || `https://picsum.photos/seed/${article.id}/800/500`;
  const isExternal = article.source === 'note';
  
  // 本文からテキストのみを抽出して冒頭部分を表示
  const plainText = article.htmlContent?.replace(/<[^>]*>?/gm, '') || "";
  const excerpt = plainText.substring(0, 150) + (plainText.length > 150 ? "..." : "");

  return (
    <Link href={`/articles/${article.id}`} className="group block h-full">
      <Card className="h-full overflow-hidden flex flex-col border-none shadow-sm bg-white hover:shadow-xl transition-all duration-500 rounded-[32px] ring-1 ring-slate-100 group-hover:ring-primary/20">
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={displayImage}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            data-ai-hint="news photo"
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge className="bg-primary text-white border-none font-black text-[9px] tracking-[0.15em] uppercase py-1 px-3 shadow-lg">
              {article.categoryId}
            </Badge>
            {isExternal && (
              <Badge className="bg-green-600 text-white border-none font-black text-[9px] tracking-[0.15em] uppercase py-1 px-3 shadow-lg flex gap-1 items-center">
                <ExternalLink size={10} /> NOTE
              </Badge>
            )}
          </div>
        </div>
        
        <CardHeader className="p-8 pb-4">
          <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
            <div className="flex items-center gap-1.5">
              <Calendar size={12} className="text-primary/60" />
              <span>{article.publishDate?.split('T')[0]}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-200" />
            <div className="flex items-center gap-1.5">
              <Clock size={12} className="text-primary/60" />
              <span>3 MIN READ</span>
            </div>
          </div>
          <h3 className="text-xl font-black leading-tight text-slate-900 group-hover:text-primary transition-colors line-clamp-2 tracking-tight">
            {article.title}
          </h3>
        </CardHeader>

        <CardContent className="px-8 pb-8 flex-grow">
          <p className="text-slate-500 text-sm line-clamp-3 leading-relaxed font-medium">
            {excerpt}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
