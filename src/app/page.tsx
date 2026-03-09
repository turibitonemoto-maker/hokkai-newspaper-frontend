
'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Navbar } from '@/components/Navbar';
import { ArticleCard } from '@/components/ArticleCard';
import { Newspaper, Loader2, Calendar, Hash, ChevronRight, Megaphone } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

/**
 * ヒーローセクションを削除し、記事一覧と分類をメインに据えたトップページ。
 * サイト全体は中央にボックスレイアウトで配置されています。
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

  // 最新記事（上位12件を表示）
  const latestArticles = articles?.slice(0, 12) || [];

  const adPlaceholder = PlaceHolderImages.find(img => img.id === 'ad-placeholder');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-body">
      <Navbar />
      
      <main className="flex-grow">
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            
            {/* 新聞記事の分類 */}
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-6">
                <Hash size={16} className="text-primary" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">新聞記事の分類</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {categories.map((cat) => (
                  <Link 
                    key={cat.id} 
                    href={`/category/${cat.id}`}
                    className="group relative flex flex-col items-center justify-center p-4 bg-white rounded-[20px] border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  >
                    <span className="text-xs font-black text-slate-900 mb-0.5">{cat.label}</span>
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{cat.id}</span>
                    <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 ${cat.color} rounded-t-full group-hover:w-1/2 transition-all duration-300`} />
                  </Link>
                ))}
              </div>
            </div>

            {/* 広告セクション */}
            <div className="mb-16">
              <div className="flex items-center gap-2 mb-4">
                <Megaphone size={14} className="text-slate-400" />
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">SPONSORED / 広告</span>
              </div>
              <div className="relative w-full h-24 md:h-32 bg-slate-200 rounded-[24px] overflow-hidden group cursor-pointer shadow-inner border border-slate-100">
                {adPlaceholder && (
                  <Image 
                    src={adPlaceholder.imageUrl} 
                    alt="Advertisement" 
                    fill 
                    className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/5 group-hover:bg-transparent transition-all">
                  <div className="bg-white/90 backdrop-blur-sm px-6 py-2 rounded-full shadow-xl">
                    <p className="text-[10px] font-black tracking-widest text-slate-900">広告募集中</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 最新の記事の見出し */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <h2 className="text-3xl md:text-5xl font-black tracking-tighter italic uppercase text-slate-900 leading-none">最新の記事</h2>
                <div className="h-1.5 w-16 bg-primary mt-3 rounded-full" />
              </div>
              <div className="flex items-center gap-2.5 text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] bg-white px-5 py-2.5 rounded-xl shadow-sm border border-slate-100">
                <Calendar size={12} className="text-primary" /> <span>{currentTime || '...'}</span>
              </div>
            </div>

            {/* 記事グリッド（小型化・左寄せ） */}
            {isArticlesLoading ? (
              <div className="flex flex-col items-center justify-center py-24">
                <Loader2 className="animate-spin text-primary mb-4" size={48} strokeWidth={3} />
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.5em]">Synchronizing Feed</p>
              </div>
            ) : latestArticles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 animate-fade-in">
                {latestArticles.map((article) => (
                  <div key={article.id} className="max-w-full">
                    <ArticleCard article={article as any} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-24 text-center bg-white rounded-[32px] shadow-sm border border-dashed border-slate-200">
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">No stories found in the archives</p>
              </div>
            )}

            {/* もっと見るボタン */}
            {articles && articles.length > 12 && (
              <div className="mt-16 text-left">
                <Link 
                  href="/category/Campus" 
                  className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-full font-black text-[10px] uppercase tracking-[0.2em] hover:bg-primary transition-colors shadow-xl"
                >
                  View More Stories <ChevronRight size={14} />
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="bg-slate-950 text-slate-600 py-12 text-center border-t border-slate-900">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 mb-6 opacity-50">
            <Newspaper size={20} className="text-primary" />
            <span className="font-black text-lg tracking-tighter text-white">
              北海学園大学<span className="text-primary">新聞</span>
            </span>
          </div>
          <p className="text-[9px] font-black uppercase tracking-[0.3em]">
            &copy; {new Date().getFullYear()} 北海学園大学新聞 / REPORTING FOR THE FUTURE
          </p>
        </div>
      </footer>
    </div>
  );
}
