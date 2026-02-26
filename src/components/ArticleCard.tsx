'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, ArrowRight, Clock } from 'lucide-react';

interface ArticleCardProps {
  article: {
    id: string;
    title: string;
    summary?: string;
    htmlContent?: string;
    categoryId: string;
    publishDate: string;
    mainImageUrl?: string;
  };
}

export function ArticleCard({ article }: ArticleCardProps) {
  const displayImage = article.mainImageUrl || `https://picsum.photos/seed/${article.id}/800/500`;

  return (
    <Link href={`/articles/${article.id}`} className="group block">
      <Card className="h-full overflow-hidden flex flex-col border-none shadow-sm bg-white hover:shadow-xl transition-all duration-300 rounded-2xl ring-1 ring-slate-200">
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={displayImage}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            data-ai-hint="news photo"
          />
          <Badge className="absolute top-4 left-4 bg-primary text-white border-none font-bold text-[10px] tracking-widest uppercase py-1 px-3">
            {article.categoryId}
          </Badge>
        </div>
        
        <CardHeader className="p-6 pb-2">
          <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
            <div className="flex items-center gap-1">
              <Calendar size={12} className="text-primary" />
              <span>{article.publishDate?.split('T')[0]}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock size={12} className="text-primary" />
              <span>3 MIN READ</span>
            </div>
          </div>
          <h3 className="text-xl font-black leading-tight text-slate-900 group-hover:text-primary transition-colors line-clamp-2">
            {article.title}
          </h3>
        </CardHeader>

        <CardContent className="px-6 py-2 flex-grow">
          <p className="text-slate-500 text-sm line-clamp-3 leading-relaxed">
            {article.summary || article.htmlContent?.replace(/<[^>]*>?/gm, '').substring(0, 150)}
          </p>
        </CardContent>

        <CardFooter className="p-6 pt-4 border-t border-slate-50">
          <div className="text-xs font-black text-primary tracking-widest uppercase flex items-center gap-2 group-hover:gap-4 transition-all">
            Read More <ArrowRight size={14} />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}