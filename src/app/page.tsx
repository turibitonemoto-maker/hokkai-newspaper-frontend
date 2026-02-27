'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Navbar } from '@/components/Navbar';
import { ArticleCard } from '@/components/ArticleCard';
import { Button } from '@/components/ui/button';
import { Newspaper, Loader2, TrendingUp, Calendar, Ghost } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Home() {
  const db = useFirestore();
  const [currentTime, setCurrentTime] = useState<string | null>(null);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

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
      orderBy('publishDate', 'desc')
    );
  }, [db]);

  const heroImagesRef = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'hero-images'), orderBy('order', 'asc'));
  }, [db]);

  const { data: articles, isLoading: isArticlesLoading } = useCollection(latestArticlesRef);
  const { data: heroImages, isLoading: isHeroLoading } = useCollection(heroImagesRef);

  useEffect(() => {
    if (heroImages && heroImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [heroImages]);

  const publishedArticles = articles ? articles.filter(a => a.isPublished) : [];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-body">
      <Navbar />
      
      <main className="flex-grow">
        <section className="relative h-[65vh] min-h-[500px] flex items-center overflow-hidden bg-slate-900 text-white">
          <div className="absolute inset-0 z-0">
            {heroImages && heroImages.length > 0 ? (
              heroImages.map((img, idx) => (
                <div
                  key={img.id}
                  style={{ 
                    opacity: idx === currentHeroIndex ? 1 : 0, 
                    transition: 'opacity 2000ms ease-in-out',
                    position: 'absolute',
                    inset: 0
                  }}
                >
                  <Image
                    src={img.imageUrl}
                    alt="Campus Hero"
                    fill
                    className="object-cover"
                    priority={idx === 0}
                  />
                  <div className="absolute inset-0 bg-slate-950/30 backdrop-blur-[1px]" />
                </div>
              ))
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-primary/20" />
            )}
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-white/20 backdrop-blur-md">
                <Newspaper size={14} />
                <span>Hokkai Gakuen University Newspaper</span>
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-8 leading-[1.1] flex flex-col">
                <span className="block mb-2 opacity-90">キャンパスの</span>
                <span className="whitespace-nowrap">
                  <span className="text-primary italic bg-white/10 px-4 rounded-2xl mr-2">「いま」</span>を届ける。
                </span>
              </h1>
              <p className="text-base md:text-xl text-slate-300 mb-10 leading-relaxed font-medium max-w-xl">
                学生の視点で記録する。学内のニュース、<br className="hidden md:block" />
                インタビュー、イベント情報をどこよりも深く。
              </p>
              <div>
                <Button size="lg" className="rounded-2xl px-10 h-14 text-sm font-black shadow-2xl shadow-primary/30 hover:scale-105 transition-all" asChild>
                  <Link href="/category/Campus">記事をすべて見る</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <div className="bg-white border-b sticky top-16 z-40 shadow-sm overflow-hidden">
          <div className="container mx-auto px-4 h-14 flex items-center justify-between gap-8">
            <div className="flex items-center gap-4 text-xs font-black text-slate-900 shrink-0">
              <div className="bg-primary/10 text-primary px-3 py-1 rounded-lg flex items-center gap-2">
                <TrendingUp size={14} />
                <span className="uppercase tracking-widest text-[9px]">Latest</span>
              </div>
              <span className="hidden sm:inline">最新の記事一覧</span>
            </div>
            <div className="flex items-center gap-3 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
              <Calendar size={14} className="text-primary" />
              <span>{currentTime || 'Loading...'}</span>
            </div>
          </div>
        </div>

        <section id="latest-articles" className="py-20 min-h-[1000px]">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-12 border-b border-slate-200 pb-6">
              <div className="space-y-2">
                <h2 className="text-3xl font-black tracking-tight text-slate-900">最新の記事</h2>
                <div className="h-1 w-20 bg-primary rounded-full" />
              </div>
            </div>

            {isArticlesLoading ? (
              <div className="flex flex-col items-center justify-center py-32">
                <Loader2 className="animate-spin text-primary mb-4" size={48} strokeWidth={3} />
                <p className="text-slate-400 font-black uppercase text-[9px] tracking-[0.4em]">Database Synchronizing</p>
              </div>
            ) : publishedArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {publishedArticles.map((article) => (
                  <ArticleCard key={article.id} article={article as any} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-[40px] p-24 text-center border border-slate-100 shadow-xl shadow-slate-200/50">
                <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Ghost className="text-slate-200" size={40} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">記事がまだありません</h3>
                <p className="text-slate-500 font-bold max-w-sm mx-auto text-sm leading-relaxed">
                  管理画面から最初のニュースを投稿するか、<br />noteから記事を同期してください。
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="bg-slate-950 text-slate-500 py-20 border-t border-slate-900">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="bg-primary p-2 rounded-xl text-white">
              <Newspaper size={24} />
            </div>
            <span className="font-black text-2xl tracking-tighter text-white uppercase italic">北海学園大学新聞</span>
          </div>
          <div className="flex flex-col gap-4 items-center">
            <p className="text-[9px] font-bold tracking-[0.5em] uppercase opacity-30">
              &copy; {new Date().getFullYear()} 北海学園大学新聞 / REPORTING FOR THE FUTURE
            </p>
            <Link href="/login" className="text-[10px] font-bold text-slate-800 hover:text-slate-600 transition-colors uppercase tracking-widest opacity-20 hover:opacity-100">
              Admin Login
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}