
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Article } from '@/lib/types';

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  // Placeholder images based on category
  const categoryImages: Record<string, string> = {
    Campus: 'https://picsum.photos/seed/campus/600/400',
    Event: 'https://picsum.photos/seed/event/600/400',
    Interview: 'https://picsum.photos/seed/interview/600/400',
    Sports: 'https://picsum.photos/seed/sports/600/400',
    Opinion: 'https://picsum.photos/seed/opinion/600/400',
  };

  const displayImage = article.imageUrl || categoryImages[article.categoryId] || 'https://picsum.photos/seed/default/600/400';

  return (
    <Link href={`/articles/${article.id}`} className="block group h-full">
      <Card className="h-full overflow-hidden flex flex-col border-slate-200 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={displayImage}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <Badge className="absolute top-4 left-4 bg-white/90 text-primary backdrop-blur-sm border-none shadow-sm">
            {article.categoryId}
          </Badge>
        </div>
        <CardHeader className="p-5 pb-2">
          <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
            {article.title}
          </h3>
        </CardHeader>
        <CardContent className="p-5 pt-0 flex-grow">
          <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
            {article.summary || article.htmlContent?.replace(/<[^>]*>?/gm, '').substring(0, 100)}...
          </p>
        </CardContent>
        <CardFooter className="p-5 pt-0 border-t border-slate-50 flex items-center justify-between text-xs text-muted-foreground mt-auto bg-slate-50/30">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              <span>{article.publishDate?.split('T')[0]}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
            読む <ArrowRight size={12} />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
