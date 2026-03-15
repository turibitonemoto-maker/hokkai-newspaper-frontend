'use client';

import { useCollection, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, where, doc } from 'firebase/firestore';
import { ArticleCard } from '@/components/ArticleCard';
import { PaperCard } from '@/components/PaperCard';
import { Loader2, Calendar, Megaphone, CheckCircle2, AlertCircle, ChevronRight, BookOpen } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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
        let endTime = new Date(ad.displayEndTime?.seconds ? ad.displayEndTime.seconds * 1000 : ad.displayEndTime);
        return endTime.getTime() > now.getTime();
      } catch (e) { return true; }
    });
    return validAds.length > 0 ? validAds[0] : null;
  }, [ads, now]);

  const categoryList = ['Event', 'Interview', 'Sports', 'Column', 'Opinion', 'Paper'];

  const latestArticles = useMemo(() => articles?.slice(0, 4) || [], [articles]);
  
  const categoryGroups = useMemo(() => {
    if (!articles) return {};
    const groups: Record<string, any[]> = {};
    categoryList.forEach(cat => {
      groups[cat] = articles.filter(a => a.categoryId === cat);
    });
    return groups;
  }, [articles]);

  const paperGroupedByDate = useMemo(() => {
    const papers = categoryGroups['Paper'] || [];
    const grouped: Record<string, any[]> = {};
    papers.forEach(p => {
      const date = p.publishDate?.split('T')[0] || 'Unknown Date';
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(p);
    });
    return Object.entries(grouped).sort((a, b) => b[0].localeCompare(a[0])).slice(0, 2); // 最新2日分をトップに
  }, [categoryGroups]);

  return (
    <section className="container mx-auto px-4 md:px-0 pb-32 animate-fade-in">
      {/* 稼働ステータス */}
      <div className="mb-10 flex justify-start">
        <Badge variant="outline" className="gap-2 px-5 py-2 border-emerald-200 bg-emerald-50 text-emerald-700 font-black rounded-full shadow-sm text-[10px] tracking-widest uppercase">
          <CheckCircle2 size={14} /> STATUS: OPERATIONAL
        </Badge>
      </div>

      {/* 最新ニュース */}
      <div className="mb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-slate-100 pb-12">
          <div className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic">
            <span className="text-primary">最新</span>の<span className="text-slate-950">ニュース</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm w-fit">
            <Calendar size={14} className="text-primary" /> <span>{currentTime || 'Synchronizing...'}</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
          {latestArticles.map((article, idx) => (
            <ArticleCard key={article.id} article={article as any} priority={idx < 4} />
          ))}
        </div>
      </div>

      {/* 広告エリア */}
      <div className="mb-32">
        <div className="flex items-center gap-2 mb-6">
          <Megaphone size={16} className="text-primary" />
          <span className="text-xs font-black uppercase tracking-[0.5em] text-slate-900 italic">SPONSORED MEDIA</span>
        </div>
        {activeAd ? (
          <Link href={activeAd.linkUrl || '#'} target="_blank" className="relative block w-full h-32 md:h-48 rounded-[40px] md:rounded-[56px] overflow-hidden group shadow-2xl ring-1 ring-slate-100 bg-slate-50 transition-all hover:ring-primary/20">
            <Image src={activeAd.imageUrl} alt="Ad" fill className="object-cover transition-transform duration-1000 group-hover:scale-105" priority />
          </Link>
        ) : (
          <div className="w-full h-32 bg-slate-50 rounded-[40px] border border-dashed border-slate-200 flex items-center justify-center text-[10px] font-black tracking-[0.6em] text-slate-300 uppercase">
            Public Information Space
          </div>
        )}
      </div>

      {/* 紙面ビューアーセクション (道新リバイバル) */}
      <div className="mb-32">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b-2 border-primary/20">
          <div className="flex items-center gap-4">
            <div className="bg-primary p-3 rounded-2xl text-white shadow-lg">
              <BookOpen size={24} />
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-slate-950 font-yuji">紙面ビューアー</h2>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-full font-black text-[10px] px-6 h-9 border-primary text-primary">サンプルを見る</Button>
            <Button variant="outline" className="rounded-full font-black text-[10px] px-6 h-9 border-primary text-primary">使い方を見る</Button>
          </div>
        </div>

        <div className="space-y-12">
          {paperGroupedByDate.map(([date, papers]) => (
            <div key={date} className="space-y-6">
              <div className="bg-primary px-6 py-2 rounded-sm text-white font-black text-sm tracking-widest">
                {date.replace(/-/g, '/')} (最新紙面)
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-10">
                {papers.map((paper) => (
                  <PaperCard key={paper.id} article={paper as any} />
                ))}
              </div>
            </div>
          ))}
          <div className="flex justify-end pt-4">
            <Link href="/category/Paper" className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:text-slate-950 transition-colors">
              VIEW ARCHIVES <ChevronRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* その他のカテゴリー */}
      <div className="space-y-32">
        {categoryList.filter(c => c !== 'Paper').map((category) => {
          const catArticles = categoryGroups[category]?.slice(0, 4) || [];
          if (catArticles.length === 0) return null;
          return (
            <div key={category}>
              <div className="flex items-center justify-between mb-10 border-l-8 border-primary pl-6">
                <div>
                  <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic text-slate-950">{category}</h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-2">{category} SECTION</p>
                </div>
                <Link href={`/category/${category}`} className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:text-slate-950 transition-colors">
                  VIEW ALL <ChevronRight size={14} />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
                {catArticles.map((article) => (
                  <ArticleCard key={article.id} article={article as any} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
