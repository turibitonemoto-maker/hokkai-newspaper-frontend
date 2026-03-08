'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Navbar } from '@/components/Navbar';
import { ArticleCard } from '@/components/ArticleCard';
import { Newspaper, Loader2, Calendar, Hash, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

/**
 * 権限概念を完全に排除したトップページ。
 * ヒーローセクションに大学新聞の英語名称を追加。
 */
export default function Home() {
  const db = useFirestore();
  const [currentTime, setCurrentTime] = useState<string | null>(null);

  useEffect(() => {
    setCurrentTime(new Date().toLocaleDateString('ja-JP', { 
      year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' 
    }));
  }, []);

  // 全記事を取得（最新順）
  const allArticlesRef = useMemoFirebase(() => {
    if (!db) return null;
    return query(
      collection(db, 'articles'),
      orderBy('publishDate', 'desc')
    );
  }, [db]);

  const { data: articles, isLoading: isArticlesLoading } = useCollection(allArticlesRef);

  // カテゴリーリスト
  const categories = [
    { id: 'Announcements', label: 'お知らせ', color: 'bg-blue-500' },
    { id: 'Campus', label: 'キャンパス', color: 'bg-emerald-500' },
    { id: 'Event', label: 'イベント', color: 'bg-amber-500' },
    { id: 'Interview', label: 'インタビュー', color: 'bg-purple-500' },
    { id: 'Sports', label: 'スポーツ', color: 'bg-red-500' },
    { id: 'Opinion', label: 'オピニオン', color: 'bg-slate-600' },
  ];

  // 最新記事（上位6件を表示）
  const latestArticles = articles?.slice(0, 6) || [];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-body">
      <Navbar />
      
      <main className="flex-grow">
        {/* ヒーローセクション */}
        <section className="relative h-[50vh] md:h-[70vh] flex items-center overflow-hidden bg-slate-900 text-white">
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-900 to-primary/20" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-[10px] font-black uppercase tracking-widest mb-6 border border-white/20 backdrop-blur-md">
                <Newspaper size={14} /> <span>Official Website</span>
              </div>
              <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-4 leading-[0.9] italic">
                キャンパスの<br />
                <span className="text-primary not-italic">「いま」</span>を届ける。
              </h1>
              <p className="text-xl md:text-3xl font-black tracking-[0.15em] text-white/80 uppercase mt-8 border-l-4 border-primary pl-6 py-2">
                HOKKAI GAKUEN UNIVERSITY<br />NEWSPAPER
              </p>
            </div>
          </div>
        </section>

        {/* メインコンテンツセクション */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            {/* 見出し */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter italic uppercase text-slate-900 leading-none">最新の記事</h2>
                <div className="h-2 w-24 bg-primary mt-4 rounded-full" />
              </div>
              <div className="flex items-center gap-3 text-slate-400 font-bold text-xs uppercase tracking-[0.2em] bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100">
                <Calendar size={14} className="text-primary" /> <span>{currentTime || '...'}</span>
              </div>
            </div>

            {/* 見出しのすぐ下に配置される分類（カテゴリーナビゲーション） */}
            <div className="mb-16">
              <div className="flex items-center gap-2 mb-6">
                <Hash size={18} className="text-primary" />
                <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">新聞記事の分類</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {categories.map((cat) => (
                  <Link 
                    key={cat.id} 
                    href={`/category/${cat.id}`}
                    className="group relative flex flex-col items-center justify-center p-6 bg-white rounded-[24px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <span className="text-sm font-black text-slate-900 mb-1">{cat.label}</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{cat.id}</span>
                    <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 ${cat.color} rounded-t-full group-hover:w-1/2 transition-all duration-300`} />
                  </Link>
                ))}
              </div>
            </div>

            {/* 記事グリッド */}
            {isArticlesLoading ? (
              <div className="flex flex-col items-center justify-center py-32">
                <Loader2 className="animate-spin text-primary mb-6" size={64} strokeWidth={3} />
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">Synchronizing Feed</p>
              </div>
            ) : latestArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-14 animate-fade-in">
                {latestArticles.map((article) => (
                  <ArticleCard key={article.id} article={article as any} />
                ))}
              </div>
            ) : (
              <div className="py-32 text-center bg-white rounded-[40px] shadow-sm border border-dashed border-slate-200">
                <p className="text-slate-400 font-bold uppercase text-xs tracking-[0.3em]">No stories found in the archives</p>
              </div>
            )}

            {/* もっと見るボタン */}
            {articles && articles.length > 6 && (
              <div className="mt-20 text-center">
                <Link 
                  href="/category/Campus" 
                  className="inline-flex items-center gap-3 px-10 py-5 bg-slate-900 text-white rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-primary transition-colors shadow-2xl"
                >
                  View More Stories <ChevronRight size={16} />
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="bg-slate-950 text-slate-600 py-16 text-center border-t border-slate-900">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 mb-8 opacity-50">
            <Newspaper size={24} className="text-primary" />
            <span className="font-black text-xl tracking-tighter text-white">
              北海学園大学<span className="text-primary">新聞</span>
            </span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em]">
            &copy; {new Date().getFullYear()} 北海学園大学新聞 / REPORTING FOR THE FUTURE
          </p>
        </div>
      </footer>
    </div>
  );
}
