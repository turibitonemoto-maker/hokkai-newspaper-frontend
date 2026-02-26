
'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, limit } from 'firebase/firestore';
import { Navbar } from '@/components/Navbar';
import { ArticleCard } from '@/components/ArticleCard';
import { Button } from '@/components/ui/button';
import { Newspaper, ArrowRight, Loader2, TrendingUp, Calendar, Ghost } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
  const db = useFirestore();
  const [currentTime, setCurrentTime] = useState<string | null>(null);

  useEffect(() => {
    setCurrentTime(new Date().toLocaleDateString('ja-JP', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      weekday: 'short' 
    }));
  }, []);

  // 公開済みの最新記事を取得
  const latestArticlesRef = useMemoFirebase(() => {
    if (!db) return null;
    return query(
      collection(db, 'articles'),
      where('isPublished', '==', true),
      orderBy('publishDate', 'desc'),
      limit(6)
    );
  }, [db]);

  const { data: articles, isLoading, error } = useCollection(latestArticlesRef);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Navbar />
      
      <main className="flex-grow">
        {/* Modern Hero Section */}
        <section className="bg-slate-900 text-white py-24 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary-foreground text-xs font-bold uppercase tracking-widest mb-6 border border-primary/30">
                <Newspaper size={14} />
                <span>HGU Newspaper Club Official</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-black tracking-tighter mb-8 leading-[1.1]">
                北海学園大学の<br />
                「いま」を記録する。
              </h1>
              <p className="text-xl text-slate-300 mb-10 leading-relaxed font-medium">
                学生の視点で、キャンパスの鼓動を伝える。
                学内ニュース、イベント、独占インタビューをいち早くお届け。
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="rounded-full px-8 h-14 text-lg font-bold transition-transform hover:scale-105" asChild>
                  <Link href="/category/Campus">記事一覧を見る</Link>
                </Button>
                <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-lg font-bold border-white/20 hover:bg-white/10" asChild>
                  <Link href="/login">管理者ログイン</Link>
                </Button>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
        </section>

        {/* Info Bar */}
        <div className="bg-white border-b sticky top-16 z-40 shadow-sm">
          <div className="container mx-auto px-4 h-14 flex items-center justify-between overflow-x-auto whitespace-nowrap gap-8 no-scrollbar">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
              <TrendingUp size={16} className="text-primary" />
              <span>注目:</span>
              <span className="font-medium text-slate-500 ml-2">最新のキャンパスニュースをチェック</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400 font-medium">
              <Calendar size={14} />
              <span>{currentTime || 'Loading...'}</span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-12 border-b border-slate-200 pb-6">
              <div>
                <h2 className="text-4xl font-black tracking-tight text-slate-900">最新のニュース</h2>
                <p className="text-slate-500 mt-2 font-medium">Campus Highlights & Updates</p>
              </div>
              <Button variant="ghost" className="font-bold gap-2 text-primary hover:text-primary hover:bg-primary/5 hidden sm:flex" asChild>
                <Link href="/category/Campus">
                  全て見る <ArrowRight size={18} />
                </Link>
              </Button>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-32">
                <Loader2 className="animate-spin text-primary mb-4" size={48} />
                <p className="text-slate-500 font-bold tracking-widest uppercase text-sm">Loading Stories...</p>
              </div>
            ) : articles && articles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {articles.map((article) => (
                  <ArticleCard key={article.id} article={article as any} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-24 text-center border-2 border-dashed border-slate-200">
                <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <Ghost className="text-slate-300" size={40} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">まだ記事がありません</h3>
                <p className="text-slate-500 font-medium max-w-sm mx-auto">
                  管理画面から最初の記事を投稿してください。
                </p>
                <Button className="mt-8 rounded-full font-bold px-8" asChild>
                  <Link href="/admin">記事を作成する</Link>
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="bg-slate-950 text-slate-400 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="bg-primary p-2 rounded-lg text-white">
              <Newspaper size={24} />
            </div>
            <span className="font-black text-2xl tracking-tighter text-white">北海学園大学新聞会</span>
          </div>
          <p className="text-xs font-bold tracking-[0.3em] uppercase opacity-40">
            &copy; {new Date().getFullYear()} HGU NEWSPAPER CLUB / REPORTING FOR THE FUTURE
          </p>
        </div>
      </footer>
    </div>
  );
}
