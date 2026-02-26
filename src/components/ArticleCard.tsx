
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, ArrowUpRight, Clock } from 'lucide-react';

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
    <Link href={`/articles/${article.id}`} className="group block h-full">
      <Card className="h-full overflow-hidden flex flex-col border-none shadow-none bg-transparent transition-all duration-300">
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6 ring-1 ring-slate-100 shadow-sm">
          <Image
            src={displayImage}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Badge className="absolute top-4 left-4 bg-white/90 text-slate-900 backdrop-blur-md border-none font-bold text-[10px] tracking-widest uppercase py-1.5 px-3">
            {article.categoryId}
          </Badge>
          <div className="absolute bottom-4 right-4 bg-white rounded-full p-2 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 shadow-xl">
            <ArrowUpRight size={20} className="text-primary" />
          </div>
        </div>
        
        <CardHeader className="p-0 mb-3">
          <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">
            <div className="flex items-center gap-1.5">
              <Calendar size={12} className="text-primary" />
              <span>{article.publishDate?.split('T')[0]}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-300" />
            <div className="flex items-center gap-1.5">
              <Clock size={12} className="text-primary" />
              <span>3 MIN READ</span>
            </div>
          </div>
          <h3 className="text-2xl font-black leading-[1.2] text-slate-950 group-hover:text-primary transition-colors line-clamp-2 tracking-tight">
            {article.title}
          </h3>
        </CardHeader>

        <CardContent className="p-0 flex-grow">
          <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed font-medium">
            {article.summary || article.htmlContent?.replace(/<[^>]*>?/gm, '').substring(0, 120)}...
          </p>
        </CardContent>

        <CardFooter className="p-0 mt-6 pt-6 border-t border-slate-100">
          <div className="text-[10px] font-black text-primary tracking-[0.2em] uppercase flex items-center gap-2 group-hover:gap-4 transition-all">
            Read Full Story <div className="w-4 h-px bg-primary" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
