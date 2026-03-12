'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, ChevronLeft, ExternalLink, Share2, Type } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

/**
 * 記事詳細ページ (表示用・閲覧専用)
 * 編集機能を持たず、読者が快適に記事を読めることに特化したレイアウト。
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

  const displayImage = useMemo(() => 
    article?.mainImageUrl || `https://picsum.photos/seed/${article?.id}/1200/600`
  , [article?.mainImageUrl, article?.id]);

  const mainContent = useMemo(() => 
    article?.htmlContent || article?.content || ''
  , [article?.htmlContent, article?.content]);

  const isExternal = article?.source === 'note';

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

  if (!article) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 bg-white">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-slate-200">
            <ChevronLeft size={40} />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">記事が見つかりません</h1>
          <p className="text-slate-500 font-medium">お探しの記事は削除されたか、URLが間違っている可能性があります。</p>
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
        {/* 上部ナビゲーション */}
        <div className="flex items-center justify-between mb-10">
          <Button 
            variant="ghost" 
            className="group gap-2 -ml-4 hover:bg-slate-50 text-slate-400 font-black text-xs uppercase tracking-widest rounded-full px-6"
            onClick={() => router.back()}
          >
            <ChevronLeft size={16} className="transition-transform group-hover:-translate-x-1" /> BACK
          </Button>
          
          <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-full border shadow-sm">
            {(['base', 'lg', 'xl'] as const).map((size) => (
              <Button 
                key={size}
                variant={fontSize === size ? 'secondary' : 'ghost'} 
                size="sm" 
                onClick={() => setFontSize(size)}
                className={cn(
                  "rounded-full h-8 px-4 font-black text-[10px] uppercase tracking-tighter",
                  fontSize === size ? "bg-white shadow-sm" : "text-slate-400"
                )}
              >
                {size === 'base' ? '標準' : size === 'lg' ? '大' : '最大'}
              </Button>
            ))}
          </div>
        </div>

        <article className="animate-fade-in">
          <header className="mb-12 md:mb-16">
            <div className="flex items-center gap-4 mb-8">
              <Badge className="bg-primary text-white hover:bg-primary border-none font-black py-1 px-4 text-[10px] tracking-widest uppercase">
                {article.categoryId}
              </Badge>
              <Separator className="flex-grow bg-slate-100" />
            </div>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-10 leading-[1.15] text-slate-950">
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
              
              <div className="md:flex-grow" />
              
              <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" className="rounded-full border-slate-200 text-slate-400 hover:text-primary transition-colors">
                  <Share2 size={16} />
                </Button>
              </div>
            </div>
          </header>

          {/* アイキャッチ画像 */}
          <div className="relative aspect-[16/9] rounded-[32px] md:rounded-[48px] overflow-hidden mb-16 shadow-2xl shadow-slate-200 ring-1 ring-slate-100 bg-slate-50">
            <Image
              src={displayImage}
              alt={article.title}
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
              priority
            />
          </div>

          {/* 本文 */}
          <div className="max-w-3xl mx-auto relative">
            <div 
              className={cn(
                "prose prose-slate max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-slate-900 prose-p:leading-relaxed prose-p:text-slate-800 prose-a:text-primary prose-strong:text-slate-950 prose-img:rounded-[24px] prose-img:shadow-xl transition-all duration-300",
                fontSize === 'base' && "prose-lg md:prose-xl text-lg md:text-xl", 
                fontSize === 'lg' && "prose-xl md:prose-2xl text-xl md:text-2xl",
                fontSize === 'xl' && "prose-2xl md:prose-3xl text-2xl md:text-3xl" 
              )}
              dangerouslySetInnerHTML={{ __html: mainContent }}
            />

            {/* note.com 誘導セクション */}
            {isExternal && article.noteUrl && (
              <div className="mt-20 md:mt-32 pt-12 border-t-4 border-slate-50">
                <div className="bg-slate-50 rounded-[40px] p-8 md:p-12 text-center space-y-8">
                  <div className="bg-green-600 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto text-white shadow-lg shadow-green-200">
                    <ExternalLink size={32} />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-black tracking-tight">続きは note.com でご覧いただけます</h3>
                    <p className="text-slate-500 font-medium">
                      この記事は note.com でも公開されています。より詳細な内容やコメントは、note の公式ページをご確認ください。
                    </p>
                  </div>
                  <a 
                    href={article.noteUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center h-16 px-10 text-lg font-black rounded-full bg-green-600 hover:bg-green-700 text-white shadow-xl shadow-green-100 transition-all active:scale-[0.98] gap-3 no-underline"
                  >
                    公式 note で続きを読む
                    <ExternalLink size={20} />
                  </a>
                </div>
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}
