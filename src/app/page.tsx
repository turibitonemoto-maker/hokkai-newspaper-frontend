'use client';

import { useCollection, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, where, doc } from 'firebase/firestore';
import { ArticleCard } from '@/components/ArticleCard';
import { Loader2, Calendar, Megaphone, CheckCircle2, AlertCircle } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

/**
 * トップページ (ビルド・最適化版)
 * 広告の自動終了ロジックを強化し、ミリ秒単位での正確な判定を実現。
 */
export default function Home() {
  const db = useFirestore();
  const [currentTime, setCurrentTime] = useState<string | null>(null);
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    setCurrentTime(new Date().toLocaleDateString('ja-JP', { 
      year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' 
    }));
    // 1分ごとに現在時刻を更新して広告フィルターを適用
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // 記事データの取得
  const allArticlesRef = useMemoFirebase(() => {
    if (!db) return null;
    return query(
      collection(db, 'articles'),
      where('isPublished', '==', true),
      orderBy('publishDate', 'desc')
    );
  }, [db]);

  const { data: articles, isLoading: isArticlesLoading } = useCollection(allArticlesRef);

  // メンテナンス設定の取得
  const siteSettingsRef = useMemoFirebase(() => {
    if (!db) return null;
    return doc(db, 'settings', 'maintenance');
  }, [db]);
  const { data: settings } = useDoc(siteSettingsRef);

  // 広告データの取得
  const adsRef = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, 'ads');
  }, [db]);
  const { data: ads, isLoading: isAdsLoading } = useCollection(adsRef);

  // 広告の自動終了ロジック
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

  const latestArticles = useMemo(() => articles?.slice(0, 12) || [], [articles]);

  return (
    <section className="container mx-auto px-4 md:px-0 pb-20">
      {/* 稼働状況表示 */}
      <div className="mb-8 flex justify-start">
        {settings?.isMaintenanceMode ? (
          <Badge variant="outline" className="gap-2 px-4 py-1.5 border-amber-200 bg-amber-50 text-amber-700 font-black rounded-full shadow-sm">
            <AlertCircle size={14} /> 稼働状況：停止中
          </Badge>
        ) : (
          <Badge variant="outline" className="gap-2 px-4 py-1.5 border-emerald-200 bg-emerald-50 text-emerald-700 font-black rounded-full shadow-sm">
            <CheckCircle2 size={14} /> 稼働状況：正常
          </Badge>
        )}
      </div>

      {/* 広告エリア：READMEの軽量化方針に準拠 */}
      <div className="mb-10 md:mb-16">
        <div className="flex items-center gap-2 mb-3">
          <Megaphone size={12} className="text-slate-400" />
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">SPONSORED</span>
        </div>
        
        {isAdsLoading ? (
          <div className="w-full h-20 md:h-32 bg-slate-50 rounded-[24px] animate-pulse" />
        ) : activeAd ? (
          <Link href={activeAd.linkUrl || '#'} target="_blank" className="relative block w-full h-20 md:h-32 rounded-[24px] overflow-hidden group shadow-md border bg-slate-100">
            <Image 
              src={activeAd.imageUrl} 
              alt={activeAd.title || "Advertisement"} 
              fill 
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover transition-transform group-hover:scale-105" 
              priority 
            />
          </Link>
        ) : (
          <div className="relative w-full h-20 md:h-32 bg-slate-50 rounded-[24px] overflow-hidden shadow-inner border flex items-center justify-center">
            <p className="text-[10px] font-black tracking-[0.5em] text-slate-200 uppercase">Advertising Space</p>
          </div>
        )}
      </div>

      {/* 最新記事セクション */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b border-slate-100 pb-8">
        <div className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic">
          <span className="text-primary">最新</span>の<span className="text-primary">記事</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] bg-slate-50 px-5 py-2.5 rounded-xl border border-slate-100 w-fit">
          <Calendar size={12} className="text-primary" /> <span>{currentTime || '...'}</span>
        </div>
      </div>

      {isArticlesLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-primary mb-4 size-10" strokeWidth={3} />
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">Syncing Archives...</p>
        </div>
      ) : latestArticles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 animate-fade-in mb-16">
          {latestArticles.map((article, idx) => (
            <ArticleCard key={article.id} article={article as any} priority={idx < 4} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-white rounded-[32px] border border-dashed border-slate-200">
          <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.3em]">No stories yet</p>
        </div>
      )}
    </section>
  );
}
