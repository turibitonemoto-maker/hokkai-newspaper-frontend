'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, where } from 'firebase/firestore';
import { Navbar } from '@/components/Navbar';
import { ArticleCard } from '@/components/ArticleCard';
import { Newspaper, Loader2, Calendar, Ghost } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Home() {
  const db = useFirestore();
  const [currentTime, setCurrentTime] = useState<string | null>(null);

  useEffect(() => {
    setCurrentTime(new Date().toLocaleDateString('ja-JP', { 
      year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' 
    }));
  }, []);

  // 認証チェックを完全に排除し、即座にデータを取得
  const latestArticlesRef = useMemoFirebase(() => {
    if (!db) return null;
    return query(
      collection(db, 'articles'),
      where('isPublished', '==', true),
      orderBy('publishDate', 'desc')
    );
  }, [db]);

  const { data: articles, isLoading: isArticlesLoading } = useCollection(latestArticlesRef);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-body">
      <Navbar />
      
      <main className="flex-grow">
        <section className="relative h-[60vh] flex items-center overflow-hidden bg-slate-900 text-white">
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-900 to-primary/20" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-[10px] font-black uppercase tracking-widest mb-6 border border-white/20">
                <Newspaper size={14} /> <span>Hokkai Gakuen University Newspaper</span>
              </div>
              <h1 className="text-4xl md:text-7xl font-black tracking-tighter mb-8 leading-tight">
                キャンパスの<span className="text-primary italic">「いま」</span>を届ける。
              </h1>
              <p className="text-lg text-slate-300 max-w-xl font-medium">学生の視点で記録する。学内のニュース、インタビュー、イベント情報をどこよりも深く。</p>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12 border-b pb-6">
              <h2 className="text-3xl font-black tracking-tight">最新の記事</h2>
              <div className="flex items-center gap-3 text-slate-400 font-bold text-xs uppercase">
                <Calendar size={14} className="text-primary" /> <span>{currentTime || '...'}</span>
              </div>
            </div>

            {isArticlesLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="animate-spin text-primary" size={48} />
              </div>
            ) : articles && articles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 animate-fade-in">
                {articles.map((article) => (
                  <ArticleCard key={article.id} article={article as any} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center bg-white rounded-[40px] shadow-sm">
                <Ghost className="mx-auto text-slate-200 mb-4" size={40} />
                <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">記事がまだありません</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="bg-slate-950 text-slate-600 py-12 text-center text-[10px] font-black uppercase tracking-widest">
        &copy; {new Date().getFullYear()} 北海学園大学新聞
      </footer>
    </div>
  );
}