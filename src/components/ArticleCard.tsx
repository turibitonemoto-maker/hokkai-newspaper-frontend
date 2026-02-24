import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User } from 'lucide-react';
import type { Article } from '@/lib/types';

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link href={`/articles/${article.id}`} className="block group">
      <Card className="h-full overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 bg-white">
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            data-ai-hint={article.imageHint}
          />
          <Badge className="absolute top-4 left-4 bg-primary/90 text-primary-foreground border-none">
            {article.category}
          </Badge>
        </div>
        <CardHeader className="p-5 pb-2">
          <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
            {article.title}
          </h3>
        </CardHeader>
        <CardContent className="p-5 pt-0 pb-4">
          <p className="text-muted-foreground text-sm line-clamp-3">
            {article.excerpt}
          </p>
        </CardContent>
        <CardFooter className="p-5 pt-0 flex items-center justify-between text-xs text-muted-foreground border-t border-muted/50 mt-auto">
          <div className="flex items-center gap-1">
            <User size={12} />
            <span>{article.author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={12} />
            <span>{article.publishDate}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}