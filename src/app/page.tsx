'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { ArticleCard } from '@/components/ArticleCard';
import { Loader2, Calendar, Megaphone, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const db = useFirestore();
  const [currentTime, setCurrentTime] = useState<string | null>(null);

  useEffect(() => {
    setCurrentTime(new Date().toLocaleDateString('ja-JP', { 
      year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' 
    }));
  }, []);

  const allArticlesRef = useMemoFirebase(() => {
    if (!db) return null;
    return query(
      collection(db, 'articles'),
      orderBy('publishDate', 'desc')
    );
  }, [db]);

  const { data: articles, isLoading: isArticlesLoading } = useCollection(allArticlesRef);

  const latestArticles = articles?.slice(0, 12) || [];
  const adPlaceholder = PlaceHolderImages.find(img => img.id === 'ad-placeholder');

  return (
    <section className="container mx-auto px-0 pb-20">
      {/* 広告セクション */}
      <div className="mb-10 md:mb-16 mt-4 md:mt-8 px-4 md:px-0">
        <div className="flex items-center gap-2 mb-3">
          <Megaphone size={12} className="text-slate-400" />
          <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">SPONSORED / 広告</span>
        </div>
        <div className="relative w-full h-20 md:h-32 bg-slate-50 rounded-[16px] md:rounded-[24px] overflow-hidden group cursor-pointer shadow-inner border border-slate-100">
          {adPlaceholder && (
            <Image 
              src={adPlaceholder.imageUrl} 
              alt="Advertisement" 
              fill 
              className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
            />
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/5 group-hover:bg-transparent transition-all">
            <div className="bg-white/90 backdrop-blur-sm px-4 md:px-6 py-1.5 md:py-2 rounded-full shadow-xl border">
              <p className="text-[8px] md:text-[10px] font-black tracking-widest text-slate-900 uppercase">広告募集中</p>
            </div>
          </div>
        </div>
      </div>

      {/* 最新の記事の見出し */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6 mb-8 md:mb-10 border-b border-slate-100 pb-6 md:pb-8 px-4 md:px-0">
        <div>
          <div className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic">
            <span className="text-primary">最新</span>
            <span className="text-slate-950">の</span>
            <span className="text-primary">記事</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-slate-400 font-bold text-[8px] md:text-[10px] uppercase tracking-[0.2em] bg-slate-50 px-4 md:px-5 py-2 md:py-2.5 rounded-lg md:rounded-xl border border-slate-100 w-fit">
          <Calendar size={10} className="text-primary md:size-3" /> <span>{currentTime || '...'}</span>
        </div>
      </div>

      {/* 記事グリッド */}
      {isArticlesLoading ? (
        <div className="flex flex-col items-center justify-center py-20 md:py-24">
          <Loader2 className="animate-spin text-primary mb-4 size-10 md:size-12" strokeWidth={3} />
          <p className="text-[8px] md:text-[9px] font-black text-slate-300 uppercase tracking-[0.5em]">Synchronizing Feed</p>
        </div>
      ) : latestArticles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 animate-fade-in mb-16 px-4 md:px-0">
          {latestArticles.map((article) => (
            <ArticleCard key={article.id} article={article as any} />
          ))}
        </div>
      ) : (
        <div className="py-20 md:py-24 text-center bg-white rounded-[24px] md:rounded-[32px] border border-dashed border-slate-200 mx-4 md:mx-0">
          <p className="text-slate-400 font-bold uppercase text-[8px] md:text-[10px] tracking-[0.3em]">No stories found in the archives</p>
        </div>
      )}

      {/* もっと見るボタン */}
      {articles && articles.length > 12 && (
        <div className="mb-20 px-4 md:px-0 text-center md:text-left">
          <Link 
            href="/category/Campus" 
            className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-slate-900 text-white rounded-full font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] hover:bg-primary transition-all shadow-xl hover:scale-105 active:scale-95"
          >
            View More Stories <ChevronRight className="size-3 md:size-[14px]" />
          </Link>
        </div>
      )}
    </section>
  );
}
