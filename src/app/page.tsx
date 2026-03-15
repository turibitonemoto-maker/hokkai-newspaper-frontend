'use client';

import { useCollection, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, where, doc } from 'firebase/firestore';
import { ArticleCard } from '@/components/ArticleCard';
import { Loader2, Calendar, Megaphone, CheckCircle2, AlertCircle, ChevronRight } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

/**
 * トップページ (大規模メディア・セクション構成版)
 * 「最新4枚」＋「カテゴリー別各4枚」の重層構造で、情報の網羅性を極限まで高めました。
 */
export default function Home() {
  const db = useFirestore();
  const [currentTime, setCurrentTime] = useState<string | null>(null);
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    setCurrentTime(new Date().toLocaleDateString('ja-JP', { 
      year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' 
    }));
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // 全公開記事の取得
  const allArticlesRef = useMemoFirebase(() => {
    if (!db) return null;
    return query(
      collection(db, 'articles'),
      where('isPublished', '==', true),
      orderBy('publishDate', 'desc')
    );
  }, [db]);

  const { data: articles, isLoading: isArticlesLoading } = useCollection(allArticlesRef);

  // メンテナンス設定
  const siteSettingsRef = useMemoFirebase(() => {
    if (!db) return null;
    return doc(db, 'settings', 'maintenance');
  }, [db]);
  const { data: settings } = useDoc(siteSettingsRef);

  // 広告取得
  const adsRef = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, 'ads');
  }, [db]);
  const { data: ads, isLoading: isAdsLoading } = useCollection(adsRef);

  const activeAd = useMemo(() => {
    if (!ads || ads.length === 0) return null;
    const validAds = ads.filter(ad => {
      if (!ad.imageUrl) return false;
      if (!ad.displayEndTime) return true;
      try {
        let endTime: Date;
        if (ad.displayEndTime?.seconds) {
          endTime = new Date(ad.displayEndTime.seconds * 1000);
        } else {
          endTime = new Date(ad.displayEndTime);
        }
        return endTime.getTime() > now.getTime();
      } catch (e) {
        return true; 
      }
    });
    return validAds.length > 0 ? validAds[0] : null;
  }, [ads, now]);

  // カテゴリーリスト（表示順）
  const categoryList = ['Campus', 'Event', 'Interview', 'Sports', 'Column', 'Opinion', 'Paper'];

  // データ分類ロジック
  const latestArticles = useMemo(() => articles?.slice(0, 4) || [], [articles]);
  
  const categoryGroups = useMemo(() => {
    if (!articles) return {};
    const groups: Record<string, any[]> = {};
    categoryList.forEach(cat => {
      groups[cat] = articles.filter(a => a.categoryId === cat).slice(0, 4);
    });
    return groups;
  }, [articles]);

  return (
    <section className="container mx-auto px-4 md:px-0 pb-32 animate-fade-in">
      {/* 稼働ステータス */}
      <div className="mb-10 flex justify-start">
        {settings?.isMaintenanceMode ? (
          <Badge variant="outline" className="gap-2 px-5 py-2 border-amber-200 bg-amber-50 text-amber-700 font-black rounded-full shadow-sm text-[10px] tracking-widest uppercase">
            <AlertCircle size={14} /> STATUS: MAINTENANCE
          </Badge>
        ) : (
          <Badge variant="outline" className="gap-2 px-5 py-2 border-emerald-200 bg-emerald-50 text-emerald-700 font-black rounded-full shadow-sm text-[10px] tracking-widest uppercase">
            <CheckCircle2 size={14} /> STATUS: OPERATIONAL
          </Badge>
        )}
      </div>

      {/* 広告エリア */}
      <div className="mb-16">
        <div className="flex items-center gap-2 mb-4">
          <Megaphone size={14} className="text-slate-400" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">SPONSORED MEDIA</span>
        </div>
        
        {isAdsLoading ? (
          <div className="w-full h-32 bg-slate-50 rounded-[32px] animate-pulse" />
        ) : activeAd ? (
          <Link href={activeAd.linkUrl || '#'} target="_blank" className="relative block w-full h-24 md:h-36 rounded-[32px] md:rounded-[48px] overflow-hidden group shadow-xl ring-1 ring-slate-100 bg-slate-50">
            <Image 
              src={activeAd.imageUrl} 
              alt={activeAd.title || "Ad"} 
              fill 
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover transition-transform duration-700 group-hover:scale-105" 
              priority 
            />
          </Link>
        ) : (
          <div className="relative w-full h-24 md:h-32 bg-slate-50 rounded-[32px] overflow-hidden shadow-inner border border-dashed border-slate-200 flex items-center justify-center">
            <p className="text-[10px] font-black tracking-[0.5em] text-slate-300 uppercase">Public Information Space</p>
          </div>
        )}
      </div>

      {/* --- セクション 1: 最新ニュース --- */}
      <div className="mb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-slate-100 pb-12">
          <div className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic">
            <span className="text-primary">最新</span>の<span className="text-slate-950">ニュース</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm w-fit">
            <Calendar size={14} className="text-primary" /> <span>{currentTime || 'Synchronizing...'}</span>
          </div>
        </div>

        {isArticlesLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-primary mb-6 size-12" strokeWidth={3} />
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">Syncing Archives...</p>
          </div>
        ) : latestArticles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10 animate-fade-in">
            {latestArticles.map((article, idx) => (
              <ArticleCard key={article.id} article={article as any} priority={idx < 4} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-white rounded-[48px] border-2 border-dashed border-slate-100">
            <p className="text-slate-300 font-black uppercase text-xs tracking-[0.5em]">No stories available</p>
          </div>
        )}
      </div>

      {/* --- セクション 2～N: カテゴリー別ニュース --- */}
      <div className="space-y-32">
        {categoryList.map((category) => {
          const catArticles = categoryGroups[category] || [];
          if (catArticles.length === 0) return null;

          return (
            <div key={category} className="animate-fade-in">
              <div className="flex items-center justify-between mb-10 border-l-8 border-primary pl-6">
                <div>
                  <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic text-slate-950">
                    {category === 'Paper' ? '紙面ビューアー' : category}
                  </h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-2">
                    {category} SECTION
                  </p>
                </div>
                <Link 
                  href={`/category/${category}`} 
                  className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:text-slate-950 transition-colors"
                >
                  VIEW ALL <ChevronRight size={14} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
                {catArticles.map((article) => (
                  <ArticleCard key={`${category}-${article.id}`} article={article as any} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
