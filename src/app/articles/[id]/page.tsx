'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, ChevronLeft, Type } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

/**
 * 記事詳細ページ (最終・完全版)
 * AI機能を完全に排除し、記者の筆致をそのまま届けます。
 * Typography導入により note のような美しいレンダリングを実現。
 */
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

  // 公開設定のチェック
  const isPublic = article?.isPublished === true;

  const displayImage = article?.mainImageUrl || "";

  const mainContent = useMemo(() => 
    article?.htmlContent || article?.content || ''
  , [article?.htmlContent, article?.content]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-6">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[10px] font-black text-slate-300 tracking-[0.5em] uppercase animate-pulse">Loading Story</p>
        </div>
      </div>
    );
  }

  if (!article || !isPublic) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 bg-white">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-slate-200">
            <ChevronLeft size={40} />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">記事が見つかりません</h1>
          <p className="text-slate-500 font-medium leading-relaxed">
            お探しの記事は削除されたか、現在非公開に設定されています。
          </p>
          <Button onClick={() => router.push('/')} className="rounded-full px-10 h-12 font-black shadow-lg shadow-primary/20">
            トップページへ戻る
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-16 pb-32">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <Button 
            variant="ghost" 
            className="group gap-2 -ml-4 hover:bg-slate-50 text-slate-400 font-black text-xs uppercase tracking-widest rounded-full px-6"
            onClick={() => router.back()}
          >
            <ChevronLeft size={16} className="transition-transform group-hover:-translate-x-1" /> BACK
          </Button>
          
          <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-full border shadow-sm">
            <div className="px-3 text-slate-400">
              <Type size={14} />
            </div>
            {(['base', 'lg', 'xl'] as const).map((size) => (
              <Button 
                key={size}
                variant={fontSize === size ? 'secondary' : 'ghost'} 
                size="sm" 
                onClick={() => setFontSize(size)}
                className={cn(
                  "rounded-full h-8 px-4 font-black text-[10px] uppercase tracking-tighter",
                  fontSize === size ? "bg-white shadow-sm text-primary" : "text-slate-400"
                )}
              >
                {size === 'base' ? '標準' : size === 'lg' ? '大' : '特大'}
              </Button>
            ))}
          </div>
        </div>

        <article className="animate-fade-in">
          <header className="mb-12 md:mb-20">
            <div className="flex items-center gap-4 mb-8">
              <Badge className="bg-primary text-white hover:bg-primary border-none font-black py-1 px-4 text-[10px] tracking-widest uppercase shadow-md">
                {article.categoryId}
              </Badge>
              <Separator className="flex-grow bg-slate-100" />
            </div>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-10 leading-[1.2] text-slate-950 font-sans">
              {article.title}
            </h1>
            
            <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12 py-8 border-y border-slate-100">
              <div className="flex items-center gap-8 text-[11px] text-slate-500 font-black uppercase tracking-[0.2em]">
                <div className="flex items-center gap-2.5">
                  <Calendar size={14} className="text-primary/60" />
                  <span>{article.publishDate?.split('T')[0]}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <User size={14} className="text-primary/60" />
                  <span>{article.authorName || '北海学園大学一部新聞会'}</span>
                </div>
              </div>
            </div>
          </header>

          {displayImage && (
            <div className="relative aspect-[16/9] rounded-[32px] md:rounded-[56px] overflow-hidden mb-16 md:mb-24 shadow-2xl shadow-slate-200 ring-1 ring-slate-100 bg-slate-50">
              <Image
                src={displayImage}
                alt={article.title}
                fill
                sizes="(max-width: 1024px) 100vw, 896px"
                className="object-cover"
                priority
              />
            </div>
          )}

          <div className="max-w-3xl mx-auto relative">
            <div 
              className={cn(
                "prose prose-slate max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-slate-900 prose-p:leading-[1.8] prose-p:text-slate-800 transition-all duration-300 font-medium",
                fontSize === 'base' && "prose-lg md:prose-xl text-lg md:text-xl", 
                fontSize === 'lg' && "prose-xl md:prose-2xl text-xl md:text-2xl",
                fontSize === 'xl' && "prose-2xl md:prose-3xl text-2xl md:text-3xl" 
              )}
              dangerouslySetInnerHTML={{ __html: mainContent }}
            />
          </div>
        </article>
      </div>
    </div>
  );
}
