'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, where } from 'firebase/firestore';
import { ArticleCard } from '@/components/ArticleCard';
import { PaperCard } from '@/components/PaperCard';
import { Loader2, ChevronRight } from 'lucide-react';
import { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const CATEGORY_LIST = ['Campus', 'Event', 'Interview', 'Sports', 'Column', 'Opinion'];

export default function Home() {
  const db = useFirestore();

  const baseQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'articles'), where('isPublished', '==', true), orderBy('publishDate', 'desc'));
  }, [db]);

  const { data: articles, isLoading: isArticlesLoading } = useCollection(baseQuery);

  const adsRef = useMemoFirebase(() => (db ? collection(db, 'ads') : null), [db]);
  const { data: ads } = useCollection(adsRef);

  const activeAd = useMemo(() => {
    if (!ads || ads.length === 0) return null;
    const now = new Date().getTime();
    return ads.find(ad => {
      if (!ad.imageUrl) return false;
      if (!ad.displayEndTime) return true;
      const end = ad.displayEndTime?.seconds ? ad.displayEndTime.seconds * 1000 : new Date(ad.displayEndTime).getTime();
      return end > now;
    }) || ads[0];
  }, [ads]);

  const { latestArticles, categoryGroups, paperGroupedByDate } = useMemo(() => {
    if (!articles) return { latestArticles: [], categoryGroups: {}, paperGroupedByDate: [] };
    
    const latest = articles.filter(a => !['paper', 'viewer'].includes(a.categoryId?.toLowerCase())).slice(0, 4);
    
    const groups: Record<string, any[]> = {};
    CATEGORY_LIST.forEach(cat => {
      groups[cat] = articles.filter(a => a.categoryId?.toLowerCase() === cat.toLowerCase()).slice(0, 4);
    });

    const papers = articles.filter(a => ['paper', 'viewer'].includes(a.categoryId?.toLowerCase()));
    const paperGroups: Record<string, any[]> = {};
    papers.forEach(p => {
      const date = p.publishDate?.split('T')[0] || 'Unknown';
      if (!paperGroups[date]) paperGroups[date] = [];
      paperGroups[date].push(p);
    });

    return {
      latestArticles: latest,
      categoryGroups: groups,
      paperGroupedByDate: Object.entries(paperGroups).sort((a, b) => b[0].localeCompare(a[0])).slice(0, 2)
    };
  }, [articles]);

  return (
    <section className="container mx-auto px-4 md:px-0 pb-32 animate-fade-in">
      <div className="mb-20">
        <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-slate-950 mb-10 pb-6 border-b-2 border-primary/20">最新のニュース</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
          {latestArticles.map((article, idx) => <ArticleCard key={article.id} article={article as any} priority={idx < 4} />)}
        </div>
      </div>

      <div className="mb-32">
        {activeAd ? (
          <Link href={activeAd.linkUrl || '#'} target="_blank" className="relative block w-full h-32 md:h-48 rounded-[40px] overflow-hidden shadow-2xl bg-slate-50 transition-all hover:ring-primary/20">
            <Image src={activeAd.imageUrl} alt="Ad" fill className="object-cover" priority />
          </Link>
        ) : (
          <div className="w-full h-16 bg-slate-50 rounded-[24px] border border-dashed flex items-center justify-center text-[9px] font-black tracking-[0.6em] text-slate-200 uppercase">Public Space</div>
        )}
      </div>

      <div className="mb-32">
        <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-slate-950 mb-10 pb-6 border-b-2 border-primary/20">紙面ビューアー</h2>
        {isArticlesLoading ? <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={40} /></div> : paperGroupedByDate.length > 0 ? (
          <div className="space-y-12">
            {paperGroupedByDate.map(([date, papers]) => (
              <div key={date} className="space-y-6">
                <div className="bg-primary px-6 py-2 rounded-sm text-white font-black text-xs tracking-widest">{papers[0]?.title || 'アーカイブ'}</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-10">
                  {papers.map((paper) => <PaperCard key={paper.id} article={paper as any} />)}
                </div>
              </div>
            ))}
            <Link href="/viewer" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary justify-end">VIEW ARCHIVES <ChevronRight size={14} /></Link>
          </div>
        ) : <div className="bg-slate-50 rounded-[32px] p-20 text-center border-2 border-dashed text-slate-400 font-bold">紙面データがありません</div>}
      </div>

      <div className="space-y-32">
        {CATEGORY_LIST.map((category) => {
          const catArticles = categoryGroups[category] || [];
          if (catArticles.length === 0) return null;
          return (
            <div key={category}>
              <div className="flex items-center justify-between mb-10 border-l-8 border-primary pl-6">
                <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic text-slate-950">{category}</h2>
                <Link href={`/category/${category}`} className="text-[10px] font-black uppercase tracking-widest text-primary">VIEW ALL</Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
                {catArticles.map((article) => <ArticleCard key={article.id} article={article as any} />)}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
