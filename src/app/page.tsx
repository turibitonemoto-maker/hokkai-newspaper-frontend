
'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, limit } from 'firebase/firestore';
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

  const latestArticlesRef = useMemoFirebase(() => {
    if (!db) return null;
    return query(
      collection(db, 'articles'),
      limit(24)
    );
  }, [db]);

  const { data: articles, isLoading } = useCollection(latestArticlesRef);

  const publishedArticles = articles 
    ? articles
        .filter(a => a.isPublished)
        .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-body">
      <Navbar />
      
      <main className="flex-grow">
        {/* ヒーローセクション */}
        <section className="bg-slate-900 text-white py-32 lg:py-48 relative overflow-hidden flex items-center min-h-[60vh]">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 text-primary-foreground text-xs font-black uppercase tracking-[0.2em] mb-8 border border-primary/30 backdrop-blur-sm">
                <Newspaper size={14} />
                <span>北海学園大学新聞 公式サイト</span>
              </div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tighter mb-10 leading-[0.9] text-balance">
                キャンパスの <span className="text-primary italic">「いま」</span> を届ける。
              </h1>
              <p className="text-lg md:text-2xl text-slate-400 mb-12 leading-relaxed font-medium max-w-2xl text-pretty">
                学生の視点で、大学の鼓動を記録する。<br className="hidden md:block" />
                ニュース、インタビュー、イベント情報をどこよりも深く。
              </p>
              <div className="flex flex-wrap gap-5">
                <Button size="lg" className="rounded-2xl px-10 h-16 text-lg font-black shadow-2xl shadow-primary/40 hover:scale-105 transition-all" asChild>
                  <Link href="/category/Campus">記事を読む</Link>
                </Button>
                <Button size="lg" variant="outline" className="rounded-2xl px-10 h-16 text-lg font-black border-white/20 hover:bg-white/10 backdrop-blur-sm transition-all" asChild>
                  <Link href="/login">管理コンソール</Link>
                </Button>
              </div>
            </div>
          </div>
          {/* 背景の装飾 */}
          <div className="absolute top-0 right-0 w-full lg:w-2/3 h-full bg-[radial-gradient(circle_at_70%_30%,rgba(51,102,153,0.2),transparent_70%)] pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        </section>

        {/* ニュースティッカー */}
        <div className="bg-white border-b sticky top-16 z-40 shadow-sm overflow-hidden">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-8">
            <div className="flex items-center gap-4 text-sm font-black text-slate-900 shrink-0">
              <div className="bg-primary/10 text-primary px-3 py-1 rounded-lg flex items-center gap-2">
                <TrendingUp size={16} />
                <span className="uppercase tracking-widest text-[10px]">Latest</span>
              </div>
              <span className="hidden sm:inline">北海学園大学の最新ニュースをチェック</span>
            </div>
            <div className="flex items-center gap-3 text-slate-400 font-bold text-xs uppercase tracking-widest">
              <Calendar size={14} className="text-primary" />
              <span>{currentTime || 'Loading...'}</span>
            </div>
          </div>
        </div>

        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-16 border-b border-slate-200 pb-8">
              <div className="space-y-2">
                <h2 className="text-4xl font-black tracking-tight text-slate-900">最新のストーリー</h2>
                <div className="h-1.5 w-24 bg-primary rounded-full" />
              </div>
              <Button variant="ghost" className="font-black gap-2 text-primary hover:text-primary hover:bg-primary/5 rounded-2xl px-6" asChild>
                <Link href="/category/Campus">
                  VIEW ALL STORIES <ArrowRight size={18} />
                </Link>
              </Button>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-40">
                <div className="relative">
                  <Loader2 className="animate-spin text-primary" size={60} strokeWidth={3} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                  </div>
                </div>
                <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.4em] mt-8">Database Synchronizing</p>
              </div>
            ) : publishedArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {publishedArticles.map((article) => (
                  <ArticleCard key={article.id} article={article as any} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-[40px] p-32 text-center border border-slate-100 shadow-xl shadow-slate-200/50">
                <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10">
                  <Ghost className="text-slate-200" size={48} />
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">記事がまだありません</h3>
                <p className="text-slate-500 font-bold max-w-sm mx-auto leading-relaxed">
                  管理画面から最初のニュースを投稿するか、<br />noteから記事を同期してください。
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="bg-slate-950 text-slate-500 py-24 border-t border-slate-900">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="bg-primary p-2 rounded-xl text-white">
              <Newspaper size={28} />
            </div>
            <span className="font-black text-3xl tracking-tighter text-white uppercase italic">北海学園大学新聞</span>
          </div>
          <div className="flex justify-center gap-10 mb-12 text-[10px] font-black uppercase tracking-[0.3em]">
            <Link href="/" className="hover:text-white transition-colors">About Us</Link>
            <Link href="/" className="hover:text-white transition-colors">Contact</Link>
            <Link href="/" className="hover:text-white transition-colors">Archives</Link>
            <Link href="/login" className="hover:text-white transition-colors">Admin</Link>
          </div>
          <p className="text-[10px] font-bold tracking-[0.5em] uppercase opacity-30">
            &copy; {new Date().getFullYear()} 北海学園大学新聞 / REPORTING FOR THE FUTURE
          </p>
        </div>
      </footer>
    </div>
  );
}
