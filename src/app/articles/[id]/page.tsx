
'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, ChevronLeft, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function ArticlePage() {
  const { id } = useParams();
  const router = useRouter();
  const db = useFirestore();
  const [fontSize, setFontSize] = useState<'base' | 'lg' | 'xl'>('base');

  const articleRef = useMemoFirebase(() => {
    if (!id || !db) return null;
    return doc(db, 'articles', id as string);
  }, [db, id]);

  const { data: article, isLoading } = useDoc(articleRef);

  const displayImage = useMemo(() => 
    article?.mainImageUrl || `https://picsum.photos/seed/${article?.id}/1200/600`
  , [article?.mainImageUrl, article?.id]);

  const mainContent = useMemo(() => 
    article?.htmlContent || article?.content || ''
  , [article?.htmlContent, article?.content]);

  const isExternal = article?.source === 'note';

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <div className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[10px] font-bold text-slate-300 tracking-[0.3em] uppercase">Loading Story</p>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <div className="flex-grow flex flex-col items-center justify-center p-4">
          <Badge variant="destructive" className="mb-4">404 NOT FOUND</Badge>
          <h1 className="text-3xl font-black mb-6 tracking-tight">記事が見つかりませんでした</h1>
          <Button onClick={() => router.push('/')} className="rounded-full px-8">
            トップページへ戻る
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 pb-24">
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          className="mb-6 md:mb-10 gap-2 -ml-2 md:-ml-4 hover:bg-slate-50 text-slate-500 font-bold rounded-xl"
          onClick={() => router.back()}
        >
          <ChevronLeft size={18} /> BACK
        </Button>

        <article>
          <header className="mb-8 md:mb-12">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <Badge className="bg-primary text-white hover:bg-primary border-none font-bold py-1 px-3">
                {article.categoryId}
              </Badge>
              <div className="h-px flex-grow bg-slate-100" />
            </div>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-6 md:mb-10 leading-[1.2] text-slate-950">
              {article.title}
            </h1>
            
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 py-6 md:py-8 border-y border-slate-100 text-[10px] md:text-xs text-slate-500 font-bold uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-primary" />
                <span>{article.publishDate?.split('T')[0]}</span>
              </div>
              <div className="flex items-center gap-2">
                <User size={14} className="text-primary" />
                <span>{article.authorName || '北海学園大学一部新聞会'}</span>
              </div>
              <div className="md:flex-grow" />
              <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border shadow-sm w-fit">
                {(['base', 'lg', 'xl'] as const).map((size) => (
                  <Button 
                    key={size}
                    variant={fontSize === size ? 'secondary' : 'ghost'} 
                    size="sm" 
                    onClick={() => setFontSize(size)}
                    className="rounded-lg h-8 px-3 font-bold text-[10px]"
                  >
                    {size === 'base' ? '標準' : size === 'lg' ? '拡大' : '最大'}
                  </Button>
                ))}
              </div>
            </div>
          </header>

          <div className="relative aspect-[16/9] rounded-xl md:rounded-2xl overflow-hidden mb-10 md:mb-16 shadow-xl md:shadow-2xl shadow-slate-200 ring-1 ring-slate-100 bg-slate-50">
            <Image
              src={displayImage}
              alt={article.title}
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
              priority
            />
          </div>

          <div className="max-w-3xl mx-auto relative">
            <div 
              className={cn(
                "prose prose-slate max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-slate-900 prose-p:leading-relaxed prose-p:text-slate-800 prose-a:text-primary prose-strong:text-slate-950 transition-all duration-200",
                fontSize === 'base' && "prose-lg md:prose-xl text-lg md:text-xl", 
                fontSize === 'lg' && "prose-xl md:prose-2xl text-xl md:text-2xl",
                fontSize === 'xl' && "prose-2xl md:prose-3xl text-2xl md:text-3xl" 
              )}
              dangerouslySetInnerHTML={{ __html: mainContent }}
            />

            {isExternal && article.noteUrl && (
              <div className="mt-12 md:mt-20 pt-8 md:pt-12 border-t-2 border-slate-100">
                <a 
                  href={article.noteUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full h-20 md:h-24 text-xl md:text-2xl font-black rounded-2xl md:rounded-[32px] bg-green-600 hover:bg-green-700 text-white shadow-xl md:shadow-2xl shadow-green-100 transition-all active:scale-[0.98] gap-3 md:gap-4 px-6 text-center no-underline"
                >
                  note.comでこの記事の続きを読む
                  <ExternalLink size={28} className="shrink-0" />
                </a>
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}
