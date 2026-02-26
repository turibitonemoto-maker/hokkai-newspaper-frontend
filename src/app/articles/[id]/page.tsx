'use client';

import { useParams } from 'next/navigation';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Navbar } from '@/components/Navbar';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Clock, ChevronLeft, Share2, Printer, Bookmark } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function ArticlePage() {
  const { id } = useParams();
  const db = useFirestore();
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
            <Button variant="ghost" className="mb-10 gap-2 -ml-4 hover:bg-slate-50 text-slate-500 font-bold" asChild>
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
                    <span>BY: 北海学園大学新聞</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-primary" />
                    <span>READ TIME: 3 MINS</span>
                  </div>
                  <div className="flex-grow" />
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="rounded-full"><Share2 size={18} /></Button>
                    <Button variant="ghost" size="icon" className="rounded-full"><Bookmark size={18} /></Button>
                    <Button variant="ghost" size="icon" className="rounded-full"><Printer size={18} /></Button>
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

              <div className="max-w-3xl mx-auto">
                {article.summary && (
                  <div className="bg-slate-50 rounded-3xl p-8 mb-12 border border-slate-100 relative">
                    <div className="absolute -top-3 left-8 bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full tracking-[0.2em] uppercase">
                      Executive Summary
                    </div>
                    <p className="text-lg leading-relaxed text-slate-700 italic font-medium">
                      {article.summary}
                    </p>
                  </div>
                )}
                
                <div 
                  className="prose prose-slate lg:prose-xl max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-slate-900 prose-p:leading-relaxed prose-p:text-slate-800 prose-a:text-primary prose-strong:text-slate-950"
                  dangerouslySetInnerHTML={{ __html: article.htmlContent || '' }}
                />

                <footer className="mt-20 pt-12 border-t border-slate-100">
                  <div className="bg-slate-50 rounded-3xl p-8 flex items-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-slate-200 shrink-0 flex items-center justify-center text-slate-400 font-black text-2xl uppercase">
                      H
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 mb-1">北海学園大学新聞</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">
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
