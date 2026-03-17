'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { ArticleCard } from '@/components/ArticleCard';
import { PaperCard } from '@/components/PaperCard';
import { Loader2, Megaphone, BookOpen, ChevronRight } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';

/**
 * ホームページ (紙面ビューアー強化版・広告最優先レイアウト)
 * 閲覧専用フロントエンドとして、多角的なニュース体験を提供。
 */
export default function Home() {
  const db = useFirestore();
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const baseQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(
      collection(db, 'articles'),
      orderBy('publishDate', 'desc')
    );
  }, [db]);

  const { data: allArticles, isLoading: isArticlesLoading } = useCollection(baseQuery);

  const articles = useMemo(() => {
    return allArticles?.filter(a => a.isPublished === true) || [];
  }, [allArticles]);

  const adsRef = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, 'ads');
  }, [db]);
  const { data: ads } = useCollection(adsRef);

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

  const categoryList = ['Event', 'Interview', 'Sports', 'Column', 'Opinion', 'Paper', 'Viewer'];

  const latestArticles = useMemo(() => {
    return articles.filter(a => a.categoryId !== 'Paper' && a.categoryId !== 'Viewer').slice(0, 4);
  }, [articles]);
  
  const categoryGroups = useMemo(() => {
    const groups: Record<string, any[]> = {};
    categoryList.forEach(cat => {
      groups[cat] = articles.filter(a => a.categoryId === cat);
    });
    return groups;
  }, [articles]);

  const paperGroupedByDate = useMemo(() => {
    const papers = [...(categoryGroups['Paper'] || []), ...(categoryGroups['Viewer'] || [])];
    const grouped: Record<string, any[]> = {};
    papers.forEach(p => {
      const date = p.publishDate?.split('T')[0] || 'Unknown Date';
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(p);
    });
    return Object.entries(grouped).sort((a, b) => b[0].localeCompare(a[0])).slice(0, 2);
  }, [categoryGroups]);

  return (
    <section className="container mx-auto px-4 md:px-0 pb-32 animate-fade-in">
      {/* 最新ニュースセクション：見出しを青バー化 */}
      <div className="mb-20">
        <div className="bg-primary px-8 py-6 rounded-sm mb-12 shadow-lg shadow-primary/10">
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic text-white leading-none">
            最新のニュース
          </h2>
          <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.4em] mt-3">Latest News Selection</p>
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

      {/* 紙面ビューアーセクション */}
      <div className="mb-32">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b-2 border-primary/20">
          <div className="flex items-center gap-4">
            <div className="bg-primary p-3 rounded-2xl text-white shadow-lg">
              <BookOpen size={24} />
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-slate-950 uppercase italic">紙面ビューアー</h2>
          </div>
        </div>

        {isArticlesLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-primary" size={40} />
          </div>
        ) : paperGroupedByDate.length > 0 ? (
          <div className="space-y-12">
            {paperGroupedByDate.map(([date, papers]) => (
              <div key={date} className="space-y-6">
                <div className="bg-primary px-6 py-2 rounded-sm text-white font-black text-xs tracking-widest flex items-center gap-4">
                  <span>{date.replace(/-/g, '/')}</span>
                  <span className="opacity-50 text-[10px]">発行分</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-10">
                  {papers.map((paper) => (
                    <PaperCard key={paper.id} article={paper as any} />
                  ))}
                </div>
              </div>
            ))}
            <div className="flex justify-end pt-4">
              <Link href="/viewer" className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:text-slate-950 transition-colors">
                VIEW ARCHIVES <ChevronRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 rounded-[32px] p-20 text-center border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-bold text-sm tracking-widest">紙面データがありません</p>
          </div>
        )}
      </div>

      {/* カテゴリ別セクション */}
      <div className="space-y-32">
        {categoryList.filter(c => c !== 'Paper' && c !== 'Viewer').map((category) => {
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
