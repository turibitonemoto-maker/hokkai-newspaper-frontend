'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Navbar } from '@/components/Navbar';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, ChevronLeft, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function ArticlePage() {
  const { id } = useParams();
  const db = useFirestore();
  const [fontSize, setFontSize] = useState<'base' | 'lg' | 'xl'>('base');

  const docRef = useMemoFirebase(() => {
    if (!id || !db) return null;
    return doc(db, 'articles', id as string);
  }, [db, id]);

  const { data: article, isLoading } = useDoc(docRef);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-bold text-slate-400 tracking-widest uppercase">Fetching Story</p>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center p-4">
          <Badge variant="destructive" className="mb-4">404 NOT FOUND</Badge>
          <h1 className="text-3xl font-black mb-6 tracking-tight">記事が見つかりませんでした</h1>
          <Button asChild className="rounded-full px-8">
            <Link href="/">トップページへ戻る</Link>
          </Button>
        </div>
      </div>
    );
  }

  const displayImage = article.mainImageUrl || `https://picsum.photos/seed/${article.id}/1200/600`;

  return (
    <div className="min-h-screen flex flex-col bg-white font-body">
      <Navbar />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <Button variant="ghost" className="mb-10 gap-2 -ml-4 hover:bg-slate-50 text-slate-500 font-bold rounded-xl" asChild>
              <Link href="/"><ChevronLeft size={18} /> BACK TO NEWSFEED</Link>
            </Button>

            <article>
              <header className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <Badge className="bg-primary text-white hover:bg-primary border-none font-bold py-1 px-3">
                    {article.categoryId}
                  </Badge>
                  <div className="h-px flex-grow bg-slate-100" />
                </div>
                
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-10 leading-[1.15] text-slate-950">
                  {article.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-8 py-8 border-y border-slate-100 text-sm text-slate-500 font-medium uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-primary" />
                    <span>PUBLISHED: {article.publishDate?.split('T')[0]}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-primary" />
                    <span>BY: {article.authorName || '北海学園大学新聞'}</span>
                  </div>
                  <div className="flex-grow" />
                  <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl border">
                    <Button 
                      variant={fontSize === 'base' ? 'secondary' : 'ghost'} 
                      size="sm" 
                      onClick={() => setFontSize('base')}
                      className="rounded-lg h-8 w-12 px-0 font-bold text-xs"
                    >
                      標準
                    </Button>
                    <Button 
                      variant={fontSize === 'lg' ? 'secondary' : 'ghost'} 
                      size="sm" 
                      onClick={() => setFontSize('lg')}
                      className="rounded-lg h-8 w-12 px-0 font-bold text-xs"
                    >
                      拡大
                    </Button>
                    <Button 
                      variant={fontSize === 'xl' ? 'secondary' : 'ghost'} 
                      size="sm" 
                      onClick={() => setFontSize('xl')}
                      className="rounded-lg h-8 w-12 px-0 font-bold text-xs"
                    >
                      最大
                    </Button>
                  </div>
                </div>
              </header>

              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-16 shadow-2xl shadow-slate-200 ring-1 ring-slate-100">
                <Image
                  src={displayImage}
                  alt={article.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              <div className="max-w-3xl mx-auto relative">
                <div 
                  className={cn(
                    "prose prose-slate max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-slate-900 prose-p:leading-relaxed prose-p:text-slate-800 prose-a:text-primary prose-strong:text-slate-950 transition-all duration-300",
                    fontSize === 'base' && "prose-base lg:prose-xl",
                    fontSize === 'lg' && "prose-lg lg:prose-2xl",
                    fontSize === 'xl' && "prose-xl lg:prose-3xl"
                  )}
                  dangerouslySetInnerHTML={{ __html: article.htmlContent || '' }}
                />

                {article.source === 'note' && article.noteUrl && (
                  <div className="mt-12 p-8 bg-green-50 rounded-[32px] border border-green-100 flex flex-col items-center text-center gap-4">
                    <p className="text-green-800 font-bold text-sm">この記事には続きがあるか、元のプラットフォームで詳細を確認できます。</p>
                    <Button asChild className="bg-green-600 hover:bg-green-700 text-white rounded-2xl h-14 px-8 font-black gap-2 shadow-xl shadow-green-200">
                      <a href={article.noteUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink size={20} />
                        note.comで続きを読む
                      </a>
                    </Button>
                  </div>
                )}

                <footer className="mt-20 pt-12 border-t border-slate-100">
                  <div className="bg-slate-50 rounded-[32px] p-8 flex items-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-slate-200 shrink-0 flex items-center justify-center text-slate-400 font-black text-2xl uppercase">
                      H
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 mb-1">北海学園大学新聞</h4>
                      <p className="text-sm text-slate-500 leading-relaxed font-medium">
                        この記事は北海学園大学新聞 取材班によって執筆・編集されました。
                        学内での出来事や学生の声をお届けしています。
                      </p>
                    </div>
                  </div>
                </footer>
              </div>
            </article>
          </div>
        </div>
      </main>

      <footer className="bg-slate-50 py-12 mt-12 border-t">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-slate-400 font-bold tracking-widest uppercase">
            &copy; {new Date().getFullYear()} 北海学園大学新聞 / REPORTING FOR THE FUTURE
          </p>
        </div>
      </footer>
    </div>
  );
}