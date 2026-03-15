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
 * 行間密度を黄金比に詰め、知恵熱(警告)を鎮圧。
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

  const allArticlesRef = useMemoFirebase(() => {
    if (!db) return null;
    return query(
      collection(db, 'articles'),
      where('isPublished', '==', true),
      orderBy('publishDate', 'desc')
    );
  }, [db]);

  const { data: articles, isLoading: isArticlesLoading } = useCollection(allArticlesRef);

  const siteSettingsRef = useMemoFirebase(() => {
    if (!db) return null;
    return doc(db, 'settings', 'maintenance');
  }, [db]);
  const { data: settings } = useDoc(siteSettingsRef);

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

  const latestArticles = useMemo(() => articles?.slice(0, 12) || [], [articles]);

  return (
    <section className="container mx-auto px-4 md:px-0 pb-20 animate-fade-in">
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

      <div className="mb-16">
        <div className="flex items-center gap-2 mb-4">
          <Megaphone size={14} className="text-slate-400" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">SPONSORED MEDIA</span>
        </div>
        
        {isAdsLoading ? (
          <div className="w-full h-32 bg-slate-50 rounded-[32px] animate-pulse" />
        ) : activeAd ? (
          <Link href={activeAd.linkUrl || '#'} target="_blank" className="relative block w-full h-24 md:h-36 rounded-[32px] md:rounded-[48px] overflow-hidden group shadow-xl ring-8 ring-white border border-slate-100 bg-slate-50">
            <Image 
              src={activeAd.imageUrl} 
              alt={activeAd.title || "Ad"} 
              fill 
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover transition-transform duration-700 group-hover:scale-105" 
              priority 
            />
            <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
          </Link>
        ) : (
          <div className="relative w-full h-24 md:h-32 bg-slate-50 rounded-[32px] overflow-hidden shadow-inner border border-dashed border-slate-200 flex items-center justify-center">
            <p className="text-[10px] font-black tracking-[0.5em] text-slate-300 uppercase">Public Information Space</p>
          </div>
        )}
      </div>

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10 animate-fade-in mb-24">
          {latestArticles.map((article, idx) => (
            <ArticleCard key={article.id} article={article as any} priority={idx < 4} />
          ))}
        </div>
      ) : (
        <div className="py-32 text-center bg-white rounded-[48px] border-2 border-dashed border-slate-100">
          <p className="text-slate-300 font-black uppercase text-xs tracking-[0.5em]">No stories available at this moment</p>
        </div>
      )}
    </section>
  );
}
